import React, { useState } from 'react';
import { useStoreOpen } from '../lib/useStoreStatus';
import { STOREFRONT_URL } from '../data/bakeryData';
import { STORE_PHONE, STORE_PHONE_DISPLAY, STORE_WHATSAPP_URL } from '../utils/orderCalculator';

const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Av.+San+Mart%C3%ADn+de+Porres+787,+Cajamarca,+Per%C3%BA';
const MAPS_EMBED = 'https://www.google.com/maps?q=Av.+San+Mart%C3%ADn+de+Porres+787,+Cajamarca,+Per%C3%BA&output=embed';

/** Visítanos (capa: bizcocho claro). Dónde está la tienda, cuándo abre y cómo llegar. */
export const Visit: React.FC = () => {
  const open = useStoreOpen();
  // El mapa de Google solo se carga si la persona lo pide (privacidad y datos móviles)
  const [showMap, setShowMap] = useState(false);

  return (
    <section id="visitanos" className="visit" aria-labelledby="visit-title">
      <div className="wrap visit__grid">
        <div className="visit__copy">
          <h2 id="visit-title" className="display visit__title">
            Av. San Martín de Porres&nbsp;787
          </h2>
          <p className="visit__city">Cajamarca, en el cruce con el Jr. Los Andes</p>

          <dl className="visit__facts">
            <div>
              <dt>Horario</dt>
              <dd>Todos los días, de 2:00 p.m. a 10:00 p.m.</dd>
            </div>
            <div>
              <dt>Ahora</dt>
              <dd>
                <span className="status-dot" data-open={open || undefined} aria-hidden="true" />
                {open === null ? 'Consultando…' : open ? 'Abierto' : 'Cerrado, abrimos a las 2:00 p.m.'}
              </dd>
            </div>
            <div>
              <dt>Teléfono</dt>
              <dd>
                <a className="text-link" href={`tel:${STORE_PHONE}`}>{STORE_PHONE_DISPLAY}</a>
              </dd>
            </div>
          </dl>

          <div className="visit__actions">
            <a className="btn btn--solid-dark" href={MAPS_URL} target="_blank" rel="noopener">
              Cómo llegar <span className="btn__arrow" aria-hidden="true">→</span>
            </a>
            <a className="btn btn--ghost-dark" href={STORE_WHATSAPP_URL} target="_blank" rel="noopener">
              Escribir por WhatsApp
            </a>
          </div>
        </div>

        <figure className="visit__photo">
          <img src={STOREFRONT_URL} alt="Fachada de JIRÉH en la San Martín, con la vitrina de tortas iluminada" loading="lazy" width={342} height={505} />
          <figcaption>La vitrina de la tienda.</figcaption>
        </figure>

        <div className="visit__map">
          {showMap ? (
            <iframe title="Mapa de JIRÉH en Google Maps" src={MAPS_EMBED} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          ) : (
            <button type="button" className="visit__map-button" onClick={() => setShowMap(true)}>
              <span className="display">Ver el mapa aquí</span>
              <span className="visit__map-note">Carga Google Maps</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
