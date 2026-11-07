import React, { useState } from 'react';
import type { CakeItem } from '../types/bakery';
import { generateWhatsAppCakeQuote } from '../utils/orderCalculator';

const FIRST = 6;

/** Catálogo: fotos grandes, nombre y precio. Toda la tarjeta lleva a pedirla por WhatsApp. */
export const Vitrina: React.FC<{ products: CakeItem[] }> = ({ products }) => {
  const [all, setAll] = useState(false);
  // Las destacadas primero
  const sorted = [...products].sort((a, b) => Number(Boolean(b.isPopular)) - Number(Boolean(a.isPopular)));
  const visible = all ? sorted : sorted.slice(0, FIRST);

  return (
    <section id="vitrina" className="tortas" aria-labelledby="tortas-title">
      <div className="wrap">
        <header className="tortas__head">
          <h2 id="tortas-title" className="display tortas__title">Nuestras tortas</h2>
          <p className="tortas__lede">Elige una y te confirmamos por WhatsApp.</p>
        </header>

        <ul className="tortas__grid">
          {visible.map((cake) => (
            <li key={cake.id}>
              <a
                className="torta"
                href={generateWhatsAppCakeQuote(cake.name, cake.portions)}
                target="_blank"
                rel="noopener"
              >
                <span className="torta__foto">
                  <img src={cake.image} alt="" loading="lazy" decoding="async" width={800} height={1000} />
                </span>
                <span className="torta__nombre">{cake.name}</span>
                <span className="torta__precio">
                  desde <span className="price">S/&nbsp;{cake.basePrice}</span>
                  <span className="torta__pedir">
                    Pedir<span className="sr-only"> por WhatsApp</span> <span aria-hidden="true">→</span>
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        {sorted.length > FIRST && (
          <div className="tortas__more">
            <button type="button" className="btn btn--ghost-dark" aria-expanded={all} onClick={() => setAll((v) => !v)}>
              {all ? 'Ver menos' : `Ver las ${sorted.length} tortas`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
