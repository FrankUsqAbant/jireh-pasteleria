/** Opciones del pedido a medida (sección "A medida" y mensaje de WhatsApp). */

export const SPONGES = ['Vainilla', 'Chocolate', 'Marmoleado', 'Red velvet', 'Keke de frutas'] as const;

export const FILLINGS = [
  'Manjar blanco cajamarquino',
  'Fudge de chocolate',
  'Chantilly con fresas',
  'Crema pastelera a la canela',
  'Mousse de maracuyá',
  'Duraznos en almíbar',
] as const;

export const FROSTINGS = [
  { label: 'Chantilly con frutas', specialty: false },
  { label: 'Crema con goteo de chocolate', specialty: false },
  { label: 'Lisa con flores naturales', specialty: false },
  { label: 'Rosetones de crema', specialty: true },
  { label: 'Temática en fondant', specialty: true },
] as const;

/** Porciones que se pueden elegir. */
export const PORTIONS = [10, 15, 20, 25, 30, 40, 50, 60] as const;

export const OCCASIONS = ['Cumpleaños', 'Infantil', 'Boda', 'Quinceaños', 'Bautizo', 'Otra ocasión'] as const;
