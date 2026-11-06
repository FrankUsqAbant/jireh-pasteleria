import React, { useState } from 'react';
import { MessageCircle, Menu, X } from 'lucide-react';
import { LOGO_URL } from '../data/bakeryData';
import { STORE_PHONE } from '../utils/orderCalculator';

interface NavbarProps {
  onOpenCustomModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCustomModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Historia', href: '#historia' },
    { label: 'Tortas', href: '#tortas' },
    { label: 'Cómo Pedir', href: '#proceso' },
    { label: 'Contacto', href: '#contacto' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#150e09]/95 backdrop-blur-md border-b border-[#39261a]/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#inicio"
          className="flex items-center gap-3 group whitespace-nowrap shrink-0"
        >
          <div className="w-12 h-12 rounded-full overflow-hidden border border-[#d69c4f]/50 bg-[#faf3e8] p-0.5 shadow-md transition-transform group-hover:scale-105 shrink-0">
            <img
              src={LOGO_URL}
              alt="JIRÉH Panadería y Pastelería Logo"
              width={48}
              height={48}
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#faf3e8] leading-none group-hover:text-[#e8b66f] transition-colors">
              JIRÉH Panadería
            </span>
            <span className="font-serif text-sm sm:text-base text-[#e8b66f] font-medium leading-tight">
              y Pastelería
            </span>
          </div>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#dfcca9]">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-[#faf3e8] transition-colors whitespace-nowrap shrink-0 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#d69c4f] hover:after:w-full after:transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 Primary Action (WhatsApp button matching screenshot) */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <a
            href={`https://wa.me/${STORE_PHONE.replace('+', '')}?text=${encodeURIComponent('¡Hola JIRÉH Panadería y Pastelería! Quisiera consultar sobre sus tortas y productos.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#4e3424] bg-[#1b120c] hover:bg-[#251911] text-[#faf3e8] hover:border-[#d69c4f] transition-all text-xs sm:text-sm font-medium shadow-sm hover:shadow-md group whitespace-nowrap shrink-0"
          >
            <span className="w-6 h-6 rounded-full bg-[#25D366] flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform shadow-xs">
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
            </span>
            <span className="tracking-wide">Escríbenos por WhatsApp</span>
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#dfcca9] hover:text-[#faf3e8] focus:outline-none focus:ring-1 focus:ring-[#d69c4f] rounded-lg"
            aria-label="Abrir menú de navegación"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#150e09] border-b border-[#39261a] px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-base font-medium text-[#dfcca9] hover:text-[#faf3e8] hover:bg-[#251911] rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-2 border-t border-[#39261a]/60">
            <a
              href={`https://wa.me/${STORE_PHONE.replace('+', '')}?text=${encodeURIComponent('¡Hola JIRÉH Panadería y Pastelería! Quisiera consultar sobre sus tortas.')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-full border border-[#d69c4f]/50 bg-[#1b120c] text-[#faf3e8] text-sm font-medium"
            >
              <span className="w-6 h-6 rounded-full bg-[#25D366] flex items-center justify-center text-white">
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
              </span>
              <span>Escríbenos por WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
