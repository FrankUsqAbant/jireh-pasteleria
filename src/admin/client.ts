import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { supabaseConfig } from '../lib/supabase';

let client: SupabaseClient | null = null;

/**
 * Cliente con sesión, solo para el panel de administración (la tienda lee el catálogo con fetch y no
 * descarga esta librería). La sesión vive en localStorage para que sirva en todas las pestañas; el panel
 * la cierra al pulsar "Salir" o tras 60 minutos sin uso.
 */
export function adminClient(): SupabaseClient | null {
  const cfg = supabaseConfig();
  if (!cfg) return null;
  client ??= createClient(cfg.url, cfg.key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storageKey: 'jireh-admin-auth' },
  });
  return client;
}
