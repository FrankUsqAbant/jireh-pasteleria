import React, { useState } from 'react';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { CakeCategory, CakeItem } from '../types/bakery';
import { CAKE_CATEGORIES, FEATURED_SPECIALTIES } from '../data/bakeryData';
import { generateWhatsAppCakeQuote } from '../utils/orderCalculator';

interface CakeCatalogSectionProps {
  onOpenGallery: () => void;
  onSelectCake: (cake: CakeItem) => void;
  products?: CakeItem[];
}

export const CakeCatalogSection: React.FC<CakeCatalogSectionProps> = ({
  onOpenGallery,
  onSelectCake,
  products = FEATURED_SPECIALTIES,
}) => {
  const [activeCategory, setActiveCategory] = useState<CakeCategory>('cumpleanos');
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Filter items matching activeCategory, or fallback to popular / top items
  const categoryMatches = products.filter((p) => p.category === activeCategory);
  const activeSpecialties = categoryMatches.length >= 3 
    ? categoryMatches 
    : [
        ...categoryMatches,
        ...products.filter((p) => p.category !== activeCategory && p.isPopular),
        ...products.filter((p) => p.category !== activeCategory && !p.isPopular),
      ].slice(0, 3);


  const handleNext = () => {
    setCarouselIndex((prev) => (prev + 1) % Math.max(1, activeSpecialties.length));
  };

  const handlePrev = () => {
    setCarouselIndex((prev) => (prev - 1 + activeSpecialties.length) % Math.max(1, activeSpecialties.length));
  };

  const totalSpecialties = Math.max(1, activeSpecialties.length);
  const safeIndex = (carouselIndex % totalSpecialties + totalSpecialties) % totalSpecialties;
  const leftCake = activeSpecialties[safeIndex % totalSpecialties] || FEATURED_SPECIALTIES[0];
  const centerCake = activeSpecialties[(safeIndex + 1) % totalSpecialties] || FEATURED_SPECIALTIES[1];
  const rightCake = activeSpecialties[(safeIndex + 2) % totalSpecialties] || FEATURED_SPECIALTIES[2];

  return (
    <section id="tortas" className="relative py-20 bg-[#150e09] border-t border-[#251911] overflow-hidden">
      {/* Background glow and subtle spark */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-[#b97f33]/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Section Lead */}
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-[#b97f33] tracking-widest uppercase mb-3">
          <span className="w-8 h-px bg-[#b97f33]" />
          <span>03. NUESTRAS TORTAS & ESPECIALIDADES</span>
          <span className="w-8 h-px bg-[#b97f33]" />
        </div>

        {/* Title */}
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#faf3e8] tracking-tight leading-tight text-balance mb-4">
          Obras de arte listas para celebrar contigo
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#dfcca9] max-w-2xl mx-auto font-normal leading-relaxed mb-10">
          Elige una categoría y desliza para descubrir diseños artesanales recién salidos de nuestro obrador en Cajamarca.
        </p>

        {/* Category Filter Pills (Functional button controls) */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-14">
          {CAKE_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id as CakeCategory);
                  setCarouselIndex(0);
                }}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#b97f33] text-[#150e09] font-bold shadow-lg scale-105'
                    : 'bg-[#1b120c] text-[#e4d5c4] border border-[#39261a] hover:border-[#b97f33]/60 hover:text-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3-Tier Showcase Presentation matching Screenshot 03 */}
        <div className="relative max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            
            {/* Left Card */}
            <div className="flex flex-col items-center group order-2 md:order-1 transition-all duration-300">
              <div className="relative w-56 sm:w-64 aspect-square flex items-center justify-center mb-4 transition-transform group-hover:scale-105 duration-300">
                <img
                  key={`left-${leftCake.id}`}
                  src={leftCake.image}
                  alt={leftCake.name}
                  width={256}
                  height={256}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain drop-shadow-[0_15px_20px_rgba(0,0,0,0.6)] transition-opacity duration-300"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/cropped/torta_chocodrip.jpg';
                  }}
                />
              </div>

              <h3 className="font-serif text-lg font-bold text-[#faf3e8] mb-1 text-center">
                {leftCake.name}
              </h3>
              <p className="text-xs text-[#dfcca9] mb-1">
                {leftCake.portions} • <strong className="text-[#e8b66f]">S/. {leftCake.basePrice}</strong>
              </p>
              <a
                href={generateWhatsAppCakeQuote(leftCake.name, leftCake.portions)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#e8b66f] hover:text-white transition-colors"
              >
                <span>Cotizar</span>
                <span>↗</span>
              </a>
            </div>

            {/* Center Highlighted Card */}
            <div className="relative flex flex-col items-center p-6 sm:p-8 pb-8 sm:pb-9 rounded-3xl bg-[#1b120c] border border-[#d69c4f]/50 shadow-2xl group order-1 md:order-2 transform md:-translate-y-2 transition-all duration-300">
              
              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#d69c4f] text-[#150e09] font-bold text-xs shadow-xs">
                  <Sparkles className="w-3 h-3" />
                  <span>{centerCake.badge || 'La Más Pedida'}</span>
                </span>
                {centerCake.isCustomizable && (
                  <span className="px-3 py-1 rounded-full bg-[#251911] border border-[#39261a] text-[#f5d49f] text-xs font-medium">
                    100% Personalizable
                  </span>
                )}
              </div>

              {/* Cake Image on Pedestal */}
              <div className="relative w-64 sm:w-72 aspect-square flex items-center justify-center mb-5 transition-transform group-hover:scale-105 duration-300">
                <img
                  key={`center-${centerCake.id}`}
                  src={centerCake.image}
                  alt={centerCake.name}
                  width={288}
                  height={288}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)] transition-opacity duration-300"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/cropped/torta_rosas.jpg';
                  }}
                />
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#faf3e8] mb-1 text-center">
                {centerCake.name}
              </h3>
              <p className="text-xs text-[#dfcca9] mb-4 text-center">
                {centerCake.portions} • <strong className="text-[#e8b66f] font-mono">S/. {centerCake.basePrice}</strong>
              </p>

              {/* Cotizar por WhatsApp CTA */}
              <a
                href={generateWhatsAppCakeQuote(centerCake.name, centerCake.portions)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#b97f33] hover:bg-[#d69c4f] text-[#150e09] font-bold text-sm shadow-md hover:shadow-lg transition-all group-hover:scale-102 mt-auto"
              >
                <span>Cotizar por WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Right Card */}
            <div className="flex flex-col items-center group order-3 transition-all duration-300">
              <div className="relative w-56 sm:w-64 aspect-square flex items-center justify-center mb-4 transition-transform group-hover:scale-105 duration-300">
                <img
                  key={`right-${rightCake.id}`}
                  src={rightCake.image}
                  alt={rightCake.name}
                  width={256}
                  height={256}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain drop-shadow-[0_15px_20px_rgba(0,0,0,0.6)] transition-opacity duration-300"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/cropped/torta_chocodrip.jpg';
                  }}
                />
              </div>

              <h3 className="font-serif text-lg font-bold text-[#faf3e8] mb-1 text-center">
                {rightCake.name}
              </h3>
              <p className="text-xs text-[#dfcca9] mb-1">
                {rightCake.portions} • <strong className="text-[#e8b66f]">S/. {rightCake.basePrice}</strong>
              </p>
              <a
                href={generateWhatsAppCakeQuote(rightCake.name, rightCake.portions)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#e8b66f] hover:text-white transition-colors"
              >
                <span>Cotizar</span>
                <span>↗</span>
              </a>
            </div>

          </div>
        </div>

        {/* Bottom Navigation & Link to Complete 100+ Models Gallery */}
        <div className="mt-14 pt-8 border-t border-[#251911] flex flex-col sm:flex-row items-center justify-between gap-6 max-w-5xl mx-auto">
          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              aria-label="Anterior"
              className="w-10 h-10 rounded-full border border-[#39261a] hover:border-[#b97f33] bg-[#1b120c] flex items-center justify-center text-[#e4d5c4] hover:text-white transition-colors cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Indicator bars */}
            <div className="flex items-center gap-1.5 px-2">
              {Array.from({ length: Math.min(4, totalSpecialties) }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === (safeIndex % Math.min(4, totalSpecialties))
                      ? 'w-6 bg-[#b97f33]'
                      : 'w-2 bg-[#39261a]'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              aria-label="Siguiente"
              className="w-10 h-10 rounded-full border border-[#39261a] hover:border-[#b97f33] bg-[#1b120c] flex items-center justify-center text-[#e4d5c4] hover:text-white transition-colors cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Direct CTA: Desliza para ver más de 100 modelos */}
          <button
            onClick={onOpenGallery}
            className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-[#e8b66f] hover:text-[#f5d49f] transition-all group"
          >
            <span>Desliza para ver más de 100 modelos</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};
