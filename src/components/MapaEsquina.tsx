import React from 'react';

/**
 * Mapa esquemático de la esquina de la tienda: Av. San Martín de Porres con Jr. Los Andes.
 * Es una ilustración (no a escala): solo muestra las dos calles reales y dónde está JIRÉH.
 */
export const MapaEsquina: React.FC<{ href: string }> = ({ href }) => (
  <a className="mapa" href={href} target="_blank" rel="noopener" aria-label="Abrir en Google Maps la ubicación de JIRÉH">
    <svg viewBox="0 0 560 420" role="img" aria-hidden="true">
      <defs>
        <pattern id="manzanas" width="70" height="70" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)">
          <rect x="6" y="6" width="58" height="58" rx="6" className="mapa__manzana" />
        </pattern>
        <radialGradient id="pin-halo">
          <stop offset="0" stopColor="#b3202e" stopOpacity="0.35" />
          <stop offset="1" stopColor="#b3202e" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="560" height="420" className="mapa__fondo" />
      <rect width="560" height="420" fill="url(#manzanas)" />

      {/* Av. San Martín de Porres (la avenida) y Jr. Los Andes (el cruce) */}
      <path d="M-20,260 L580,176" className="mapa__avenida" />
      <path d="M318,-20 L352,440" className="mapa__jiron" />
      <path d="M-20,260 L580,176" className="mapa__eje" />

      <text className="mapa__calle" transform="translate(34 236) rotate(-8)">Av. San Martín de Porres</text>
      <text className="mapa__calle mapa__calle--chica" transform="translate(347 30) rotate(86)">Jr. Los Andes</text>

      {/* La tienda, en la esquina */}
      <g className="mapa__pin" transform="translate(300 196)">
        <circle r="46" fill="url(#pin-halo)" className="mapa__halo" />
        <path d="M0,0 C-16,-22 -22,-34 -22,-44 a22,22 0 1,1 44,0 c0,10 -6,22 -22,44 Z" className="mapa__gota" />
        <circle cy="-44" r="8" className="mapa__punto" />
      </g>
      <g transform="translate(190 112)">
        <rect x="-4" y="-26" width="104" height="38" rx="19" className="mapa__etiqueta" />
        <text x="48" y="-1" textAnchor="middle" className="mapa__nombre">JIRÉH 787</text>
      </g>
    </svg>
    <span className="mapa__abrir">
      Abrir en Google Maps <span aria-hidden="true">↗</span>
    </span>
  </a>
);
