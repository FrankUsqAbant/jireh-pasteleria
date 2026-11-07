import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LOGO_URL } from '../data/bakeryData';
import { AdminProductsPage } from './AdminProductsPage';
import { changePassword, friendlyError, getAdminStatus, hasSession, signIn, signOut } from './adminApi';
import { supabaseConfig } from '../lib/supabase';
import './admin.css';

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
      {screen === 'loading' && <p className="adm-nota" aria-live="polite">Verificando sesión…</p>}
      {screen === 'no_config' && (
        <p className="adm-error">Falta la configuración de Supabase (VITE_SUPABASE_URL y VITE_SUPABASE_KEY en .env.local).</p>
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
      {screen === 'change_password' && <ChangePasswordForm onDone={() => setScreen('loading')} onCancel={() => void logout()} />}
    </AuthLayout>
  );
};

/* ------------------------------------ piezas ------------------------------------ */

const AuthLayout: React.FC<{ onBackToStore: () => void; children: React.ReactNode }> = ({ onBackToStore, children }) => (
  <div className="adm adm-acceso">
    <main className="adm-acceso__caja">
      <div className="adm-acceso__marca">
        <img src={LOGO_URL} alt="" />
        <h1>Panel de JIRÉH</h1>
        <p>Administra las tortas de la tienda</p>
      </div>
      {children}
    </main>
    <button type="button" className="adm-volver" onClick={onBackToStore}>
      Volver a la tienda
    </button>
  </div>
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
    <form onSubmit={submit}>
      {notice && <p className="adm-nota">{notice}</p>}
      <div className="adm-campo">
        <label htmlFor="admin-email">Correo</label>
        <input id="admin-email" type="email" autoComplete="username" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="adm-campo">
        <label htmlFor="admin-password">Contraseña</label>
        <input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {error && <p role="alert" className="adm-error">{error}</p>}
      <button type="submit" disabled={busy} className="adm-btn adm-btn--principal">
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
    <form onSubmit={submit}>
      <p className="adm-nota">Es tu primer ingreso: crea tu propia contraseña.</p>
      <div className="adm-campo">
        <label htmlFor="admin-new">Nueva contraseña</label>
        <input id="admin-new" type="password" autoComplete="new-password" required minLength={10} autoFocus value={password} onChange={(e) => setPassword(e.target.value)} />
        <p className="adm-ayuda">Mínimo 10 caracteres.</p>
      </div>
      <div className="adm-campo">
        <label htmlFor="admin-confirm">Repite la contraseña</label>
        <input id="admin-confirm" type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        {confirm && password !== confirm && <p className="adm-ayuda" style={{ color: 'var(--fresa)' }}>Las contraseñas no coinciden.</p>}
      </div>
      {error && <p role="alert" className="adm-error">{error}</p>}
      <button type="submit" disabled={!valid || busy} className="adm-btn adm-btn--principal">
        {busy ? 'Guardando…' : 'Guardar y entrar'}
      </button>
      <button type="button" onClick={onCancel} className="adm-volver" style={{ color: 'var(--muted)' }}>
        Cerrar sesión
      </button>
    </form>
  );
};
