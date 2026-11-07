import { CakeItem, ReviewItem } from '../types/bakery';

export const LOGO_URL = '/assets/logo-jireh.webp';
export const CAKE_CATEGORIES = [
  { id: 'cumpleanos', label: 'Cumpleaños' },
  { id: 'infantiles', label: 'Infantiles' },
  { id: 'bodas', label: 'Bodas y eventos' },
  { id: 'tematicas', label: 'Temáticas' },
  { id: 'panaderia', label: 'Panadería y dulces' },
] as const;

export const FEATURED_SPECIALTIES: CakeItem[] = [
  {
    id: 'torta-infantil-paw',
    name: 'Torta Arcoíris Infantil',
    category: 'infantiles',
    description: 'Capas de bizcocho de colores con crema de vainilla y chispas: la que piden los más pequeños.',
    portions: '20-25 porciones',
    basePrice: 85,
    image: '/assets/tortas/infantil-arcoiris.webp',
    flavors: ['Vainilla Chispas', 'Chocolate Suave', 'Marmoleado'],
    fillings: ['Fudge casero', 'Manjar blanco cajamarquino'],
  },
  {
    id: 'torta-rosas-ensueno',
    name: 'Torta Rosas de Ensueño',
    category: 'cumpleanos',
    description: 'Rosetones de crema en degradé rosa, nuestra torta más pedida para cumpleaños.',
    portions: '25-30 porciones',
    basePrice: 110,
    image: '/assets/tortas/rosas-ensueno.webp',
    badge: 'La Más Pedida',
    isPopular: true,
    isCustomizable: true,
    flavors: ['Red Velvet', 'Vainilla Francesa', 'Chocolate'],
    fillings: ['Frutos rojos', 'Crema pastelera con canela', 'Manjar blanco'],
  },
  {
    id: 'torta-choco-drip',
    name: 'Torta de Chocolate Drip',
    category: 'cumpleanos',
    description: 'Crema de vainilla con goteo de chocolate y fresas frescas.',
    portions: '20-25 porciones',
    basePrice: 95,
    image: '/assets/tortas/chocolate-drip.webp',
    flavors: ['Triple Chocolate', 'Moka', 'Vainilla'],
    fillings: ['Fudge artesanal', 'Chantilly con duraznos'],
  },
];

export const GALLERY_CAKES: CakeItem[] = [
  {
    id: 'gal-1',
    name: 'Torta Rosa Roja en Crema',
    category: 'cumpleanos',
    description: 'Una gran rosa de crema roja sobre bizcocho de vainilla.',
    portions: '20-24 porciones',
    basePrice: 80,
    image: '/assets/tortas/rosa-roja.webp',
  },
  {
    id: 'gal-2',
    name: 'Torta Infantil de Chocolate y Dulces',
    category: 'infantiles',
    description: 'Chocolate, grageas de colores y velitas para la fiesta.',
    portions: '25 porciones',
    basePrice: 90,
    image: '/assets/tortas/infantil-dulces.webp',
  },
  {
    id: 'gal-3',
    name: 'Torta de Boda con Flores',
    category: 'bodas',
    description: 'Pisos de crema blanca decorados con flores, para el día más importante.',
    portions: '50-60 porciones',
    basePrice: 220,
    image: '/assets/tortas/boda-flores.webp',
  },
  {
    id: 'gal-4',
    name: 'Torta Chocolatísima con Frutos Rojos',
    category: 'cumpleanos',
    description: 'Capas de chocolate con ganache y frutos rojos encima.',
    portions: '20-25 porciones',
    basePrice: 95,
    image: '/assets/tortas/chocolatisima.webp',
  },
  {
    id: 'gal-5',
    name: 'Torta Selva Negra',
    category: 'cumpleanos',
    description: 'Bizcocho de chocolate, chantilly, cerezas y virutas de chocolate.',
    portions: '20-24 porciones',
    basePrice: 75,
    image: '/assets/tortas/selva-negra.webp',
  },
  {
    id: 'gal-6',
    name: 'Torta Blanca con Drip de Chocolate',
    category: 'bodas',
    description: 'Crema blanca lisa con goteo de chocolate, elegante y sencilla.',
    portions: '20-25 porciones',
    basePrice: 85,
    image: '/assets/tortas/drip-chocolate-blanco.webp',
  },
  {
    id: 'gal-7',
    name: 'Milhojas Crocante con Manjar Blanco',
    category: 'panaderia',
    description: 'Capas finas de hojaldre crujiente rellenas del tradicional manjar cajamarquino.',
    portions: '15-18 porciones',
    basePrice: 55,
    image: '/assets/tortas/milhojas.webp',
  },
  {
    id: 'gal-8',
    name: 'Torta de Dos Pisos con Flores',
    category: 'tematicas',
    description: 'Dos pisos de crema con flores para celebraciones especiales.',
    portions: '25-30 porciones',
    basePrice: 110,
    image: '/assets/tortas/dos-pisos-flores.webp',
  },
];

export const GOOGLE_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Carmen Rosas',
    rating: 5,
    date: 'Hace 3 semanas',
    comment: '¡Las mejores tortas de Cajamarca! La de chocolate y la Selva Negra son espectaculares, súper frescas y con el dulce justo. El servicio por WhatsApp fue rápido y amable.',
    verified: true,
  },
  {
    id: 'rev-2',
    author: 'Diego M.',
    rating: 5,
    date: 'Hace 1 mes',
    comment: 'Comprometidos con la calidad. Las tortas personalizadas para mis hijos quedaron idénticas a lo que pedí y riquísimas. 100% recomendados.',
    verified: true,
  },
  {
    id: 'rev-3',
    author: 'Lucía Paredes S.',
    rating: 5,
    date: 'Hace 2 meses',
    comment: 'Pedí una torta de 3 pisos para las bodas de plata de mis padres. Llegó puntualísima a Baños del Inca y el manjar blanco cajamarquino fue el elogio de todos los invitados.',
    verified: true,
  }
];

export const FAQS = [
  {
    q: '¿Con cuánto tiempo de anticipación debo hacer mi pedido?',
    a: 'Para tortas de catálogo habitual recomendamos 24 horas de anticipación. Para tortas personalizadas temáticas o de eventos como bodas y quinceaños, sugerimos entre 2 a 4 días para asegurar cada detalle del diseño.'
  },
  {
    q: '¿Realizan delivery en Cajamarca?',
    a: 'Sí. Llevamos tu torta a Cajamarca ciudad (Cercado, Santa Elena, San Sebastián, Chontapaccha) y a Baños del Inca, y coordinamos contigo la hora exacta.'
  },
  {
    q: '¿Qué medios de pago aceptan?',
    a: 'Aceptamos transferencias y billeteras digitales como Yape y Plin, tarjetas Visa y Mastercard en tienda o link de pago, y efectivo contraentrega o en nuestro local.'
  },
  {
    q: '¿Puedo enviar mi propio diseño de referencia de internet?',
    a: 'Claro. En Arma tu torta eliges las capas y escribes la temática; la foto de referencia nos la mandas por WhatsApp y la reproducimos cuidando el sabor.'
  }
];
