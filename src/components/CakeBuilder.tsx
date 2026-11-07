import React, { useEffect, useState } from 'react';
import { FILLINGS, FROSTINGS, OCCASIONS, PORTIONS, SPONGES } from '../data/layers';
import { estimateCakePrice, generateWhatsAppOrderUrl } from '../utils/orderCalculator';

/** "A medida": un formulario corto que arma el pedido y lo abre en WhatsApp. */
export const CakeBuilder: React.FC = () => {
  const [occasion, setOccasion] = useState<string>(OCCASIONS[0]);
  const [sponge, setSponge] = useState<string>(SPONGES[0]);
  const [filling, setFilling] = useState<string>(FILLINGS[0]);
  const [frosting, setFrosting] = useState<string>(FROSTINGS[0].label);
  const [portions, setPortions] = useState(20);
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  // La fecha mínima se calcula en el navegador (el HTML pre-renderizado no sabe qué día es hoy)
  const [today, setToday] = useState<string | undefined>();
  useEffect(() => {
    setToday(new Date().toISOString().slice(0, 10));
  }, []);

  const specialty = FROSTINGS.find((f) => f.label === frosting)?.specialty ?? false;
  const price = estimateCakePrice(portions, specialty);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const url = generateWhatsAppOrderUrl({
      category: occasion as never,
      portions,
      spongeFlavor: sponge,
      filling1: filling,
      frostingType: frosting,
      dedicationText: message.trim(),
      deliveryDate: date,
      customerName: name.trim(),
    });
    window.open(url, '_blank', 'noopener');
  };

  return (
    <section id="arma" className="medida" aria-labelledby="medida-title">
      <div className="wrap medida__grid">
        <figure className="medida__foto">
          <img
            src="/assets/portada/tajada.webp"
            alt="Tajada de torta de vainilla con capas de crema rosada"
            loading="lazy"
            decoding="async"
            width={1000}
            height={1250}
          />
        </figure>

        <div className="medida__copy">
          <h2 id="medida-title" className="display medida__title">Tu torta, a tu&nbsp;gusto</h2>
          <p className="medida__lede">Cuéntanos cómo la quieres y te confirmamos precio y fecha por WhatsApp.</p>

          <form className="medida__form" onSubmit={send}>
            <div className="campo">
              <label htmlFor="m-bizcocho">Bizcocho</label>
              <select id="m-bizcocho" value={sponge} onChange={(e) => setSponge(e.target.value)}>
                {SPONGES.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="campo">
              <label htmlFor="m-relleno">Relleno</label>
              <select id="m-relleno" value={filling} onChange={(e) => setFilling(e.target.value)}>
                {FILLINGS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="campo">
              <label htmlFor="m-cobertura">Cobertura</label>
              <select id="m-cobertura" value={frosting} onChange={(e) => setFrosting(e.target.value)}>
                {FROSTINGS.map((o) => <option key={o.label}>{o.label}</option>)}
              </select>
            </div>
            <div className="campo">
              <label htmlFor="m-porciones">Porciones</label>
              <select id="m-porciones" value={portions} onChange={(e) => setPortions(Number(e.target.value))}>
                {PORTIONS.map((p) => <option key={p} value={p}>{p} porciones</option>)}
              </select>
            </div>
            <div className="campo">
              <label htmlFor="m-ocasion">Ocasión</label>
              <select id="m-ocasion" value={occasion} onChange={(e) => setOccasion(e.target.value)}>
                {OCCASIONS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="campo">
              <label htmlFor="m-fecha">Fecha</label>
              <input id="m-fecha" type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="campo campo--ancho">
              <label htmlFor="m-nombre">Tu nombre</label>
              <input id="m-nombre" type="text" autoComplete="given-name" maxLength={60} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="campo campo--ancho">
              <label htmlFor="m-mensaje">Mensaje en la torta (opcional)</label>
              <input id="m-mensaje" type="text" maxLength={50} placeholder="Feliz cumpleaños, Ana" value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>

            <div className="medida__enviar">
              <p className="medida__precio" aria-live="polite">
                Desde <strong className="price">S/&nbsp;{price}</strong>
              </p>
              <button type="submit" className="btn btn--solid-light btn--lg">
                Enviar por WhatsApp <span className="btn__arrow" aria-hidden="true">→</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
