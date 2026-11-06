import { CakeItem, ReviewItem } from '../types/bakery';

export const LOGO_URL = '/assets/aistudio/Captura_de_pantalla_2026-10-31_005917_4d19c4d4.jpg';
export const STOREFRONT_URL = '/assets/aistudio/Captura_de_pantalla_2026-10-31_005951_86005b29.jpg';
export const STORY_IMAGE_URL = '/assets/cropped/story_composition.jpg';
export const HERO_IMAGE_URL = '/assets/cropped/hero_cake_pedestal.jpg';

export const HERO_FEATURED_CAKES = [
  {
    id: 'hero-1',
    number: '01',
    name: 'Torta Chocolatísima Drip 🍓',
    tagline: 'Delicioso bizcocho húmedo de cacao con ganache oscuro y fresas frescas de temporada.',
    portions: '20-25 porciones',
    image: '/assets/seamless/torta_chocolatisima.png',
  },
  {
    id: 'hero-2',
    number: '02',
    name: 'Torta Rosas de Ensueño 🌸',
    tagline: 'Nuestra creación insigne con rosetones de crema suiza y topper dorado.',
    portions: '25-30 porciones',
    image: '/assets/seamless/torta_rosas.png',
  },
  {
    id: 'hero-3',
    number: '03',
    name: 'Torta Selva Negra Tradicional 🍒',
    tagline: 'Cerezas maceradas, abundante virutas de chocolate cajamarquino y chantilly artesanal.',
    portions: '20-24 porciones',
    image: '/assets/seamless/torta_selva_negra.png',
  },
  {
    id: 'hero-4',
    number: '04',
    name: 'Torta Temática Infantil 🎈',
    tagline: 'Modelados en azúcar, colores vibrantes y sabores suaves que encantan a los más pequeños.',
    portions: '30-35 porciones',
    image: '/assets/seamless/torta_infantil.png',
  }
];

export const CAKE_CATEGORIES = [
  { id: 'cumpleanos', label: 'Tortas de Cumpleaños', icon: '🎂' },
  { id: 'infantiles', label: 'Tortas Infantiles', icon: '🎈' },
  { id: 'bodas', label: 'Bodas & Eventos', icon: '💍' },
  { id: 'tematicas', label: 'Temáticas & Especiales', icon: '🎨' },
  { id: 'panaderia', label: 'Panadería & Dulces', icon: '🥐' },
] as const;

export const FEATURED_SPECIALTIES: CakeItem[] = [
  {
    id: 'torta-infantil-paw',
    name: 'Torta Temática Infantil',
    category: 'infantiles',
    description: 'Divertida torta con motivos animados, decorada artesanalmente con cobertura cremosa y detalles en fondant.',
    portions: '20-25 porciones',
    basePrice: 85,
    image: '/assets/cropped/torta_infantil.jpg',
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
    image: '/assets/cropped/torta_rosas.jpg',
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
    image: '/assets/cropped/torta_chocodrip.jpg',
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
    image: '/assets/cropped/torta_rosas.jpg',
  },
  {
    id: 'gal-2',
    name: 'Torta Temática Infantil en Azúcar',
    category: 'infantiles',
    description: 'Diseño creativo con modelado artístico en glasé real y texturas temáticas.',
    portions: '25 porciones',
    basePrice: 90,
    image: '/assets/cropped/torta_infantil.jpg',
  },
  {
    id: 'gal-3',
    name: 'Torta Tres Pisos de Boda Clásica',
    category: 'bodas',
    description: 'Estructura nupcial con cintas doradas, rosas salmón y relleno gourmet.',
    portions: '50-60 porciones',
    basePrice: 220,
    image: '/assets/aistudio/Captura_de_pantalla_2026-10-31_005810_e5bf024c.jpg',
  },
  {
    id: 'gal-4',
    name: 'Torta Chocolatísima Drip Frutos Rojos',
    category: 'cumpleanos',
    description: 'Baño de ganache belga espeso, fresas frescas y macarons artesanales.',
    portions: '20-25 porciones',
    basePrice: 95,
    image: '/assets/cropped/torta_chocodrip.jpg',
  },
  {
    id: 'gal-5',
    name: 'Torta Selva Negra con Frutas de Estación',
    category: 'cumpleanos',
    description: 'Bizcochuelo embebido en almíbar, chantilly fresco, duraznos y cerezas.',
    portions: '20-24 porciones',
    basePrice: 75,
    image: '/assets/seamless/torta_selva_negra.png',
  },
  {
    id: 'gal-6',
    name: 'Torta Drip Celeste Celebración',
    category: 'bodas',
    description: 'Bañada en crema suave con detalles perlados comestibles y acabado satinado.',
    portions: '20-25 porciones',
    basePrice: 85,
    image: '/assets/aistudio/Captura_de_pantalla_2026-10-31_005840_3d36985c.jpg',
  },
  {
    id: 'gal-7',
    name: 'Milhojas Crocante con Manjar Blanco',
    category: 'panaderia',
    description: 'Capas finas de hojaldre crujiente rellenas del tradicional manjar cajamarquino.',
    portions: '15-18 porciones',
    basePrice: 55,
    image: '/assets/aistudio/Captura_de_pantalla_2026-10-31_005756_448f9d70.jpg',
  },
  {
    id: 'gal-8',
    name: 'Torta Rosas Ensueño Doble Altura',
    category: 'tematicas',
    description: 'Doble altura decorada con rosetones artesanales y topper conmemorativo.',
    portions: '25-30 porciones',
    basePrice: 110,
    image: '/assets/seamless/torta_rosas.png',
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
    a: 'Sí, realizamos envíos a todo Cajamarca ciudad (cercado, Santa Elena, San Sebastián, Chontapaccha) y zonas aledañas como Baños del Inca, coordinando la hora exacta para que llegue perfecta.'
  },
  {
    q: '¿Qué medios de pago aceptan?',
    a: 'Aceptamos transferencias y billeteras digitales como Yape y Plin, tarjetas Visa y Mastercard en tienda o link de pago, y efectivo contraentrega o en nuestro local.'
  },
  {
    q: '¿Puedo enviar mi propio diseño de referencia de internet?',
    a: '¡Por supuesto! En la sección "Pedir a medida" puedes indicarnos los detalles y enviarnos la foto por WhatsApp. Nuestros maestros pasteleros reproducirán el diseño cuidando el sabor tradicional.'
  }
];
