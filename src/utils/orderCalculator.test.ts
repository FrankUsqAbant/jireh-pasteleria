import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateCakePrice, generateWhatsAppCakeQuote, isStoreOpen, STORE_PHONE } from './orderCalculator';

test('estimateCakePrice calculates reasonable price in soles', () => {
  const price10 = estimateCakePrice(10);
  assert.ok(price10 >= 35, 'Price for 10 portions should be at least S/. 35');

  const price25 = estimateCakePrice(25);
  assert.ok(price25 > price10, 'Price should scale with portions');

  const priceSpecialty = estimateCakePrice(25, true);
  assert.ok(priceSpecialty >= price25, 'Specialty cake price should be greater or equal to standard');
});

test('generateWhatsAppCakeQuote generates valid WhatsApp link with phone and name', () => {
  const url = generateWhatsAppCakeQuote('Torta Rosas de Ensueño', '25-30 porciones');
  assert.ok(url.startsWith('https://wa.me/51943347113'), 'URL should point to correct Jireh phone');
  assert.ok(url.includes('Torta%20Rosas%20de%20Ensue%C3%B1o'), 'URL should include encoded cake name');
});

test('isStoreOpen correctly identifies open vs closed hours', () => {
  // Test 15:00 (3 PM) UTC-5: 20:00 UTC
  const openTime = new Date('2026-11-02T20:00:00Z');
  const resOpen = isStoreOpen(openTime);
  assert.equal(resOpen.isOpen, true);
  assert.equal(resOpen.statusText, 'Abierto ahora');

  // Test 09:00 (9 AM) UTC-5: 14:00 UTC
  const closedMorning = new Date('2026-11-02T14:00:00Z');
  const resClosed = isStoreOpen(closedMorning);
  assert.equal(resClosed.isOpen, false);
  assert.equal(resClosed.statusText, 'Cerrado ahora');
});

test('productStore provides non-empty initial catalog and default PIN', async () => {
  const { getInitialCatalog, DEFAULT_ADMIN_PIN, getAdminPin } = await import('./productStore');
  const catalog = getInitialCatalog();
  assert.ok(catalog.length >= 5, 'Initial catalog should have at least 5 products');
  assert.equal(DEFAULT_ADMIN_PIN, '1234');
  assert.equal(getAdminPin(), '1234');
});
