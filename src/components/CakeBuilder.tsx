import React, { useEffect, useState } from 'react';
import { CakeSlice } from './CakeSlice';
import { FILLINGS, FROSTINGS, HOUSE_CAKE, OCCASIONS, SPONGES, type CakeChoice } from '../data/layers';
import { estimateCakePrice, generateWhatsAppOrderUrl } from '../utils/orderCalculator';

/**
 * "Arma tu torta" (capa: relleno de manjar). El momento estrella del sitio: la tajada cambia en vivo
 * con cada elección y el pedido sale armado hacia WhatsApp.
 */

interface ChipGroupProps<T extends { id: string; label: string }> {
  legend: string;
  step: number;
  name: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  swatch?: (o: T) => string;
}

function ChipGroup<T extends { id: string; label: string }>({ legend, step, name, options, value, onChange, swatch }: ChipGroupProps<T>) {
  return (
    <fieldset className="chips">
      <legend>
        <span className="chips__step" aria-hidden="true">{step}</span>
        {legend}
      </legend>
      <div className="chips__list">
        {options.map((o) => (
          <label key={o.id} className="chip">
            <input type="radio" name={name} value={o.id} checked={value.id === o.id} onChange={() => onChange(o)} />
            {swatch && <span className="chip__swatch" style={{ background: swatch(o) }} aria-hidden="true" />}
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

const MIN_PORTIONS = 10;
const MAX_PORTIONS = 80;

export const CakeBuilder: React.FC = () => {
  const [choice, setChoice] = useState<CakeChoice>(HOUSE_CAKE);
  const [occasion, setOccasion] = useState<string>(OCCASIONS[0]);
  const [portions, setPortions] = useState(25);
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [dedication, setDedication] = useState('');
  const [notes, setNotes] = useState('');

  const price = estimateCakePrice(portions, choice.frosting.specialty);
  // La fecha mínima se calcula en el navegador (el HTML pre-renderizado no sabe qué día es hoy)
  const [today, setToday] = useState<string | undefined>();
  useEffect(() => setToday(new Date().toISOString().slice(0, 10)), []);
  const set = (patch: Partial<CakeChoice>) => setChoice((c) => ({ ...c, ...patch }));

  const summary = `${choice.sponge.label}, con ${choice.filling1.label.toLowerCase()} y ${choice.filling2.label.toLowerCase()}. Cobertura: ${choice.frosting.label.toLowerCase()}.`;

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const url = generateWhatsAppOrderUrl({
      category: occasion as never,
      portions,
      spongeFlavor: choice.sponge.label,
      filling1: choice.filling1.label,
      filling2: choice.filling2.label,
      frostingType: choice.frosting.label,
      themeNotes: notes.trim(),
      dedicationText: dedication.trim(),
      deliveryDate: date,
      customerName: name.trim(),
    });
    window.open(url, '_blank', 'noopener');
  };

  return (
    <section id="arma" className="builder" aria-labelledby="arma-title">
      <div className="wrap builder__grid">
        <div className="builder__stage">
          <div className="builder__sticky">
            <CakeSlice choice={choice} className="builder__svg" />
            <div className="builder__ticket" aria-live="polite">
              <p className="builder__summary">{summary}</p>
              <p className="builder__price">
                {portions} porciones · desde <strong className="price">S/&nbsp;{price}</strong>
              </p>
            </div>
          </div>
        </div>

        <form className="builder__form" onSubmit={send}>
          <h2 id="arma-title" className="display builder__title">Arma tu torta</h2>
          <p className="lede builder__lede">
            Elige capa por capa y mira cómo queda. Al final te armamos el mensaje para WhatsApp y confirmamos
            precio y fecha contigo.
          </p>

          <ChipGroup legend="Bizcocho" step={1} name="bizcocho" options={SPONGES} value={choice.sponge} onChange={(sponge) => set({ sponge })} swatch={(o) => o.color} />
          <ChipGroup legend="Primer relleno" step={2} name="relleno1" options={FILLINGS} value={choice.filling1} onChange={(filling1) => set({ filling1 })} swatch={(o) => o.color} />
          <ChipGroup legend="Segundo relleno" step={3} name="relleno2" options={FILLINGS} value={choice.filling2} onChange={(filling2) => set({ filling2 })} swatch={(o) => o.color} />
          <ChipGroup legend="Cobertura" step={4} name="cobertura" options={FROSTINGS} value={choice.frosting} onChange={(frosting) => set({ frosting })} swatch={(o) => o.color} />

          <fieldset className="details">
            <legend>
              <span className="chips__step" aria-hidden="true">5</span>
              Tu celebración
            </legend>

            <div className="field field--wide">
              <label htmlFor="porciones">
                Porciones: <strong className="price">{portions}</strong>
              </label>
              <input
                id="porciones"
                type="range"
                min={MIN_PORTIONS}
                max={MAX_PORTIONS}
                step={5}
                value={portions}
                onChange={(e) => setPortions(Number(e.target.value))}
                aria-valuetext={`${portions} porciones`}
              />
            </div>

            <div className="field">
              <label htmlFor="ocasion">Ocasión</label>
              <select id="ocasion" value={occasion} onChange={(e) => setOccasion(e.target.value)}>
                {OCCASIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="fecha">Fecha de entrega</label>
              <input id="fecha" type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            <div className="field">
              <label htmlFor="nombre">Tu nombre</label>
              <input id="nombre" type="text" autoComplete="given-name" maxLength={60} value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="field">
              <label htmlFor="dedicatoria">Mensaje en la torta (opcional)</label>
              <input id="dedicatoria" type="text" maxLength={50} placeholder="Feliz cumpleaños, Ana" value={dedication} onChange={(e) => setDedication(e.target.value)} />
            </div>

            <div className="field field--wide">
              <label htmlFor="notas">Diseño o temática (opcional)</label>
              <textarea id="notas" rows={2} maxLength={300} placeholder="Colores, personaje o una foto de referencia que nos mandarás por WhatsApp" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </fieldset>

          <div className="builder__send">
            <button type="submit" className="btn btn--solid-dark btn--lg">
              Enviar pedido por WhatsApp <span className="btn__arrow" aria-hidden="true">→</span>
            </button>
            <p className="builder__note">El precio es referencial. Lo confirmamos contigo según el diseño final.</p>
          </div>
        </form>
      </div>
    </section>
  );
};
