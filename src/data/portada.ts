/**
 * Datos de la foto de portada (fotos-fuente/portada-torta-recorte.png, 1600 x 1067).
 * Los usan la portada (components/HeroCapas.tsx) y el script que prepara la tapa sin fresas
 * (scripts/preparar-portada.ts), así ambos recortan exactamente lo mismo.
 */

export const FOTO_W = 1600;
export const FOTO_H = 1067;

/** Zona de la foto que ocupa la tapa (con flores y lo que sobresale): la imagen de la tapa solo guarda esto. */
export const RECORTE_TAPA = { x: 380, y: 0, w: 880, h: 600 };

/** Superficie de arriba de la torta, medida sobre la foto. */
export const SUPERFICIE = { cx: 797, cy: 345, rx: 352, ry: 192 };

export interface FresaPortada {
  id: string;
  /** Inclinación con la que cae (grados). */
  giro: number;
  /** Contorno en coordenadas de la foto. */
  puntos: [number, number][];
}

/** Contorno delineado sobre una vista ampliada al doble con origen en (540, 80). */
const ampliada = (pts: [number, number][]): [number, number][] => pts.map(([x, y]) => [540 + x / 2, 80 + y / 2]);

/** Fresas con sus hojas, de atrás hacia adelante (el orden en que se apoyan). */
export const FRESAS_PORTADA: FresaPortada[] = [
  { id: 'derecha', giro: 9, puntos: ampliada([[650, 150], [700, 110], [780, 95], [790, 40], [850, 25], [900, 60], [930, 110], [965, 170], [990, 250], [960, 330], [880, 345], [800, 320], [720, 290], [660, 240]]) },
  { id: 'mitad', giro: -7, puntos: ampliada([[380, 190], [395, 125], [450, 95], [530, 95], [580, 130], [600, 200], [580, 290], [540, 350], [480, 390], [445, 330], [430, 260]]) },
  { id: 'izquierda', giro: -10, puntos: ampliada([[0, 230], [30, 190], [110, 150], [170, 60], [190, 30], [260, 35], [320, 110], [390, 175], [430, 260], [445, 345], [430, 420], [360, 445], [260, 445], [160, 425], [85, 385], [65, 320], [20, 290]]) },
  { id: 'centro', giro: 6, puntos: ampliada([[450, 430], [480, 340], [540, 280], [600, 215], [660, 200], [720, 250], [760, 330], [820, 300], [900, 300], [960, 340], [1010, 400], [1040, 470], [990, 520], [900, 560], [860, 600], [840, 680], [760, 700], [690, 690], [640, 670], [580, 660], [520, 620], [480, 540]]) },
  { id: 'abajo', giro: -8, puntos: ampliada([[50, 470], [90, 450], [170, 455], [230, 470], [300, 490], [325, 560], [300, 620], [230, 640], [150, 630], [110, 600], [80, 540]]) },
  { id: 'cortada', giro: 5, puntos: ampliada([[262, 700], [268, 630], [300, 575], [360, 548], [440, 543], [500, 560], [540, 615], [548, 720], [522, 800], [470, 842], [400, 858], [330, 833], [285, 775]]) },
];

/** Margen (px de la foto) que se agrega alrededor de cada contorno para no dejar filos de fresa. */
export const MARGEN_FRESA = 7;
