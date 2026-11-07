import React from 'react';

/** Fotos reales de tortas de JIRÉH (recortadas de su Facebook, fotos-fuente/). */
const FOTOS = ['01', '02', '03', '04', '05', '06', '07', '08', '10', '11', '12', '13', '14', '15', '16'].map(
  (n) => `/assets/hechas/torta-${n}.webp`,
);

/**
 * "Hechas en JIRÉH": una tira de fotos reales que se desliza muy lento. Es lo único del sitio que se
 * mueve solo; se pausa al pasar el mouse o al enfocarla. Con movimiento reducido queda quieta y se
 * recorre de lado.
 */
export const HechasEnJireh: React.FC = () => (
  <section className="hechas" aria-labelledby="hechas-title">
    <div className="wrap hechas__head">
      <h2 id="hechas-title" className="display hechas__title">Hechas en JIRÉH</h2>
      <p className="hechas__nota">Fotos reales de tortas que ya salieron de nuestro horno.</p>
    </div>
    <div className="hechas__tira" tabIndex={0} aria-label="Fotos de tortas hechas por JIRÉH">
      <ul className="hechas__lista">
        {FOTOS.map((src, i) => (
          <li key={src}>
            <img src={src} alt={`Torta hecha por JIRÉH, foto ${i + 1}`} loading="lazy" decoding="async" width={185} height={185} />
          </li>
        ))}
      </ul>
      {/* Copia para que el deslizamiento no tenga cortes (los lectores de pantalla la ignoran) */}
      <ul className="hechas__lista" aria-hidden="true">
        {FOTOS.map((src) => (
          <li key={src}>
            <img src={src} alt="" loading="lazy" decoding="async" width={185} height={185} />
          </li>
        ))}
      </ul>
    </div>
  </section>
);
