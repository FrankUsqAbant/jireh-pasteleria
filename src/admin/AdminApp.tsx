import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowLeft, KeyRound, Lock } from 'lucide-react';
import { LOGO_URL } from '../data/bakeryData';
import { AdminProductsPage } from './AdminProductsPage';
import { changePassword, friendlyError, getAdminStatus, hasSession, signIn, signOut } from './adminApi';
import { supabaseConfig } from '../lib/supabase';

/** Minutos sin actividad tras los que se cierra la sesión del panel. */
const IDLE_MINUTES = 60;

type Screen = 'loading' | 'login' | 'change_password' | 'workspace' | 'no_config';

/**
 * Entrada al panel de administración: inicio de sesión con Supabase Auth, cambio obligatorio de la
 * clave temporal y cierre automático por inactividad.
 */
export const AdminApp: React.FC<{ onBackToStore: () => void }> = ({ onBackToStore }) => {
  const [screen, setScreen] = useState<Screen>(() => (supabaseConfig() ? 'loading' : 'no_config'));
  const [notice, setNotice] = useState<string | null>(null);

  /** Decide qué pantalla mostrar según la sesión y el estado del administrador. */
  const resolve = useCallback(async () => {
    try {
      if (!(await hasSession())) return setScreen('login');
      const status = await getAdminStatus();
      if (status === 'admin') return setScreen('workspace');
      if (status === 'cambiar_clave') return setScreen('change_password');
      await signOut();
      setNotice('Esta cuenta no tiene permiso de administrador.');
      setScreen('login');
    } catch (err) {
      setNotice(friendlyError(err));
      setScreen('login');
    }
  }, []);

  useEffect(() => {
    if (screen === 'loading') void resolve();
  }, [screen, resolve]);

  const logout = useCallback(async (message?: string) => {
    await signOut().catch(() => undefined);
    setNotice(message ?? null);
    setScreen('login');
  }, []);

  // Cierre por inactividad (solo con sesión abierta)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    if (screen !== 'workspace' && screen !== 'change_password') return;
    const reset = () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(
        () => void logout(`Cerramos tu sesión tras ${IDLE_MINUTES} minutos sin actividad.`),
        IDLE_MINUTES * 60_000,
      );
    };
    const events = ['pointerdown', 'keydown', 'scroll'] as const;
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      clearTimeout(timer.current);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [screen, logout]);

  if (screen === 'workspace') {
    return <AdminProductsPage onBackToStore={onBackToStore} onLogout={() => void logout()} />;
  }

  return (
    <AuthLayout onBackToStore={onBackToStore}>
      {screen === 'loading' && <p className="text-sm text-[#dfcca9]" aria-live="polite">Verificando sesión…</p>}
      {screen === 'no_config' && (
        <p className="text-sm text-[#dfcca9]">
          Falta la configuración de Supabase (VITE_SUPABASE_URL y VITE_SUPABASE_KEY en .env.local).
        </p>
      )}
      {screen === 'login' && (
        <LoginForm
          notice={notice}
          onDone={() => {
            setNotice(null);
            setScreen('loading');
          }}
        />
      )}
      {screen === 'change_password' && (
        <ChangePasswordForm onDone={() => setScreen('loading')} onCancel={() => void logout()} />
      )}
    </AuthLayout>
  );
};

/* ------------------------------------ piezas ------------------------------------ */

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-[#0b0604] border border-[#d69c4f]/40 text-sm text-[#faf3e8] placeholder:text-[#88705b] focus:outline-none focus:border-[#e8b66f] focus:ring-2 focus:ring-[#e8b66f]/30';
const buttonClass =
  'w-full py-3.5 px-6 rounded-xl bg-[#d69c4f] hover:bg-[#e4ac61] text-[#150e09] font-bold text-sm tracking-wide shadow-xl transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait focus:outline-none focus-visible:ring-2 focus-visible:ring-[#faf3e8]';

const AuthLayout: React.FC<{ onBackToStore: () => void; children: React.ReactNode }> = ({ onBackToStore, children }) => (
  <div className="min-h-screen bg-[#0e0805] text-[#faf3e8] flex flex-col items-center justify-center p-4 selection:bg-[#d69c4f] selection:text-[#150e09]">
    <div className="mb-6">
      <button
        onClick={onBackToStore}
        className="inline-flex items-center gap-2 text-xs text-[#dfcca9] hover:text-[#faf3e8] bg-[#1a110a] hover:bg-[#28180e] border border-[#3d2719] px-4 py-2 rounded-full transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 text-[#e8b66f]" />
        <span>Volver a la tienda</span>
      </button>
    </div>

    <main className="max-w-md w-full bg-[#150e09] border border-[#d69c4f]/40 rounded-3xl p-8 sm:p-10 text-center shadow-2xl">
      <div className="w-20 h-20 rounded-full bg-[#faf3e8] border-2 border-[#d69c4f] p-1 mx-auto mb-5 shadow-lg overflow-hidden">
        <img src={LOGO_URL} alt="JIRÉH" className="w-full h-full object-cover rounded-full" />
      </div>
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#faf3e8] mb-1">Panel de Administración</h1>
      <p className="text-xs text-[#dfcca9] mb-6">JIRÉH Panadería y Pastelería — Catálogo de tortas</p>
      {children}
    </main>
  </div>
);

const ErrorText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p role="alert" className="text-xs text-red-300 flex items-center justify-center gap-1.5">
    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {children}
  </p>
);

const LoginForm: React.FC<{ notice: string | null; onDone: () => void }> = ({ notice, onDone }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn(email, password);
      onDone();
    } catch (err) {
      setError(friendlyError(err));
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 text-left">
      {notice && <p className="text-xs text-[#e8b66f] text-center">{notice}</p>}
      <div>
        <label htmlFor="admin-email" className="block text-xs font-semibold text-[#a89078] mb-1.5">Correo</label>
        <input id="admin-email" type="email" autoComplete="username" required autoFocus value={email}
          onChange={(e) => setEmail(e.target.value)} className={inputClass} />
      </div>
      <div>
        <label htmlFor="admin-password" className="block text-xs font-semibold text-[#a89078] mb-1.5">Contraseña</label>
        <input id="admin-password" type="password" autoComplete="current-password" required value={password}
          onChange={(e) => setPassword(e.target.value)} className={inputClass} />
      </div>
      {error && <ErrorText>{error}</ErrorText>}
      <button type="submit" disabled={busy} className={buttonClass}>
        <Lock className="w-4 h-4 inline mr-2 -mt-0.5" />
        {busy ? 'Ingresando…' : 'Ingresar'}
      </button>
    </form>
  );
};

const ChangePasswordForm: React.FC<{ onDone: () => void; onCancel: () => void }> = ({ onDone, onCancel }) => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const valid = password.length >= 10 && password === confirm;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setBusy(true);
    setError(null);
    try {
      await changePassword(password);
      onDone();
    } catch (err) {
      setError(friendlyError(err));
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 text-left">
      <p className="text-xs text-[#e8b66f] text-center flex items-center justify-center gap-1.5">
        <KeyRound className="w-4 h-4" /> Es tu primer ingreso: crea tu propia contraseña.
      </p>
      <div>
        <label htmlFor="admin-new" className="block text-xs font-semibold text-[#a89078] mb-1.5">
          Nueva contraseña (mínimo 10 caracteres)
        </label>
        <input id="admin-new" type="password" autoComplete="new-password" required minLength={10} autoFocus
          value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
      </div>
      <div>
        <label htmlFor="admin-confirm" className="block text-xs font-semibold text-[#a89078] mb-1.5">Repite la contraseña</label>
        <input id="admin-confirm" type="password" autoComplete="new-password" required value={confirm}
          onChange={(e) => setConfirm(e.target.value)} className={inputClass} />
        {confirm && password !== confirm && <p className="text-[11px] text-red-300 mt-1">Las contraseñas no coinciden.</p>}
      </div>
      {error && <ErrorText>{error}</ErrorText>}
      <button type="submit" disabled={!valid || busy} className={buttonClass}>
        {busy ? 'Guardando…' : 'Guardar y entrar'}
      </button>
      <button type="button" onClick={onCancel} className="w-full text-xs text-[#a89078] hover:text-[#faf3e8] underline cursor-pointer">
        Cerrar sesión
      </button>
    </form>
  );
};
