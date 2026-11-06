import React, { useEffect, useRef, useState } from 'react';
import { LOGO_URL } from '../data/bakeryData';
import { STORE_WHATSAPP_URL } from '../utils/orderCalculator';
import { goTo } from '../lib/motion';

export const NAV = [
  { id: 'vitrina', label: 'Vitrina' },
  { id: 'arma', label: 'Arma tu torta' },
  { id: 'pedir', label: 'Cómo pedir' },
  { id: 'visitanos', label: 'Visítanos' },
] as const;

/** Cabecera: la capa de cobertura que siempre queda arriba. Marca la sección en la que estás. */
export const SiteHeader: React.FC = () => {
  const [current, setCurrent] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  // Sección actual
  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCurrent(e.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Menú móvil: Escape cierra, el foco queda dentro
  useEffect(() => {
    if (!open) return;
    const root = panel.current;
    root?.querySelector<HTMLElement>('a,button')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
      if (e.key === 'Tab' && root) {
        const items = [...root.querySelectorAll<HTMLElement>('a,button')];
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    goTo(id);
  };

  return (
    <header className="site-header">
      <div className="wrap site-header__bar">
        <a href="#inicio" className="brand" onClick={go('inicio')} aria-label="JIRÉH Panadería y Pastelería, ir al inicio">
          <img src={LOGO_URL} alt="" width={40} height={40} className="brand__logo" />
          <span className="brand__name">JIRÉH</span>
        </a>

        <nav aria-label="Secciones" className="site-nav">
          <ul>
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} onClick={go(n.id)} aria-current={current === n.id ? 'location' : undefined} className="site-nav__link">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <a className="btn btn--ghost-light btn--sm" href={STORE_WHATSAPP_URL} target="_blank" rel="noopener">
            WhatsApp
          </a>
          <button
            ref={menuButton}
            type="button"
            className="menu-button"
            aria-expanded={open}
            aria-controls="menu-movil"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Cerrar' : 'Menú'}
          </button>
        </div>
      </div>

      <div id="menu-movil" ref={panel} className="mobile-menu" data-open={open || undefined} hidden={!open}>
        <nav aria-label="Secciones">
          <ul>
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} onClick={go(n.id)} className="display">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="btn btn--solid-light" href={STORE_WHATSAPP_URL} target="_blank" rel="noopener">
          Escríbenos por WhatsApp <span className="btn__arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </header>
  );
};
