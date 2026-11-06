import React from 'react';
import { BookText, Phone, MapPin, Instagram, Facebook, MessageCircle, Shield, Lock } from 'lucide-react';
import { LOGO_URL } from '../data/bakeryData';
import { STORE_PHONE, STORE_PHONE_DISPLAY, STORE_RUC, STORE_ADDRESS } from '../utils/orderCalculator';

interface FooterSectionProps {
  onOpenLibroReclamaciones: () => void;
  onOpenLegalModal: (type: 'terms' | 'privacy' | 'cookies' | 'delivery' | 'faq') => void;
  onOpenAdminModal: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  onOpenLibroReclamaciones,
  onOpenLegalModal,
  onOpenAdminModal,
}) => {
  return (
    <footer className="relative bg-[#0d0805] text-[#dfcca9] pt-16 pb-12 border-t border-[#251911]">
      {/* Decorative Brand Seal with Wheat Flanks matching Screenshot 05 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <div className="flex items-center justify-center gap-6">
          <div className="hidden sm:block w-24 h-px bg-gradient-to-r from-transparent to-[#b97f33]" />
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#d69c4f] bg-[#faf3e8] p-0.5 shadow-xl mb-3">
              <img
                src={LOGO_URL}
                alt="JIRÉH Panadería y Pastelería Logo"
                width={64}
                height={64}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="font-serif text-sm text-[#f5d49f] italic max-w-md">
              &ldquo;Pastelería y panadería fina horneada a diario con los mejores ingredientes de Cajamarca.&rdquo;
            </p>
          </div>

          <div className="hidden sm:block w-24 h-px bg-gradient-to-l from-transparent to-[#b97f33]" />
        </div>
      </div>

      {/* 4-Column Detailed Footer matching Screenshot 06 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[#251911]">
          
          {/* Col 1: Brand Info (span 4) */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <h3 className="font-serif text-xl font-bold text-[#faf3e8]">
              JIRÉH Panadería y Pastelería
            </h3>
            <p className="text-xs sm:text-sm text-[#dfcca9] leading-relaxed">
              Tradición, sabor y dedicación en cada detalle. Llevamos más de 15 años endulzando los momentos más especiales de Cajamarca.
            </p>
            <div className="text-xs text-[#a89078] space-y-1 font-mono">
              <p>Razón Social: Panadería y Pastelería Jireh</p>
              <p>RUC: {STORE_RUC}</p>
            </div>
          </div>

          {/* Col 2: Explorar (span 2) */}
          <div className="lg:col-span-2 space-y-3 text-left">
            <h4 className="font-serif text-base font-bold text-[#faf3e8]">
              Explorar
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#inicio" className="hover:text-[#faf3e8] transition-colors">Inicio</a>
              </li>
              <li>
                <a href="#historia" className="hover:text-[#faf3e8] transition-colors">Nuestra Historia</a>
              </li>
              <li>
                <a href="#tortas" className="hover:text-[#faf3e8] transition-colors">Catálogo de Tortas</a>
              </li>
              <li>
                <a href="#proceso" className="hover:text-[#faf3e8] transition-colors">Cómo Pedir</a>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegalModal('faq')}
                  className="hover:text-[#faf3e8] transition-colors text-left"
                >
                  Preguntas Frecuentes (FAQ)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal (span 3) */}
          <div className="lg:col-span-3 space-y-3 text-left">
            <h4 className="font-serif text-base font-bold text-[#faf3e8]">
              Legal
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onOpenLegalModal('terms')}
                  className="hover:text-[#faf3e8] transition-colors text-left"
                >
                  Términos y Condiciones
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegalModal('privacy')}
                  className="hover:text-[#faf3e8] transition-colors text-left"
                >
                  Políticas de Privacidad
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegalModal('cookies')}
                  className="hover:text-[#faf3e8] transition-colors text-left"
                >
                  Política de Cookies
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegalModal('delivery')}
                  className="hover:text-[#faf3e8] transition-colors text-left"
                >
                  Políticas de Entrega y Devoluciones
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Atención al Cliente & Libro de Reclamaciones (span 3) */}
          <div className="lg:col-span-3 space-y-4 text-left">
            <h4 className="font-serif text-base font-bold text-[#faf3e8]">
              Atención al Cliente
            </h4>
            <div className="space-y-2 text-xs sm:text-sm">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#e8b66f] shrink-0" />
                <span className="font-mono">{STORE_PHONE_DISPLAY}</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#e8b66f] shrink-0 mt-0.5" />
                <span>{STORE_ADDRESS}</span>
              </p>
            </div>

            {/* Libro de Reclamaciones Button matching Screenshot 06 */}
            <button
              onClick={onOpenLibroReclamaciones}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-[#b97f33]/60 bg-[#1b120c] hover:bg-[#251911] transition-all group text-left shadow-sm hover:shadow-md cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-[#b97f33]/20 flex items-center justify-center text-[#e8b66f] shrink-0 group-hover:scale-105 transition-transform">
                <BookText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-serif font-bold text-xs sm:text-sm text-[#faf3e8] leading-tight">
                  Libro de Reclamaciones
                </p>
                <p className="text-[11px] text-[#dfcca9] leading-tight">
                  Envía una queja o reclamo
                </p>
              </div>
            </button>

            {/* Acceso Administrador (ADM) Button */}
            <button
              onClick={onOpenAdminModal}
              className="w-full flex items-center justify-between p-2.5 rounded-xl border border-[#39261a] hover:border-[#d69c4f]/60 bg-[#120a06] hover:bg-[#1f120a] transition-all text-xs text-[#dfcca9] hover:text-[#faf3e8] group cursor-pointer"
              title="Administrar tortas, catálogo y precios"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#d69c4f]/20 flex items-center justify-center text-[#e8b66f]">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <span className="font-bold text-xs block text-[#faf3e8]">Panel ADM</span>
                  <span className="text-[10px] text-[#a89078] block">Administrar catálogo y precios</span>
                </div>
              </div>
              <span className="text-[10px] font-medium text-[#e8b66f] bg-[#2a170b] px-2 py-0.5 rounded border border-[#d69c4f]/30 group-hover:border-[#d69c4f]">
                Entrar ⚙
              </span>
            </button>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Payment Badges, Social Media, ADM Link */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#a89078]">
          
          {/* Copyright & Legal Store Identification */}
          <div className="text-center md:text-left flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p>© 2026 JIRÉH Panadería y Pastelería. RUC: {STORE_RUC}. Todos los derechos reservados.</p>
            <span className="hidden sm:inline text-[#4a2e1c]">•</span>
            <span className="text-[#a89078]">Cajamarca, Perú</span>
          </div>

          {/* Payment Methods Badges matching Screenshot 06 */}
          <div className="flex items-center gap-2 bg-[#1b120c] px-3 py-1.5 rounded-full border border-[#39261a]">
            <span className="font-bold text-[10px] text-blue-400 bg-white/10 px-2 py-0.5 rounded">VISA</span>
            <span className="font-bold text-[10px] text-red-400 bg-white/10 px-2 py-0.5 rounded">MasterCard</span>
            <span className="font-bold text-[10px] text-purple-400 bg-white/10 px-2 py-0.5 rounded">Yape</span>
            <span className="font-bold text-[10px] text-cyan-400 bg-white/10 px-2 py-0.5 rounded">Plin</span>
            <span className="text-[10px] text-[#dfcca9] px-1.5">Efectivo</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 text-[#dfcca9]">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook de Jireh"
              className="hover:text-[#e8b66f] transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de Jireh"
              className="hover:text-[#e8b66f] transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={`https://wa.me/${STORE_PHONE.replace('+', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp directo"
              className="hover:text-[#e8b66f] transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
};
