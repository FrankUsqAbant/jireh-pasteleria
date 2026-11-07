import React from 'react';
import { STORE_WHATSAPP_URL } from '../utils/orderCalculator';
import { goTo } from '../lib/motion';

/**
 * Portada: una foto real de una torta, partida en sus capas. Al cargar, la base aparece y cada capa
 * cae desde arriba y se asienta sobre la anterior hasta formar la torta completa.
 *
 * La caída es CSS puro (styles/hero-capas.css): empieza apenas se pinta el HTML pre-renderizado, sin
 * esperar al JavaScript. Al terminar se muestra la foto entera (sin uniones). Con movimiento reducido se
 * ve la foto entera desde el principio.
 *
 * La foto (fondo recortado) se divide con clipPath siguiendo las curvas de la torta: base dorada, tres
 * capas de bizcocho y crema, y la tapa con las fresas. Las piezas se tocan exactamente.
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
const BOTTOM = 775; // base del bizcocho
const BOARD_TOP = 540; // dónde empieza la base dorada a los costados

/** Banda del cuerpo de la torta entre dos curvas. */
const band = (upper: number, lower: number) => `M${front(upper, 'ltr')} L${front(lower, 'rtl')} Z`;

/**
 * Piezas en el orden en que llegan.
 * - `apoyo`: el punto más bajo de su borde, donde se aplasta al caer.
 * - `tapa`: centro (cy) de la elipse de crema que cierra la capa por arriba mientras está sola, para que
 *   se vea como un disco sólido y no como un anillo hueco. La capa siguiente la cubre al apoyarse.
 * La base dorada llega junto con la primera capa: así nunca se ve el hueco que la torta tapa en la foto.
 */
const PIECES: { id: string; apoyo: number; tapa?: number; d: string }[] = [
  {
    id: 'base',
    apoyo: H,
    tapa: L2,
    // A los costados de la torta, entre la base y la segunda capa, la foto tiene restos del fondo:
    // esa franja queda fuera durante la caída (al final se ve la foto entera).
    d: `M0,${BOARD_TOP} L${LEFT - 45},${BOARD_TOP} L${LEFT - 45},${L2} L${front(L2, 'ltr')} L${RIGHT + 65},${L2} L${RIGHT + 65},${BOARD_TOP} L${W},${BOARD_TOP} L${W},${H} L0,${H} Z`,
  },
  { id: 'capa2', apoyo: L2 + RY, tapa: L3, d: band(L3, L2) },
  { id: 'capa3', apoyo: L3 + RY, tapa: TOP, d: band(TOP, L3) },
  {
    id: 'tapa',
    apoyo: TOP + RY,
    d: `M0,0 L${W},0 L${W},${BOARD_TOP} L${RIGHT},${BOARD_TOP} L${front(TOP, 'rtl')} L${LEFT},${BOARD_TOP} L0,${BOARD_TOP} Z`,
  },
];

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
            {PIECES.map((p) => (
              <clipPath key={p.id} id={`recorte-${p.id}`}>
                <path d={p.d} />
              </clipPath>
            ))}
            {/* Crema de la superficie de cada capa (colores tomados de la foto) */}
            <radialGradient id="crema" cx="0.45" cy="0.4" r="0.7">
              <stop offset="0" stopColor="#ecebe6" />
              <stop offset="0.65" stopColor="#e2ddd2" />
              <stop offset="1" stopColor="#cdc2b0" />
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
          </defs>

          <ellipse className="torta-sombra" cx={CX} cy={1010} rx={470} ry={55} fill="url(#sombra-torta)" />
          <image className="torta-entera" href={IMG} width={W} height={H} />

          <g className="piezas" aria-hidden="true">
            {PIECES.map((p, i) => (
              <g
                key={p.id}
                className={`pieza pieza--${p.id}`}
                style={{ '--i': i, '--apoyo': `${CX}px ${p.apoyo}px` } as React.CSSProperties}
              >
                <g className="pieza__aplasta">
                  {p.tapa !== undefined && (
                    <ellipse cx={CX} cy={p.tapa} rx={RX - 4} ry={RY - 2} fill="url(#crema)" filter="url(#crema-textura)" stroke="#c99a62" strokeOpacity={0.5} strokeWidth={6} />
                  )}
                  <image href={IMG} width={W} height={H} clipPath={`url(#recorte-${p.id})`} />
                </g>
              </g>
            ))}
          </g>
        </svg>
      </div>
    </div>
  </section>
);
