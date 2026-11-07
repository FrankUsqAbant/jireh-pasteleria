import React, { useMemo, useState } from 'react';
import type { CakeItem } from '../types/bakery';
import { CAKE_CATEGORIES } from '../data/bakeryData';
import { generateWhatsAppCakeQuote } from '../utils/orderCalculator';
import { goTo } from '../lib/motion';

/**
 * La vitrina (capa: bizcocho). Las tortas del catálogo en repisas, como en la vitrina del local.
 * Los datos vienen de Supabase (useCatalog) y el admin los edita.
 */
export const Vitrina: React.FC<{ products: CakeItem[] }> = ({ products }) => {
  const [category, setCategory] = useState<string>('todas');

  const categories = useMemo(
    () => CAKE_CATEGORIES.filter((c) => products.some((p) => p.category === c.id)),
    [products],
  );
  const visible = category === 'todas' ? products : products.filter((p) => p.category === category);
  // Las destacadas primero, como en la repisa de adelante
  const sorted = [...visible].sort((a, b) => Number(Boolean(b.isPopular)) - Number(Boolean(a.isPopular)));

  return (
    <section id="vitrina" className="vitrina" aria-labelledby="vitrina-title">
      <div className="wrap">
        <div className="vitrina__head">
          <h2 id="vitrina-title" className="display vitrina__title">La vitrina</h2>
          <p className="lede vitrina__lede">
            Las que más salen del obrador. Pídela tal cual o úsala de punto de partida para armar la tuya.
          </p>
        </div>

        <div className="filters" role="group" aria-label="Filtrar por tipo de torta">
          {[{ id: 'todas', label: 'Todas' }, ...categories].map((c) => (
            <button key={c.id} type="button" className="filter" aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>
              {c.label}
            </button>
          ))}
        </div>

        <ul className="shelf" aria-live="polite">
          {sorted.map((cake) => (
            <li key={cake.id} className="cake-card">
              <div className="cake-card__frame">
                <img src={cake.image} alt={cake.name} loading="lazy" decoding="async" width={480} height={600} />
              </div>
              <div className="cake-card__body">
                {cake.badge && <p className="cake-card__badge">{cake.badge}</p>}
                <h3 className="cake-card__name">{cake.name}</h3>
                <p className="cake-card__meta">
                  {cake.portions} · desde <span className="price">S/&nbsp;{cake.basePrice}</span>
                </p>
                <div className="cake-card__actions">
                  <a
                    className="btn btn--solid-dark btn--sm"
                    href={generateWhatsAppCakeQuote(cake.name, cake.portions)}
                    target="_blank"
                    rel="noopener"
                    aria-label={`Pedir esta: ${cake.name}, por WhatsApp`}
                  >
                    Pedir esta <span className="btn__arrow" aria-hidden="true">→</span>
                  </a>
                  {cake.isCustomizable !== false && (
                    <a
                      href="#arma"
                      className="text-link cake-card__custom"
                      onClick={(e) => {
                        e.preventDefault();
                        goTo('arma');
                      }}
                    >
                      Armarla a mi gusto
                    </a>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
