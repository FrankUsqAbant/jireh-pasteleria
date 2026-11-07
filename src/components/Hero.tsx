import React from 'react';
import { CakeSlice } from './CakeSlice';
import { HOUSE_CAKE } from '../data/layers';
import { STORE_WHATSAPP_URL } from '../utils/orderCalculator';
import { useStoreOpen } from '../lib/useStoreStatus';
import { goTo } from '../lib/motion';

/** Portada (capa: cobertura). La tajada de la casa se arma capa por capa al entrar. */
export const Hero: React.FC = () => {
  const open = useStoreOpen();

  return (
    <section id="inicio" className="hero" aria-labelledby="hero-title">
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <p className="hero__kicker">Panadería y pastelería en Cajamarca</p>
          <h1 id="hero-title" className="display hero__title">
            Tortas por capas, armadas a&nbsp;tu&nbsp;gusto.
          </h1>
          <p className="lede hero__lede">
            Eliges el bizcocho, dos rellenos y la cobertura. Nosotros la horneamos y te la tenemos lista para
            tu celebración. Pide por WhatsApp en un minuto.
          </p>
          <div className="hero__actions">
            <a
              href="#arma"
              className="btn btn--solid-light"
              onClick={(e) => {
                e.preventDefault();
                goTo('arma');
              }}
            >
              Arma tu torta <span className="btn__arrow" aria-hidden="true">→</span>
            </a>
            <a className="btn btn--ghost-light" href={STORE_WHATSAPP_URL} target="_blank" rel="noopener">
              Pedir por WhatsApp
            </a>
          </div>
        </div>

        <figure className="hero__slice">
          <CakeSlice choice={HOUSE_CAKE} intro className="hero__svg" />
          <figcaption>La de la casa: vainilla con chispas, manjar blanco y fudge, con gota de chocolate.</figcaption>
        </figure>

        <dl className="hero__meta">
          <div>
            <dt>Hoy</dt>
            <dd>
              <span className="status-dot" data-open={open || undefined} aria-hidden="true" />
              {open === null ? 'De 2:00 p.m. a 10:00 p.m.' : open ? 'Abierto hasta las 10:00 p.m.' : 'Abrimos a las 2:00 p.m.'}
            </dd>
          </div>
          <div>
            <dt>Dónde</dt>
            <dd>Av. San Martín de Porres 787</dd>
          </div>
        </dl>
      </div>
    </section>
  );
};
