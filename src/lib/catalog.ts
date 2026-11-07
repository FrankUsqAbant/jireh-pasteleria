import { useSyncExternalStore } from 'react';
import type { CakeCategory, CakeItem } from '../types/bakery';
import { FEATURED_SPECIALTIES, GALLERY_CAKES } from '../data/bakeryData';
import { CATALOG_CHANNEL, PHOTO_BUCKET, restHeaders, supabaseConfig } from './supabase';

/**
 * Catálogo de tortas desde Supabase (tabla `tortas`). Cualquiera lee las tortas activas; solo el
 * administrador las modifica. Si no hay conexión o falta la configuración se muestra el catálogo
 * incluido en el sitio, para que la tienda nunca quede vacía.
 */

/** Fila tal como está en la base de datos. */
export interface TortaRow {
  id: string;
  nombre: string;
  categoria: CakeCategory;
  descripcion: string;
  porciones: string;
  precio: number | string;
  imagen_url: string;
  imagen_path: string | null;
  etiqueta: string | null;
  destacada: boolean;
  personalizable: boolean;
  sabores: string[];
  rellenos: string[];
  activo: boolean;
  orden: number;
}

/** Catálogo incluido en el sitio (sin repetidos), usado como respaldo. */
export const FALLBACK_CATALOG: CakeItem[] = [
  ...new Map([...FEATURED_SPECIALTIES, ...GALLERY_CAKES].map((c) => [c.id, c])).values(),
];

/** Solo se muestran fotos del propio sitio o del almacenamiento de este proyecto. */
export function isTrustedImage(url: string): boolean {
  const cfg = supabaseConfig();
  if (url.startsWith('/assets/')) return true;
  return Boolean(cfg && url.startsWith(`${cfg.url}/storage/v1/object/public/${PHOTO_BUCKET}/`));
}

export function rowToCake(row: TortaRow): CakeItem {
  return {
    id: row.id,
    name: row.nombre,
    category: row.categoria,
    description: row.descripcion,
    portions: row.porciones,
    basePrice: Number(row.precio),
    image: row.imagen_url,
    imagePath: row.imagen_path ?? undefined,
    badge: row.etiqueta ?? undefined,
    isPopular: row.destacada,
    isCustomizable: row.personalizable,
    flavors: row.sabores.length ? row.sabores : undefined,
    fillings: row.rellenos.length ? row.rellenos : undefined,
    isActive: row.activo,
  };
}

/** Campos editables de una torta, en el formato de la base de datos. */
export function cakeToRow(cake: Omit<CakeItem, 'id'>) {
  return {
    nombre: cake.name.trim(),
    categoria: cake.category,
    descripcion: cake.description.trim(),
    porciones: cake.portions.trim(),
    precio: cake.basePrice,
    imagen_url: cake.image,
    imagen_path: cake.imagePath ?? null,
    etiqueta: cake.badge?.trim() || null,
    destacada: Boolean(cake.isPopular),
    personalizable: cake.isCustomizable !== false,
    sabores: cake.flavors ?? [],
    rellenos: cake.fillings ?? [],
    activo: cake.isActive !== false,
  };
}

/* ------------------------------ almacén reactivo ------------------------------ */

export interface CatalogState {
  products: CakeItem[];
  /** loading: esperando respuesta · ready: desde la base de datos · fallback: catálogo incluido en el sitio */
  status: 'loading' | 'ready' | 'fallback';
}

let state: CatalogState = { products: FALLBACK_CATALOG, status: 'loading' };
const listeners = new Set<() => void>();
const setState = (next: CatalogState) => {
  state = next;
  listeners.forEach((l) => l());
};

let inFlight: Promise<void> | null = null;

/** Vuelve a leer el catálogo público. */
export function refreshCatalog(): Promise<void> {
  inFlight ??= (async () => {
    const cfg = supabaseConfig();
    if (!cfg) return setState({ products: FALLBACK_CATALOG, status: 'fallback' });
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const res = await fetch(`${cfg.url}/rest/v1/tortas?select=*&activo=eq.true&order=orden.asc,creado.asc`, {
        headers: restHeaders(cfg.key),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const rows = (await res.json()) as TortaRow[];
      setState({ products: rows.filter((r) => isTrustedImage(r.imagen_url)).map(rowToCake), status: 'ready' });
    } catch {
      // Sin conexión: se conserva lo último cargado o, si nunca cargó, el catálogo incluido en el sitio.
      if (state.status !== 'ready') setState({ products: FALLBACK_CATALOG, status: 'fallback' });
    } finally {
      clearTimeout(timer);
      inFlight = null;
    }
  })();
  return inFlight;
}

let started = false;
function start() {
  if (started || typeof window === 'undefined') return;
  started = true;
  void refreshCatalog();
  // El panel de administración avisa por este canal cuando cambia algo.
  try {
    new BroadcastChannel(CATALOG_CHANNEL).onmessage = () => void refreshCatalog();
  } catch {
    /* navegador sin BroadcastChannel: el cambio se verá al recargar */
  }
}

function subscribe(listener: () => void) {
  start();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Catálogo público para la tienda. */
export function useCatalog(): CatalogState {
  return useSyncExternalStore(subscribe, () => state, () => state);
}

/** Avisa a las pestañas abiertas de la tienda que el catálogo cambió. */
export function notifyCatalogChanged() {
  try {
    const channel = new BroadcastChannel(CATALOG_CHANNEL);
    channel.postMessage('cambio');
    channel.close();
  } catch {
    /* sin BroadcastChannel */
  }
  void refreshCatalog();
}
