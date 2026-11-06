/**
 * Conexión con Supabase (variables VITE_SUPABASE_URL y VITE_SUPABASE_KEY en .env.local).
 * La clave "publishable" es pública por diseño: qué se puede leer o escribir lo deciden las reglas RLS
 * de la base de datos (ver supabase/migrations), no el navegador.
 */
export function supabaseConfig() {
  const env = import.meta.env ?? {}; // fuera de Vite (tests) no hay env
  const url = (env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/+$/, '');
  const key = env.VITE_SUPABASE_KEY as string | undefined;
  return url && key ? { url, key } : null;
}

/** Cabeceras de la API REST pública (la clave anon clásica es un JWT; la "publishable" va solo en apikey). */
export function restHeaders(key: string): Record<string, string> {
  const headers: Record<string, string> = { apikey: key };
  if (key.startsWith('eyJ')) headers.Authorization = `Bearer ${key}`;
  return headers;
}

/** Bucket de Storage con las fotos de las tortas. */
export const PHOTO_BUCKET = 'tortas';

/** Canal por el que el panel avisa a la tienda abierta en otra pestaña que el catálogo cambió. */
export const CATALOG_CHANNEL = 'jireh-catalogo';
