import test from 'node:test';
import assert from 'node:assert/strict';
import { cakeToRow, FALLBACK_CATALOG, isTrustedImage, rowToCake, type TortaRow } from './catalog';

const row: TortaRow = {
  id: 'b7a1',
  nombre: 'Torta Selva Negra',
  categoria: 'cumpleanos',
  descripcion: 'Chantilly y cerezas',
  porciones: '20 porciones',
  precio: '75.00',
  imagen_url: '/assets/tortas/selva-negra.webp',
  imagen_path: null,
  etiqueta: null,
  destacada: true,
  personalizable: true,
  sabores: ['Chocolate'],
  rellenos: [],
  activo: true,
  orden: 0,
};

test('rowToCake convierte la fila de la base al formato de la web', () => {
  const cake = rowToCake(row);
  assert.equal(cake.basePrice, 75, 'el precio llega como texto desde numeric y debe ser número');
  assert.equal(cake.isPopular, true);
  assert.deepEqual(cake.flavors, ['Chocolate']);
  assert.equal(cake.fillings, undefined, 'listas vacías no se muestran');
  assert.equal(cake.badge, undefined);
});

test('cakeToRow vuelve al formato de la base sin perder datos', () => {
  const { id: _id, ...cake } = rowToCake(row);
  const back = cakeToRow(cake);
  assert.equal(back.nombre, row.nombre);
  assert.equal(back.precio, 75);
  assert.deepEqual(back.sabores, ['Chocolate']);
  assert.deepEqual(back.rellenos, []);
  assert.equal(back.etiqueta, null);
  assert.equal(back.imagen_path, null);
});

test('solo se aceptan fotos del propio sitio', () => {
  assert.ok(isTrustedImage('/assets/tortas/rosas-ensueno.webp'));
  assert.ok(!isTrustedImage('https://otro-sitio.com/foto.jpg'));
  assert.ok(!isTrustedImage('javascript:alert(1)'));
});

test('el catálogo de respaldo no tiene tortas repetidas', () => {
  const ids = FALLBACK_CATALOG.map((c) => c.id);
  assert.ok(ids.length >= 5);
  assert.equal(new Set(ids).size, ids.length);
});
