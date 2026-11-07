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

/** Piezas en el orden en que llegan. `apoyo`: el punto más bajo de su borde, donde se aplasta al caer. */
const PIECES = [
  {
    id: 'base',
    apoyo: H,
    d: `M0,${BOARD_TOP} L${LEFT},${BOARD_TOP} L${front(BOTTOM, 'ltr')} L${RIGHT},${BOARD_TOP} L${W},${BOARD_TOP} L${W},${H} L0,${H} Z`,
  },
  { id: 'capa1', apoyo: BOTTOM + RY, d: band(L2, BOTTOM) },
  { id: 'capa2', apoyo: L2 + RY, d: band(L3, L2) },
  { id: 'capa3', apoyo: L3 + RY, d: band(TOP, L3) },
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
