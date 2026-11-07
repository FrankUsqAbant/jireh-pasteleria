import test from 'node:test';
import assert from 'node:assert/strict';
import { toPayload, type ReclamoInput } from './reclamos';

const base: ReclamoInput = {
  fullName: 'Ana Pérez',
  documentType: 'Pasaporte',
  documentNumber: 'AB12345',
  phone: '943000000',
  email: 'ana@correo.pe',
  address: 'Jr. Amalia Puga 100',
  serviceType: 'Servicio',
  claimedAmount: '95',
  claimType: 'Queja',
  details: 'La torta llegó una hora tarde.',
  consumerRequest: 'Que se mejore la puntualidad.',
};

test('toPayload traduce el formulario al formato de registrar_reclamo', () => {
  const p = toPayload(base);
  assert.equal(p.tipo, 'QUEJA');
  assert.equal(p.tipo_doc, 'PASAPORTE');
  assert.equal(p.tipo_bien, 'SERVICIO');
  assert.equal(p.website, '');
});

test('toPayload usa RECLAMO y PRODUCTO por defecto', () => {
  const p = toPayload({ ...base, claimType: 'Reclamo', serviceType: 'Producto', documentType: 'DNI' }, 'bot');
  assert.equal(p.tipo, 'RECLAMO');
  assert.equal(p.tipo_bien, 'PRODUCTO');
  assert.equal(p.tipo_doc, 'DNI');
  assert.equal(p.website, 'bot', 'el campo trampa viaja para que el servidor rechace al bot');
});
