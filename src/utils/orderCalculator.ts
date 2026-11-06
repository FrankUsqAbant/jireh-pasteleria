import { CustomCakeOrder } from '../types/bakery';

export const STORE_PHONE = '+51943347113';
export const STORE_PHONE_DISPLAY = '+51 943 347 113';
export const STORE_ADDRESS = 'Av. San Martín de Porres 787, Cajamarca, Perú (Intersección Andes)';
export const STORE_RUC = '10417863007';

/**
 * Checks if the store in Cajamarca is currently open (2:00 PM - 10:00 PM, Monday - Sunday)
 */
export function isStoreOpen(date: Date = new Date()): { isOpen: boolean; statusText: string; nextOpeningText: string } {
  // Convert or check local hour in Peru (UTC-5)
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  // Peru is UTC-5
  const peruDate = new Date(utc - 3600000 * 5);
  const hour = peruDate.getHours();
  const minutes = peruDate.getMinutes();
  const timeDecimal = hour + minutes / 60;

  // Open 14:00 (2:00 PM) to 22:00 (10:00 PM)
  const isOpen = timeDecimal >= 14 && timeDecimal < 22;

  let statusText = isOpen ? 'Abierto ahora' : 'Cerrado ahora';
  let nextOpeningText = isOpen
    ? 'Atendiendo hasta las 10:00 p.m.'
    : 'Abre hoy a las 2:00 p.m.';

  return { isOpen, statusText, nextOpeningText };
}

/**
 * Calculates estimated starting price in Peruvian Soles (S/.) based on portions and complexity
 */
export function estimateCakePrice(portions: number, isSpecialty: boolean = false): number {
  if (portions <= 0) return 0;
  // Base rate approx S/. 3.50 - 4.50 per portion depending on size
  const baseRate = isSpecialty ? 4.2 : 3.8;
  const rawPrice = portions * baseRate;
  // Round to nearest 5 soles for neat bakery pricing
  return Math.max(35, Math.ceil(rawPrice / 5) * 5);
}

/**
 * Generates an encoded WhatsApp URL with custom cake order details
 */
export function generateWhatsAppOrderUrl(order: Partial<CustomCakeOrder>): string {
  const lines: string[] = [
    '🎂 *¡Hola JIRÉH Panadería y Pastelería!*',
    'Quisiera cotizar y coordinar un pedido personalizado:',
    '',
    order.category ? `• *Categoría:* ${order.category.toUpperCase()}` : '',
    order.portions ? `• *Porciones:* ${order.portions} personas` : '',
    order.spongeFlavor ? `• *Bizcocho:* ${order.spongeFlavor}` : '',
    order.filling1 ? `• *Rellenos:* ${order.filling1}${order.filling2 ? ` y ${order.filling2}` : ''}` : '',
    order.frostingType ? `• *Acabado / Cobertura:* ${order.frostingType}` : '',
    order.themeNotes ? `• *Diseño / Temática:* ${order.themeNotes}` : '',
    order.dedicationText ? `• *Mensaje en torta:* "${order.dedicationText}"` : '',
    order.deliveryDate ? `• *Fecha del evento:* ${order.deliveryDate}` : '',
    order.customerName ? `• *Nombre del cliente:* ${order.customerName}` : '',
    '',
    '¿Tienen disponibilidad para esta fecha? Muchas gracias.'
  ].filter(Boolean);

  const text = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/51943347113?text=${text}`;
}

/**
 * Generates a direct WhatsApp quote URL for a specific catalog cake
 */
export function generateWhatsAppCakeQuote(cakeName: string, portions?: string): string {
  const message = [
    '🎂 *¡Hola JIRÉH Panadería y Pastelería!*',
    `Me interesa cotizar la *${cakeName}*${portions ? ` (${portions})` : ''} que vi en su catálogo web.`,
    '¿Podrían brindarme información de disponibilidad y precio para los próximos días?',
    '¡Muchas gracias!'
  ].join('\n');

  return `https://wa.me/51943347113?text=${encodeURIComponent(message)}`;
}
