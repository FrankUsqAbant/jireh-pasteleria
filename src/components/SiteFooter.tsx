import React from 'react';
import type { LegalModalType } from './LegalModal';
import { STORE_PHONE, STORE_PHONE_DISPLAY, STORE_RUC, STORE_WHATSAPP_URL } from '../utils/orderCalculator';
import { NAV } from './SiteHeader';
import { goTo } from '../lib/motion';

interface SiteFooterProps {
  onOpenLibro: () => void;
  onOpenLegal: (type: Exclude<LegalModalType, null>) => void;
  onOpenAdmin: () => void;
}

const LEGAL: { type: Exclude<LegalModalType, null>; label: string }[] = [
  { type: 'faq', label: 'Preguntas frecuentes' },
  { type: 'terms', label: 'Términos y condiciones' },
  { type: 'privacy', label: 'Privacidad' },
  { type: 'delivery', label: 'Entregas' },
  { type: 'cookies', label: 'Cookies' },
];

/** Pie (capa: la base dorada). Cierra la torta: marca, datos reales y lo que exige la ley. */
export const SiteFooter: React.FC<SiteFooterProps> = ({ onOpenLibro, onOpenLegal, onOpenAdmin }) => (
  <footer className="site-footer">
    <div className="site-footer__board" aria-hidden="true" />
    <div className="wrap site-footer__grid">
      <div className="site-footer__brand">
        <p className="display site-footer__name">JIRÉH</p>
        <p className="site-footer__tag">Panadería y Pastelería · Cajamarca</p>
      </div>

      <nav aria-label="Secciones del sitio" className="site-footer__col">
        <h2>El sitio</h2>
        <ul>
          {NAV.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  goTo(n.id);
                }}
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="site-footer__col">
        <h2>Contacto</h2>
        <ul>
          <li>
            <a href={STORE_WHATSAPP_URL} target="_blank" rel="noopener">WhatsApp</a>
          </li>
          <li>
            <a href={`tel:${STORE_PHONE}`}>{STORE_PHONE_DISPLAY}</a>
          </li>
          <li>Av. San Martín de Porres 787</li>
          <li>De 2:00 p.m. a 10:00 p.m.</li>
        </ul>
      </div>

      <div className="site-footer__col">
        <h2>Información</h2>
        <ul>
          {LEGAL.map((l) => (
            <li key={l.type}>
              <button type="button" onClick={() => onOpenLegal(l.type)}>{l.label}</button>
            </li>
          ))}
        </ul>
        <button type="button" className="libro-button" onClick={onOpenLibro}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
          Libro de Reclamaciones
        </button>
      </div>
    </div>

    <div className="wrap site-footer__legal">
      <p suppressHydrationWarning>© {new Date().getFullYear()} JIRÉH Panadería y Pastelería · RUC {STORE_RUC}</p>
      <p>Fotos provisionales de Unsplash</p>
      <button type="button" className="site-footer__admin" onClick={onOpenAdmin}>
        Administrar catálogo
      </button>
    </div>
  </footer>
);
