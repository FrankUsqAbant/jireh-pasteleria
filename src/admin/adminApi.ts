import type { CakeItem } from '../types/bakery';
import { PHOTO_BUCKET } from '../lib/supabase';
import { adminClient } from './client';
import { cakeToRow, notifyCatalogChanged, rowToCake, type TortaRow } from '../lib/catalog';

/**
 * Operaciones del panel de administración. Todas pasan por las reglas RLS de Supabase:
 * si el usuario no es administrador, la base de datos las rechaza aunque alguien manipule el navegador.
 */

export type AdminStatus = 'no' | 'cambiar_clave' | 'admin';

function db() {
  const client = adminClient();
  if (!client) throw new Error('Falta la configuración de Supabase (VITE_SUPABASE_URL y VITE_SUPABASE_KEY).');
  return client;
}

/** Traduce los errores de Supabase a mensajes claros para el dueño. */
export function friendlyError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String((err as { message?: string })?.message ?? err);
  if (/invalid login credentials/i.test(msg)) return 'Correo o contraseña incorrectos.';
  if (/should be different/i.test(msg)) return 'La nueva contraseña debe ser distinta de la actual.';
  if (/at least|weak|short/i.test(msg)) return 'La contraseña es muy débil: usa al menos 10 caracteres.';
  if (/row-level security|permission denied|unauthorized|jwt/i.test(msg)) return 'Tu sesión no tiene permiso. Vuelve a ingresar.';
  if (/payload too large|exceeded the maximum/i.test(msg)) return 'La foto pesa más de 5 MB.';
  if (/mime type|invalid_mime/i.test(msg)) return 'Formato no permitido. Usa JPG, PNG o WebP.';
  if (/failed to fetch|network/i.test(msg)) return 'Sin conexión con el servidor. Revisa tu internet.';
  return 'Ocurrió un error inesperado. Intenta de nuevo.';
}

/* ---------------------------------- sesión ---------------------------------- */

export async function hasSession(): Promise<boolean> {
  const { data } = await db().auth.getSession();
  return Boolean(data.session);
}

export async function signIn(email: string, password: string) {
  const { error } = await db().auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw error;
}

export async function signOut() {
  await db().auth.signOut();
}

export async function getAdminStatus(): Promise<AdminStatus> {
  const { data, error } = await db().rpc('estado_admin');
  if (error) throw error;
  return (data as AdminStatus) ?? 'no';
}

export async function changePassword(newPassword: string) {
  const { error } = await db().auth.updateUser({ password: newPassword });
  if (error) throw error;
}

/* --------------------------------- catálogo --------------------------------- */

/** Todas las tortas, incluidas las ocultas (solo visible para el administrador). */
export async function listCakes(): Promise<CakeItem[]> {
  const { data, error } = await db().from('tortas').select('*').order('orden').order('creado');
  if (error) throw error;
  return (data as TortaRow[]).map(rowToCake);
}

export async function createCake(cake: Omit<CakeItem, 'id'>): Promise<CakeItem> {
  const { data, error } = await db().from('tortas').insert({ ...cakeToRow(cake), orden: -1 }).select().single();
  if (error) throw error;
  notifyCatalogChanged();
  return rowToCake(data as TortaRow);
}

export async function updateCake(id: string, cake: Omit<CakeItem, 'id'>, previousPhotoPath?: string): Promise<CakeItem> {
  const { data, error } = await db().from('tortas').update(cakeToRow(cake)).eq('id', id).select().single();
  if (error) throw error;
  if (previousPhotoPath && previousPhotoPath !== cake.imagePath) await deletePhoto(previousPhotoPath);
  notifyCatalogChanged();
  return rowToCake(data as TortaRow);
}

export async function deleteCake(cake: CakeItem) {
  const { error } = await db().from('tortas').delete().eq('id', cake.id);
  if (error) throw error;
  if (cake.imagePath) await deletePhoto(cake.imagePath);
  notifyCatalogChanged();
}

/* ----------------------------------- fotos ---------------------------------- */

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const PHOTO_TYPES: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

/** Sube una foto al almacenamiento y devuelve su URL pública y su ruta (para poder borrarla luego). */
export async function uploadPhoto(file: File): Promise<{ url: string; path: string }> {
  const ext = PHOTO_TYPES[file.type];
  if (!ext) throw new Error('invalid_mime');
  if (file.size > MAX_PHOTO_BYTES) throw new Error('exceeded the maximum');
  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;
  const storage = db().storage.from(PHOTO_BUCKET);
  const { error } = await storage.upload(path, file, { contentType: file.type, cacheControl: '31536000' });
  if (error) throw error;
  return { url: storage.getPublicUrl(path).data.publicUrl, path };
}

/** Borra una foto subida (si falla no interrumpe: la torta ya se guardó). */
export async function deletePhoto(path: string) {
  try {
    const { data, error } = await db().storage.from(PHOTO_BUCKET).remove([path]);
    if (error || !data?.length) console.warn('No se pudo borrar la foto', path, error?.message ?? 'sin permiso o no existe');
  } catch (err) {
    console.warn('No se pudo borrar la foto', path, err);
  }
}
