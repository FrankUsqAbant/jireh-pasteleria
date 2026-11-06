import React, { useState } from 'react';
import { MapPin, Clock, Phone, ArrowUpRight, MessageCircle, ExternalLink, Store } from 'lucide-react';
import { STOREFRONT_URL, LOGO_URL } from '../data/bakeryData';
import { STORE_ADDRESS, STORE_PHONE, STORE_PHONE_DISPLAY, isStoreOpen } from '../utils/orderCalculator';

export const ContactLocationSection: React.FC = () => {
  const [showStorePhotoModal, setShowStorePhotoModal] = useState(false);
  const storeStatus = isStoreOpen();

  const googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=Av.+San+Mart%C3%ADn+de+Porres+787,+Cajamarca,+Peru';

  return (
    <section id="contacto" className="relative py-20 bg-[#150e09] border-t border-[#251911] overflow-hidden">
      {/* Background glow */}
      <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-[#d69c4f]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Lead */}
        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#b97f33] tracking-widest uppercase mb-3 text-left">
          <span className="w-8 h-px bg-[#b97f33]" />
          <span>05. VISÍTANOS & CONTACTO</span>
        </div>

        {/* Title & Subtitle */}
        <div className="text-left max-w-3xl mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#faf3e8] tracking-tight leading-tight text-balance mb-4">
            Te esperamos en el corazón de Cajamarca
          </h2>
          <p className="text-base sm:text-lg text-[#dfcca9] font-normal leading-relaxed">
            Ven a disfrutar de nuestras delicias recién horneadas o haz tu pedido desde la comodidad de tu hogar.
          </p>
        </div>

        {/* 2-Column Grid: Left Info Cards, Right Stylized Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: 3 Contact Cards */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            
            {/* Card 1: Ubicación */}
            <div className="p-6 rounded-2xl bg-[#1b120c] border border-[#39261a] hover:border-[#b97f33]/60 transition-all text-left group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#251911] flex items-center justify-center text-[#e8b66f] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#faf3e8] mb-1">
                      Ubicación
                    </h3>
                    <p className="text-xs sm:text-sm text-[#dfcca9] leading-relaxed max-w-xs">
                      {STORE_ADDRESS}
                    </p>
                  </div>
                </div>

                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#d69c4f]/40 bg-[#251911] hover:bg-[#d69c4f] hover:text-[#150e09] text-xs text-[#faf3e8] transition-all shrink-0"
                >
                  <span>Ver en mapa</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Card 2: Horario de Atención */}
            <div className="p-6 rounded-2xl bg-[#1b120c] border border-[#39261a] hover:border-[#b97f33]/60 transition-all text-left">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#251911] flex items-center justify-center text-[#e8b66f] shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#faf3e8] mb-1">
                      Horario de Atención
                    </h3>
                    <p className="text-xs sm:text-sm text-[#dfcca9]">
                      Lunes a Domingo — 2:00 p.m. a 10:00 p.m.
                    </p>
                  </div>
                </div>

                {/* Status Indicator */}
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${
                    storeStatus.isOpen
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                      : 'bg-amber-950/80 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      storeStatus.isOpen ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                  />
                  <span>{storeStatus.statusText}</span>
                </div>
              </div>
            </div>

            {/* Card 3: WhatsApp & Pedidos */}
            <div className="p-6 rounded-2xl bg-[#1b120c] border border-[#39261a] hover:border-[#b97f33]/60 transition-all text-left">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#251911] flex items-center justify-center text-[#e8b66f] shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#faf3e8] mb-1">
                      WhatsApp & Pedidos
                    </h3>
                    <p className="font-mono text-base font-bold text-[#faf3e8]">
                      {STORE_PHONE_DISPLAY}
                    </p>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${STORE_PHONE.replace('+', '')}?text=${encodeURIComponent('¡Hola JIRÉH Panadería y Pastelería! Quiero coordinar un pedido.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold transition-all shadow-md shrink-0"
                >
                  <span>Chatea con nosotros</span>
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Stylized Dark/Gold Cajamarca Vector Map */}
          <div className="lg:col-span-7 relative min-h-[340px] rounded-3xl border border-[#39261a] overflow-hidden bg-[#18110b] shadow-2xl flex items-center justify-center p-4">
            
            {/* SVG Dark Gold Street Grid Representation of Cajamarca */}
            <svg
              className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 600 400"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <linearGradient id="mapGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4e3424" />
                  <stop offset="50%" stopColor="#b97f33" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#251911" />
                </linearGradient>
              </defs>

              {/* Diagonal and Cross Streets (San Martin, Jr. Dos de Mayo, Jr. Amazonas, Andes) */}
              <g stroke="#39261a" strokeWidth="2" fill="none">
                <line x1="0" y1="60" x2="600" y2="120" strokeWidth="4" stroke="#4e3424" />
                <line x1="0" y1="180" x2="600" y2="240" strokeWidth="5" stroke="#b97f33" strokeOpacity="0.6" />
                <line x1="0" y1="310" x2="600" y2="350" strokeWidth="3" />
                
                <line x1="80" y1="0" x2="150" y2="400" strokeWidth="3" />
                <line x1="220" y1="0" x2="310" y2="400" strokeWidth="5" stroke="#b97f33" strokeOpacity="0.7" />
                <line x1="390" y1="0" x2="440" y2="400" strokeWidth="4" />
                <line x1="520" y1="0" x2="560" y2="400" strokeWidth="3" />

                {/* Secondary Alleys */}
                <path d="M 50,100 L 250,220 L 400,200 L 550,280" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M 120,300 L 280,260 L 450,330" strokeWidth="2" strokeDasharray="3 3" />
                <rect x="240" y="160" width="120" height="90" fill="#251911" fillOpacity="0.5" stroke="#4e3424" />
                <rect x="380" y="80" width="80" height="70" fill="#251911" fillOpacity="0.4" stroke="#4e3424" />
              </g>
            </svg>

            {/* Interactive Pin Marker matching screenshot */}
            <div className="relative z-10 flex flex-col items-center">
              
              {/* Tooltip Card over Pin */}
              <div className="flex items-center gap-3 p-2.5 pr-4 rounded-xl bg-white text-gray-900 shadow-2xl border border-gray-200 mb-2 transform hover:scale-105 transition-transform cursor-pointer"
                   onClick={() => setShowStorePhotoModal(true)}>
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-amber-50 shrink-0 border border-amber-200">
                  <img
                    src={STOREFRONT_URL}
                    alt="Fachada JIRÉH Panadería y Pastelería"
                    width={40}
                    height={40}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-left">
                  <p className="font-serif font-bold text-xs sm:text-sm text-gray-900 leading-tight">
                    JIRÉH Panadería
                  </p>
                  <p className="text-[11px] text-[#b97f33] font-semibold leading-tight">
                    y Pastelería
                  </p>
                </div>
              </div>

              {/* Pin Icon on San Martín de Porres */}
              <div className="relative flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#d69c4f] border-2 border-white shadow-xl flex items-center justify-center p-1 text-[#150e09]">
                  <img
                    src={LOGO_URL}
                    alt="Pin Logo"
                    width={36}
                    height={36}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="w-1 h-3 bg-[#d69c4f] -mt-0.5 rounded-full" />
              </div>
            </div>

            {/* Top Right Action Button: Ver en Google Maps */}
            <div className="absolute top-4 right-4 z-20 flex gap-2">
              <button
                onClick={() => setShowStorePhotoModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#251911]/90 hover:bg-[#39261a] border border-[#d69c4f]/40 text-xs font-medium text-[#faf3e8] transition-all shadow-md backdrop-blur-sm cursor-pointer"
              >
                <Store className="w-3.5 h-3.5 text-[#e8b66f]" />
                <span>Ver Local</span>
              </button>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#b97f33] hover:bg-[#d69c4f] text-[#150e09] text-xs font-bold transition-all shadow-md"
              >
                <span>Ver en Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Bottom Left Street Label */}
            <div className="absolute bottom-4 left-4 z-20 px-3 py-1 rounded bg-[#150e09]/80 border border-[#39261a] text-[11px] text-[#dfcca9]">
              📍 Av. San Martín de Porres & Jr. Los Andes, Cajamarca
            </div>

          </div>

        </div>

      </div>

      {/* Storefront Photo Modal */}
      {showStorePhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1b120c] border border-[#d69c4f]/50 rounded-3xl max-w-xl w-full p-6 text-left shadow-2xl relative">
            <button
              onClick={() => setShowStorePhotoModal(false)}
              className="absolute top-4 right-4 text-[#dfcca9] hover:text-white text-xl cursor-pointer"
            >
              ✕
            </button>
            <h3 className="font-serif text-xl font-bold text-[#faf3e8] mb-1">
              Nuestro Local en Cajamarca
            </h3>
            <p className="text-xs text-[#dfcca9] mb-4">
              Av. San Martín de Porres 787 — Ven y visítanos para degustar nuestros pasteles y panes recién salidos del horno.
            </p>
            <div className="rounded-2xl overflow-hidden border border-[#39261a] shadow-inner bg-[#251911] aspect-[4/3]">
              <img
                src={STOREFRONT_URL}
                alt="Fachada Panadería y Pastelería Jireh Cajamarca"
                width={600}
                height={450}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-[#b97f33]">
                Horario: Lunes a Domingo de 2:00 p.m. a 10:00 p.m.
              </span>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-[#b97f33] hover:bg-[#d69c4f] text-[#150e09] font-bold text-xs"
              >
                Abrir en Google Maps ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
