import React from 'react';
import { FAQS, GOOGLE_REVIEWS } from '../data/bakeryData';
import { STORE_WHATSAPP_URL } from '../utils/orderCalculator';

const STEPS = [
  { title: 'Elige o arma', text: 'Una torta de la vitrina o la tuya, capa por capa, con porciones y fecha.' },
  { title: 'Escríbenos', text: 'Te llega el pedido armado a WhatsApp. Confirmamos precio, diseño y hora de entrega.' },
  { title: 'Recoge o recibe', text: 'Pasa por la San Martín o te la llevamos dentro de Cajamarca y Baños del Inca.' },
];

/** Cómo pedir (capa: bizcocho). Pasos, reseñas de ejemplo y preguntas frecuentes. */
export const HowToOrder: React.FC = () => {
  const [main, ...rest] = GOOGLE_REVIEWS;

  return (
    <section id="pedir" className="order" aria-labelledby="pedir-title">
      <div className="wrap">
        <h2 id="pedir-title" className="display order__title">Cómo pedir</h2>

        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s.title} className="step">
              <span className="step__n" aria-hidden="true">{i + 1}</span>
              <h3 className="step__title">{s.title}</h3>
              <p className="step__text">{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="voices" aria-labelledby="voces-title">
          <div className="voices__head">
            <h3 id="voces-title" className="voices__title">Lo que cuentan de nosotros</h3>
            <p className="demo-note">Reseñas de ejemplo para la demo. En la versión final van las reseñas reales de Google.</p>
          </div>
          <figure className="voice voice--main">
            <blockquote className="display">“{main.comment}”</blockquote>
            <figcaption>{main.author}</figcaption>
          </figure>
          <div className="voices__side">
            {rest.map((r) => (
              <figure key={r.id} className="voice">
                <blockquote>“{r.comment}”</blockquote>
                <figcaption>{r.author}</figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="faq">
          <h3 className="faq__title">Preguntas frecuentes</h3>
          <div className="faq__list">
            {FAQS.map((f) => (
              <details key={f.q} className="faq__item">
                <summary>
                  <span>{f.q}</span>
                  <span className="faq__icon" aria-hidden="true" />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <p className="faq__more">
            ¿Otra duda?{' '}
            <a className="text-link" href={STORE_WHATSAPP_URL} target="_blank" rel="noopener">
              Pregúntanos por WhatsApp
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
};
