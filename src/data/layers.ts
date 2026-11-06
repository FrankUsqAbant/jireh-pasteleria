/**
 * Capas de una torta JIRÉH. La tajada (CakeSlice) y el pedido por WhatsApp leen de aquí,
 * así el dibujo y el mensaje nunca se contradicen.
 */

export type Crumb = 'none' | 'chips' | 'swirl' | 'fruit';
export type Bits = 'none' | 'berries' | 'peach' | 'seeds';
export type Topping = 'berries' | 'rosettes' | 'flower' | 'stars' | 'fruit';

export interface SpongeOption {
  id: string;
  label: string;
  color: string;
  /** Tono de la miga (puntos de textura). */
  crumbColor: string;
  crumb: Crumb;
}

export interface FillingOption {
  id: string;
  label: string;
  color: string;
  bits: Bits;
}

export interface FrostingOption {
  id: string;
  label: string;
  color: string;
  /** Color de los costados y la gota. */
  edge: string;
  drip: boolean;
  topping: Topping;
  /** Lleva trabajo de decoración: el precio estimado sube. */
  specialty: boolean;
}

export const SPONGES: SpongeOption[] = [
  { id: 'chocolate', label: 'Chocolate intenso', color: '#4b2617', crumbColor: '#6a3a24', crumb: 'none' },
  { id: 'vainilla', label: 'Vainilla con chispas', color: '#efcf8f', crumbColor: '#3a1c10', crumb: 'chips' },
  { id: 'marmoleado', label: 'Marmoleado', color: '#e9c788', crumbColor: '#5a3220', crumb: 'swirl' },
  { id: 'redvelvet', label: 'Red velvet', color: '#8f2230', crumbColor: '#a8394a', crumb: 'none' },
  { id: 'frutas', label: 'Keke de frutas', color: '#c98b4d', crumbColor: '#9c2b2b', crumb: 'fruit' },
];

export const FILLINGS: FillingOption[] = [
  { id: 'manjar', label: 'Manjar blanco cajamarquino', color: '#c4813d', bits: 'none' },
  { id: 'fudge', label: 'Fudge de chocolate', color: '#331810', bits: 'none' },
  { id: 'chantilly', label: 'Chantilly con fresas', color: '#fbf3e6', bits: 'berries' },
  { id: 'pastelera', label: 'Crema pastelera a la canela', color: '#f1d48c', bits: 'none' },
  { id: 'maracuya', label: 'Mousse de maracuyá', color: '#f0bf2e', bits: 'seeds' },
  { id: 'durazno', label: 'Duraznos en almíbar', color: '#f6dcae', bits: 'peach' },
];

export const FROSTINGS: FrostingOption[] = [
  { id: 'drip', label: 'Chocolate drip con fresas', color: '#2f170e', edge: '#3a1d12', drip: true, topping: 'berries', specialty: false },
  { id: 'rosetones', label: 'Rosetones de crema suiza', color: '#f4cfcf', edge: '#f1c3c4', drip: false, topping: 'rosettes', specialty: true },
  { id: 'satinada', label: 'Lisa satinada con flores', color: '#fbf5ec', edge: '#f3eadb', drip: false, topping: 'flower', specialty: false },
  { id: 'fondant', label: 'Temática en fondant', color: '#a9d3ec', edge: '#97c6e3', drip: false, topping: 'stars', specialty: true },
  { id: 'chantilly', label: 'Chantilly con frutas', color: '#fffaf1', edge: '#f6eee0', drip: false, topping: 'fruit', specialty: false },
];

export const OCCASIONS = ['Cumpleaños', 'Infantil', 'Boda', 'Quinceaños', 'Bautizo', 'Otra ocasión'] as const;

export interface CakeChoice {
  sponge: SpongeOption;
  filling1: FillingOption;
  filling2: FillingOption;
  frosting: FrostingOption;
}

/** La de la casa: la que se ve en la portada. */
export const HOUSE_CAKE: CakeChoice = {
  sponge: SPONGES[1],
  filling1: FILLINGS[0],
  filling2: FILLINGS[1],
  frosting: FROSTINGS[0],
};
