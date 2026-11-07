import type { LibroReclamacionEntry } from '../types/bakery';
import { restHeaders, supabaseConfig } from './supabase';

/**
 * Envío de hojas del Libro de Reclamaciones a Supabase (función `registrar_reclamo`).
 * El número de hoja (REC-2026-0001) lo asigna el servidor. La tabla no se puede leer desde internet:
 * solo el administrador la ve.
 */

export type ReclamoErrorTipo = 'sin_config' | 'limite' | 'datos' | 'red';

export class ReclamoError extends Error {
  constructor(public readonly tipo: ReclamoErrorTipo) {
    super(tipo);
    this.name = 'ReclamoError';
  }
}

export const RECLAMO_MENSAJES: Record<ReclamoErrorTipo, string> = {
  sin_config: 'El libro no está conectado en este momento. Escríbenos por WhatsApp o visítanos en la tienda.',
  limite: 'Se enviaron varias hojas desde esta conexión. Intenta de nuevo en una hora.',
  datos: 'Revisa los datos: el correo debe ser válido y el detalle tener al menos 10 caracteres.',
  red: 'No pudimos enviar la hoja. Revisa tu conexión e intenta de nuevo.',
};

export type ReclamoInput = Omit<LibroReclamacionEntry, 'id' | 'createdAt'>;

/** Arma el cuerpo que espera registrar_reclamo (exportada para los tests). */
export function toPayload(data: ReclamoInput, trap = '') {
  return {
    tipo: data.claimType === 'Queja' ? 'QUEJA' : 'RECLAMO',
    nombre: data.fullName,
    tipo_doc: data.documentType === 'Pasaporte' ? 'PASAPORTE' : data.documentType,
    nro_doc: data.documentNumber,
    telefono: data.phone,
    correo: data.email,
    domicilio: data.address,
    tipo_bien: data.serviceType === 'Servicio' ? 'SERVICIO' : 'PRODUCTO',
    monto: data.claimedAmount,
    detalle: data.details,
    pedido: data.consumerRequest,
    website: trap,
  };
}

export async function enviarReclamo(data: ReclamoInput, trap = ''): Promise<{ code: string; createdAt: string }> {
  const cfg = supabaseConfig();
  if (!cfg) throw new ReclamoError('sin_config');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);
  try {
    const res = await fetch(`${cfg.url}/rest/v1/rpc/registrar_reclamo`, {
      method: 'POST',
      headers: { ...restHeaders(cfg.key), 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({ p: toPayload(data, trap) }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      const message = String(body?.message ?? '');
      if (message.includes('limite_excedido')) throw new ReclamoError('limite');
      if (message.includes('datos_invalidos')) throw new ReclamoError('datos');
      throw new ReclamoError('red');
    }
    const json = await res.json();
    if (typeof json?.codigo !== 'string') throw new ReclamoError('red');
    return { code: json.codigo, createdAt: String(json.creado_en ?? new Date().toISOString()) };
  } catch (err) {
    if (err instanceof ReclamoError) throw err;
    throw new ReclamoError('red');
  } finally {
    clearTimeout(timer);
  }
}
