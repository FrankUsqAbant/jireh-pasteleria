import { CakeItem, ReviewItem } from '../types/bakery';

export const LOGO_URL = '/assets/logo-jireh.webp';
export const STOREFRONT_URL = '/assets/local-jireh.webp';
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
    name: 'Torta Temática Infantil',
    category: 'infantiles',
    description: 'Divertida torta con motivos animados, decorada artesanalmente con cobertura cremosa y detalles en fondant.',
    portions: '20-25 porciones',
    basePrice: 85,
    image: '/assets/cropped/torta_infantil.webp',
    flavors: ['Vainilla Chispas', 'Chocolate Suave', 'Marmoleado'],
    fillings: ['Fudge casero', 'Manjar blanco cajamarquino'],
  },
  {
    id: 'torta-rosas-ensueno',
    name: 'Torta Rosas de Ensueño',
    category: 'cumpleanos',
    description: 'Nuestra creación más aclamada en Cajamarca: dos niveles de rosetones en degradé rosa y marfil con topper dorado.',
    portions: '25-30 porciones',
    basePrice: 110,
    image: '/assets/cropped/torta_rosas.webp',
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
    description: 'Exquisito goteo de chocolate belga, coronado con fresas seleccionadas, trufas y bombones.',
    portions: '20-25 porciones',
    basePrice: 95,
    image: '/assets/cropped/torta_chocodrip.webp',
    flavors: ['Triple Chocolate', 'Moka', 'Vainilla'],
    fillings: ['Fudge artesanal', 'Chantilly con duraznos'],
  },
];

export const GALLERY_CAKES: CakeItem[] = [
  {
    id: 'gal-1',
    name: 'Torta Rosas Románticas en Crema',
    category: 'cumpleanos',
    description: 'Elegante acabado en merengue italiano con rosas naturales y follaje fino.',
    portions: '20-24 porciones',
    basePrice: 80,
    image: '/assets/reales/rosas-crema.jpg',
  },
  {
    id: 'gal-2',
    name: 'Torta Temática Infantil en Azúcar',
    category: 'infantiles',
    description: 'Diseño creativo con modelado artístico en glasé real y texturas temáticas.',
    portions: '25 porciones',
    basePrice: 90,
    image: '/assets/reales/infantil-paw.jpg',
  },
  {
    id: 'gal-3',
    name: 'Torta Tres Pisos de Boda Clásica',
    category: 'bodas',
    description: 'Estructura nupcial con cintas doradas, rosas salmón y relleno gourmet.',
    portions: '50-60 porciones',
    basePrice: 220,
    image: '/assets/reales/boda-tres-pisos.jpg',
  },
  {
    id: 'gal-4',
    name: 'Torta Chocolatísima Drip Frutos Rojos',
    category: 'cumpleanos',
    description: 'Baño de ganache belga espeso, fresas frescas y macarons artesanales.',
    portions: '20-25 porciones',
    basePrice: 95,
    image: '/assets/seamless/torta_chocolatisima.webp',
  },
  {
    id: 'gal-5',
    name: 'Torta Selva Negra con Frutas de Estación',
    category: 'cumpleanos',
    description: 'Bizcochuelo embebido en almíbar, chantilly fresco, duraznos y cerezas.',
    portions: '20-24 porciones',
    basePrice: 75,
    image: '/assets/seamless/torta_selva_negra.webp',
  },
  {
    id: 'gal-6',
    name: 'Torta Drip Celeste Celebración',
    category: 'bodas',
    description: 'Bañada en crema suave con detalles perlados comestibles y acabado satinado.',
    portions: '20-25 porciones',
    basePrice: 85,
    image: '/assets/reales/drip-celeste.jpg',
  },
  {
    id: 'gal-7',
    name: 'Milhojas Crocante con Manjar Blanco',
    category: 'panaderia',
    description: 'Capas finas de hojaldre crujiente rellenas del tradicional manjar cajamarquino.',
    portions: '15-18 porciones',
    basePrice: 55,
    image: '/assets/reales/milhojas.jpg',
  },
  {
    id: 'gal-8',
    name: 'Torta Rosas Ensueño Doble Altura',
    category: 'tematicas',
    description: 'Doble altura decorada con rosetones artesanales y topper conmemorativo.',
    portions: '25-30 porciones',
    basePrice: 110,
    image: '/assets/seamless/torta_rosas.webp',
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
