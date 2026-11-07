import React from 'react';
import { STORE_WHATSAPP_URL } from '../utils/orderCalculator';
import { goTo } from '../lib/motion';

/**
 * Portada: una foto real de una torta que se arma sola. La base con la primera capa aparece, las capas
 * caen y se asientan (cada una proyecta su sombra sobre la de abajo antes de apoyarse), la tapa llega con
 * su crema y sus flores, y al final caen las fresas una por una. Termina en la foto entera.
 *
 * Todo el movimiento es CSS (styles/hero-capas.css): empieza apenas se pinta el HTML pre-renderizado.
 * Con movimiento reducido se ve la foto entera desde el principio.
 *
 * Las piezas salen de la misma foto con clipPath y mask, siguiendo las curvas de la torta. Las fresas
 * están delineadas a mano sobre la foto (coordenadas de una vista ampliada al doble, ver `fresa()`).
 */

const IMG = '/assets/portada/torta-capas.webp';
// Coordenadas en las que se midió la foto (el archivo puede tener otra resolución)
const W = 1600;
const H = 1067;

// Cilindro de la torta en la foto: centro, radio horizontal y alto de la elipse
const CX = 797;
const RX = 357;
const RY = 150;
const LEFT = CX - RX;
const RIGHT = CX + RX;

/** Borde frontal de una capa: la mitad de abajo de una elipse con centro en (CX, cy). */
function front(cy: number, dir: 'ltr' | 'rtl') {
  const pts: string[] = [];
  const steps = 28;
  for (let i = 0; i <= steps; i++) {
    const t = dir === 'ltr' ? i / steps : 1 - i / steps;
    const x = LEFT + t * (RIGHT - LEFT);
    const u = (x - CX) / RX;
    const y = cy + RY * Math.sqrt(Math.max(0, 1 - u * u));
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join(' L');
}

// Centros (cy) de las curvas que separan las capas, de arriba hacia abajo
const TOP = 420; // borde de la tapa
const L3 = 550;
const L2 = 680;
const BOARD_TOP = 540; // dónde empieza la base dorada a los costados

/** Banda del cuerpo de la torta entre dos curvas. */
const band = (upper: number, lower: number) => `M${front(upper, 'ltr')} L${front(lower, 'rtl')} Z`;

/**
 * Capas en el orden en que llegan.
 * - `apoyo`: el punto más bajo de su borde, donde se aplasta al caer.
 * - `tapa`: centro (cy) de la elipse de crema que la cierra por arriba mientras está sola, para que se vea
 *   como un disco sólido y no como un anillo hueco. La capa siguiente la cubre al apoyarse.
 * - `sombra`: dónde proyecta su sombra antes de apoyarse (la superficie de la capa de abajo).
 * La base dorada llega junto con la primera capa: así nunca se ve el hueco que la torta tapa en la foto.
 */
const CAPAS: { id: string; apoyo: number; tapa: number; sombra?: number; d: string; mask?: string }[] = [
  {
    id: 'base',
    apoyo: H,
    tapa: L2,
    // A los costados, entre la base y la segunda capa, la foto tiene restos del fondo: quedan fuera
    d: `M0,${BOARD_TOP} L${LEFT - 45},${BOARD_TOP} L${LEFT - 45},${L2} L${front(L2, 'ltr')} L${RIGHT + 65},${L2} L${RIGHT + 65},${BOARD_TOP} L${W},${BOARD_TOP} L${W},${H} L0,${H} Z`,
  },
  { id: 'capa2', apoyo: L2 + RY, tapa: L3, sombra: L2, d: band(L3, L2) },
  { id: 'capa3', apoyo: L3 + RY, tapa: TOP, sombra: L3, d: band(TOP, L3) },
  {
    id: 'tapa',
    apoyo: TOP + RY,
    tapa: TOP,
    sombra: TOP,
    d: `M0,0 L${W},0 L${W},${BOARD_TOP} L${RIGHT},${BOARD_TOP} L${front(TOP, 'rtl')} L${LEFT},${BOARD_TOP} L0,${BOARD_TOP} Z`,
    mask: 'sin-fresas', // la tapa cae sin las fresas: llegan después
  },
];

/**
 * Contorno delineado en la vista ampliada (origen x 540, y 80, escala 2), en coordenadas de la foto.
 * `centro`: el punto sobre el que gira al caer.
 */
const fresa = (pts: [number, number][]) => {
  const foto = pts.map(([x, y]) => [540 + x / 2, 80 + y / 2] as const);
  const cx = foto.reduce((s, p) => s + p[0], 0) / foto.length;
  const cy = foto.reduce((s, p) => s + p[1], 0) / foto.length;
  return { d: `M${foto.map(([x, y]) => `${x},${y}`).join(' L')} Z`, centro: `${cx.toFixed(0)}px ${cy.toFixed(0)}px` };
};

/** Fresas (con sus hojas), de atrás hacia adelante: es el orden en que se apoyan. `giro`: inclinación al caer. */
const FRESAS = [
  { id: 'derecha', giro: 9, ...fresa([[650, 150], [700, 110], [780, 95], [790, 40], [850, 25], [900, 60], [930, 110], [965, 170], [990, 250], [960, 330], [880, 345], [800, 320], [720, 290], [660, 240]]) },
  { id: 'mitad', giro: -7, ...fresa([[380, 190], [395, 125], [450, 95], [530, 95], [580, 130], [600, 200], [580, 290], [540, 350], [480, 390], [445, 330], [430, 260]]) },
  { id: 'izquierda', giro: -10, ...fresa([[0, 230], [30, 190], [110, 150], [170, 60], [190, 30], [260, 35], [320, 110], [390, 175], [430, 260], [445, 345], [430, 420], [360, 445], [260, 445], [160, 425], [85, 385], [65, 320], [20, 290]]) },
  { id: 'centro', giro: 6, ...fresa([[450, 430], [480, 340], [540, 280], [600, 215], [660, 200], [720, 250], [760, 330], [820, 300], [900, 300], [960, 340], [1010, 400], [1040, 470], [990, 520], [900, 560], [860, 600], [840, 680], [760, 700], [690, 690], [640, 670], [580, 660], [520, 620], [480, 540]]) },
  { id: 'abajo', giro: -8, ...fresa([[50, 470], [90, 450], [170, 455], [230, 470], [300, 490], [325, 560], [300, 620], [230, 640], [150, 630], [110, 600], [80, 540]]) },
  { id: 'cortada', giro: 5, ...fresa([[262, 700], [268, 630], [300, 575], [360, 548], [440, 543], [500, 560], [540, 615], [548, 720], [522, 800], [470, 842], [400, 858], [330, 833], [285, 775]]) },
];

const Crema: React.FC<{ cy: number }> = ({ cy }) => (
  <ellipse cx={CX} cy={cy} rx={RX - 4} ry={RY - 2} fill="url(#crema)" filter="url(#crema-textura)" stroke="#c99a62" strokeOpacity={0.5} strokeWidth={6} />
);

export const HeroCapas: React.FC = () => (
  <section id="inicio" className="hero-capas" aria-labelledby="hero-title">
    <div className="wrap hero-capas__grid">
      <div className="hero-capas__copy">
        <h1 id="hero-title" className="display hero-capas__title">
          Tortas que se&nbsp;vuelven recuerdo
        </h1>
        <p className="hero-capas__lede">Hechas a mano en Cajamarca, capa por capa.</p>
        <div className="hero-capas__actions">
          <a className="btn btn--solid-light" href={STORE_WHATSAPP_URL} target="_blank" rel="noopener">
            Pedir por WhatsApp <span className="btn__arrow" aria-hidden="true">→</span>
          </a>
          <a
            className="btn btn--ghost-light"
            href="#vitrina"
            onClick={(e) => {
              e.preventDefault();
              goTo('vitrina');
            }}
          >
            Ver tortas
          </a>
        </div>
      </div>

      <div className="hero-capas__stage">
        <svg
          viewBox="300 20 1000 1047"
          className="hero-capas__svg"
          role="img"
          aria-label="Torta de vainilla con capas de crema, fresas y flores de manzanilla sobre una base dorada"
        >
          <defs>
            {CAPAS.map((p) => (
              <clipPath key={p.id} id={`recorte-${p.id}`}>
                <path d={p.d} />
              </clipPath>
            ))}
            {/* Bordes suaves para las fresas y para el hueco que dejan en la tapa */}
            <filter id="borde-suave" x="-5%" y="-5%" width="110%" height="110%">
              <feGaussianBlur stdDeviation="2.2" />
            </filter>
            {FRESAS.map((f) => (
              <mask key={f.id} id={`fresa-${f.id}`} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
                <path d={f.d} fill="#fff" filter="url(#borde-suave)" />
              </mask>
            ))}
            {/* El hueco que dejan las fresas en la tapa se difumina más, para fundirse con la crema */}
            <filter id="borde-hueco" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="10" />
            </filter>
            <mask id="sin-fresas" maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
              <rect width={W} height={H} fill="#fff" />
              {FRESAS.map((f) => (
                <path key={f.id} d={f.d} fill="#000" stroke="#000" strokeWidth={22} strokeLinejoin="round" filter="url(#borde-hueco)" />
              ))}
            </mask>
            {/* Crema de la superficie de cada capa (colores tomados de la foto) */}
            <radialGradient id="crema" cx="0.45" cy="0.4" r="0.7">
              <stop offset="0" stopColor="#eef0ef" />
              <stop offset="0.65" stopColor="#e6e7e3" />
              <stop offset="1" stopColor="#d3d0c7" />
            </radialGradient>
            {/* Textura muy leve para que la crema no se vea plana */}
            <filter id="crema-textura" x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={4} result="ruido" />
              <feColorMatrix in="ruido" type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.3  0 0 0 0.18 0" result="grano" />
              <feComposite in="grano" in2="SourceGraphic" operator="in" result="granoRecortado" />
              <feMerge>
                <feMergeNode in="SourceGraphic" />
                <feMergeNode in="granoRecortado" />
              </feMerge>
            </filter>
            <radialGradient id="sombra-torta">
              <stop offset="0" stopColor="#000" stopOpacity="0.7" />
              <stop offset="1" stopColor="#000" stopOpacity="0" />
            </radialGradient>
            {/* Sombra de contacto: la capa que baja oscurece la de abajo */}
            <radialGradient id="sombra-contacto" cx="0.5" cy="0.45" r="0.55">
              <stop offset="0" stopColor="#3a2414" stopOpacity="0.55" />
              <stop offset="0.7" stopColor="#3a2414" stopOpacity="0.25" />
              <stop offset="1" stopColor="#3a2414" stopOpacity="0" />
            </radialGradient>
          </defs>

          <ellipse className="torta-sombra" cx={CX} cy={1010} rx={470} ry={55} fill="url(#sombra-torta)" />
          <image className="torta-entera" href={IMG} width={W} height={H} />

          <g className="piezas" aria-hidden="true">
            {CAPAS.map((p, i) => (
              <React.Fragment key={p.id}>
                {p.sombra !== undefined && (
                  <ellipse
                    className="contacto"
                    style={{ '--i': i } as React.CSSProperties}
                    cx={CX}
                    cy={p.sombra}
                    rx={RX}
                    ry={RY}
                    fill="url(#sombra-contacto)"
                  />
                )}
                <g className={`pieza pieza--${p.id}`} style={{ '--i': i, '--apoyo': `${CX}px ${p.apoyo}px` } as React.CSSProperties}>
                  <g className="pieza__aplasta">
                    <Crema cy={p.tapa} />
                    <g mask={p.mask ? `url(#${p.mask})` : undefined}>
                      <image href={IMG} width={W} height={H} clipPath={`url(#recorte-${p.id})`} />
                    </g>
                  </g>
                </g>
              </React.Fragment>
            ))}

            {FRESAS.map((f, j) => (
              <g key={f.id} className="fresa" style={{ '--j': j, '--giro': `${f.giro}deg`, '--centro': f.centro } as React.CSSProperties}>
                <image href={IMG} width={W} height={H} mask={`url(#fresa-${f.id})`} />
              </g>
            ))}
          </g>
        </svg>
      </div>
    </div>
  </section>
);
