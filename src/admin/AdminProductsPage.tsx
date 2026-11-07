import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ExternalLink, KeyRound, LogOut, Plus, Search, Star } from 'lucide-react';
import type { CakeItem } from '../types/bakery';
import { CAKE_CATEGORIES, LOGO_URL } from '../data/bakeryData';
import { CakeForm, Interruptor } from './CakeForm';
import { changePassword, createCake, deleteCake, friendlyError, listCakes, updateCake } from './adminApi';

interface AdminProductsPageProps {
  onBackToStore: () => void;
  onLogout: () => void;
}

type Vista = { tipo: 'lista' } | { tipo: 'editar'; cake?: CakeItem };

const etiquetaCategoria = (id: string) => CAKE_CATEGORIES.find((c) => c.id === id)?.label ?? id;

/**
 * Panel del dueño: la lista de tortas con lo que más se usa a un toque (ocultar, destacar, editar)
 * y el formulario para agregar o editar. Pensado primero para el celular.
 */
export const AdminProductsPage: React.FC<AdminProductsPageProps> = ({ onBackToStore, onLogout }) => {
  const [products, setProducts] = useState<CakeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [vista, setVista] = useState<Vista>({ tipo: 'lista' });
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('todas');
  const [aviso, setAviso] = useState<{ texto: string; error?: boolean } | null>(null);
  const [aBorrar, setABorrar] = useState<CakeItem | null>(null);
  const [cuentaAbierta, setCuentaAbierta] = useState(false);
  const avisoTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const avisar = useCallback((texto: string, error = false) => {
    clearTimeout(avisoTimer.current);
    setAviso({ texto, error });
    avisoTimer.current = setTimeout(() => setAviso(null), error ? 6000 : 3000);
  }, []);
  const fallo = useCallback((err: unknown) => avisar(friendlyError(err), true), [avisar]);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setProducts(await listCakes());
    } catch (err) {
      fallo(err);
    } finally {
      setLoading(false);
    }
  }, [fallo]);

  useEffect(() => {
    void reload();
  }, [reload]);

  // Al cambiar de pantalla, volver arriba
  useEffect(() => {
    window.scrollTo({ top: 0 }); // en llaves: scrollTo puede devolver una promesa y React la tomaría como limpieza
  }, [vista]);

  const reemplazar = (saved: CakeItem) => setProducts((list) => list.map((p) => (p.id === saved.id ? saved : p)));

  /** Cambios rápidos desde la lista (visible / destacada): se ven al instante y se guardan. */
  const cambiar = async (cake: CakeItem, patch: Partial<CakeItem>, mensaje: string) => {
    const nuevo = { ...cake, ...patch };
    reemplazar(nuevo);
    try {
      const { id: _id, ...datos } = nuevo;
      reemplazar(await updateCake(cake.id, datos));
      avisar(mensaje);
    } catch (err) {
      reemplazar(cake); // deshacer
      fallo(err);
    }
  };

  const guardar = async (datos: Omit<CakeItem, 'id'>) => {
    if (vista.tipo !== 'editar') return;
    setBusy(true);
    try {
      if (vista.cake) {
        reemplazar(await updateCake(vista.cake.id, datos, vista.cake.imagePath));
        avisar(`Guardamos "${datos.name}".`);
      } else {
        const nueva = await createCake(datos);
        setProducts((list) => [nueva, ...list]);
        avisar(`"${datos.name}" ya está en la tienda.`);
      }
      setVista({ tipo: 'lista' });
    } catch (err) {
      fallo(err);
    } finally {
      setBusy(false);
    }
  };

  const borrar = async () => {
    if (!aBorrar) return;
    setBusy(true);
    try {
      await deleteCake(aBorrar);
      setProducts((list) => list.filter((p) => p.id !== aBorrar.id));
      avisar(`Eliminamos "${aBorrar.name}".`);
      setABorrar(null);
      setVista({ tipo: 'lista' });
    } catch (err) {
      fallo(err);
    } finally {
      setBusy(false);
    }
  };

  const q = query.trim().toLowerCase();
  const filtradas = products
    .filter((p) => category === 'todas' || p.category === category)
    .filter((p) => !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  const visibles = products.filter((p) => p.isActive !== false).length;
  const destacadas = products.filter((p) => p.isPopular).length;

  return (
    <div className="adm">
      <header className="adm-top">
        <div className="adm-top__bar">
          <div className="adm-marca">
            <img src={LOGO_URL} alt="" />
            <div>
              <strong>JIRÉH</strong>
              <span>Panel de la tienda</span>
            </div>
          </div>
          <div className="adm-top__acciones">
            <button type="button" className="adm-btn adm-btn--claro" onClick={onBackToStore} aria-label="Ver la tienda">
              <ExternalLink aria-hidden="true" />
              <span className="adm-ocultar-movil">Ver la tienda</span>
            </button>
            <button type="button" className="adm-btn adm-btn--claro adm-btn--icono" onClick={() => setCuentaAbierta(true)} aria-label="Mi cuenta">
              <KeyRound aria-hidden="true" />
            </button>
            <button type="button" className="adm-btn adm-btn--claro adm-btn--icono" onClick={onLogout} aria-label="Cerrar sesión">
              <LogOut aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <main className="adm-main">
        {vista.tipo === 'editar' ? (
          <CakeForm
            key={vista.cake?.id ?? 'nueva'}
            cake={vista.cake}
            busy={busy}
            onSave={guardar}
            onCancel={() => setVista({ tipo: 'lista' })}
            onDelete={vista.cake ? () => setABorrar(vista.cake!) : undefined}
            onError={(m) => avisar(m, true)}
          />
        ) : (
          <>
            <div className="adm-encabezado">
              <div>
                <h1>Tus tortas</h1>
                <p className="adm-resumen" aria-live="polite">
                  {loading && products.length === 0
                    ? 'Cargando…'
                    : `${products.length} tortas · ${visibles} visibles en la tienda · ${destacadas} destacadas`}
                </p>
              </div>
              <button type="button" className="adm-btn adm-btn--principal" onClick={() => setVista({ tipo: 'editar' })}>
                <Plus aria-hidden="true" /> Agregar torta
              </button>
            </div>

            <div className="adm-herramientas">
              <label className="adm-buscar">
                <Search aria-hidden="true" />
                <span className="sr-only">Buscar torta</span>
                <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nombre" />
              </label>
            </div>
            <div className="adm-chips" role="group" aria-label="Filtrar por categoría">
              {[{ id: 'todas', label: 'Todas' }, ...CAKE_CATEGORIES].map((c) => (
                <button key={c.id} type="button" className="adm-chip" aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>
                  {c.label}
                </button>
              ))}
            </div>

            {filtradas.length === 0 ? (
              <div className="adm-vacio">
                {loading ? 'Cargando tortas…' : products.length === 0 ? 'Todavía no hay tortas. Agrega la primera.' : 'No hay tortas con ese filtro.'}
              </div>
            ) : (
              <ul className="adm-lista">
                {filtradas.map((cake) => {
                  const visible = cake.isActive !== false;
                  return (
                    <li key={cake.id} className="adm-fila" data-oculta={!visible || undefined}>
                      <img className="adm-fila__foto" src={cake.image} alt="" loading="lazy" />
                      <button type="button" className="adm-fila__texto" onClick={() => setVista({ tipo: 'editar', cake })}>
                        <span className="adm-fila__nombre">{cake.name}</span>
                        <span className="adm-fila__meta">
                          {etiquetaCategoria(cake.category)} · <span className="adm-precio">S/ {cake.basePrice}</span>
                        </span>
                        {!visible && <span className="adm-fila__estado">Oculta en la tienda</span>}
                        <span className="sr-only">, editar</span>
                      </button>
                      <div className="adm-fila__acciones">
                        <Interruptor
                          compacto
                          titulo="Visible"
                          etiqueta={`Visible en la tienda: ${cake.name}`}
                          checked={visible}
                          onChange={(v) => cambiar(cake, { isActive: v }, v ? `"${cake.name}" vuelve a verse en la tienda.` : `"${cake.name}" quedó oculta.`)}
                        />
                        <button
                          type="button"
                          className="adm-estrella"
                          aria-pressed={Boolean(cake.isPopular)}
                          aria-label={`Destacada: ${cake.name}`}
                          onClick={() => cambiar(cake, { isPopular: !cake.isPopular }, cake.isPopular ? 'Ya no está destacada.' : 'Ahora aparece entre las primeras.')}
                        >
                          <Star aria-hidden="true" fill={cake.isPopular ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </main>

      <ConfirmarBorrado cake={aBorrar} busy={busy} onCancel={() => setABorrar(null)} onConfirm={borrar} />
      <MiCuenta abierta={cuentaAbierta} onClose={() => setCuentaAbierta(false)} products={products} onReload={reload} avisar={avisar} />

      {aviso && (
        <div className="adm-aviso" role={aviso.error ? 'alert' : 'status'} data-error={aviso.error || undefined}>
          {aviso.texto}
        </div>
      )}
    </div>
  );
};

/* ---------------------------------- diálogos ---------------------------------- */

/** <dialog> nativo: atrapa el foco y se cierra con Escape. */
function useDialogo(abierto: boolean) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (abierto && !d.open) d.showModal();
    if (!abierto && d.open) d.close();
  }, [abierto]);
  return ref;
}

const ConfirmarBorrado: React.FC<{ cake: CakeItem | null; busy: boolean; onCancel: () => void; onConfirm: () => void }> = ({ cake, busy, onCancel, onConfirm }) => {
  const ref = useDialogo(Boolean(cake));
  return (
    <dialog ref={ref} className="adm-dialogo" onClose={onCancel} aria-labelledby="borrar-titulo">
      <div className="adm-dialogo__cuerpo">
        <h2 id="borrar-titulo">¿Eliminar {cake?.name}?</h2>
        <p>Se borra de la tienda y no se puede deshacer. Si solo quieres dejar de mostrarla, apaga "Visible".</p>
        <div className="adm-dialogo__botones">
          <button type="button" className="adm-btn adm-btn--borde" onClick={onCancel}>
            Cancelar
          </button>
          <button type="button" className="adm-btn adm-btn--peligro" onClick={onConfirm} disabled={busy}>
            {busy ? 'Eliminando…' : 'Sí, eliminar'}
          </button>
        </div>
      </div>
    </dialog>
  );
};

const MiCuenta: React.FC<{
  abierta: boolean;
  onClose: () => void;
  products: CakeItem[];
  onReload: () => void;
  avisar: (t: string, error?: boolean) => void;
}> = ({ abierta, onClose, products, onReload, avisar }) => {
  const ref = useDialogo(abierta);
  const [clave, setClave] = useState('');
  const [repetir, setRepetir] = useState('');
  const [busy, setBusy] = useState(false);
  const valida = clave.length >= 10 && clave === repetir;

  const guardarClave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valida) return;
    setBusy(true);
    try {
      await changePassword(clave);
      setClave('');
      setRepetir('');
      avisar('Contraseña actualizada.');
      onClose();
    } catch (err) {
      avisar(friendlyError(err), true);
    } finally {
      setBusy(false);
    }
  };

  const descargar = () => {
    const blob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tortas-jireh-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <dialog ref={ref} className="adm-dialogo" onClose={onClose} aria-labelledby="cuenta-titulo">
      <form className="adm-dialogo__cuerpo" onSubmit={guardarClave}>
        <h2 id="cuenta-titulo">Mi cuenta</h2>
        <div className="adm-campo">
          <label htmlFor="c-nueva">Nueva contraseña</label>
          <input id="c-nueva" type="password" autoComplete="new-password" minLength={10} value={clave} onChange={(e) => setClave(e.target.value)} />
          <p className="adm-ayuda">Mínimo 10 caracteres.</p>
        </div>
        <div className="adm-campo">
          <label htmlFor="c-repetir">Repite la contraseña</label>
          <input id="c-repetir" type="password" autoComplete="new-password" value={repetir} onChange={(e) => setRepetir(e.target.value)} />
          {repetir && clave !== repetir && <p className="adm-ayuda" style={{ color: 'var(--fresa)' }}>No coinciden.</p>}
        </div>
        <div className="adm-dialogo__botones">
          <button type="submit" className="adm-btn adm-btn--principal" disabled={!valida || busy}>
            {busy ? 'Guardando…' : 'Cambiar contraseña'}
          </button>
        </div>
        <hr className="adm-separador" />
        <p>Copia de tus tortas y precios, por si la necesitas.</p>
        <div className="adm-dialogo__botones" style={{ justifyContent: 'flex-start' }}>
          <button type="button" className="adm-btn adm-btn--borde" onClick={descargar} disabled={products.length === 0}>
            Descargar copia
          </button>
          <button type="button" className="adm-btn adm-btn--borde" onClick={onReload}>
            Volver a cargar
          </button>
        </div>
        <hr className="adm-separador" />
        <div className="adm-dialogo__botones">
          <button type="button" className="adm-btn adm-btn--borde" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </form>
    </dialog>
  );
};
