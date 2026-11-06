import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, RotateCw } from 'lucide-react';
import { HERO_FEATURED_CAKES } from '../data/bakeryData';
import { ThreeCakeViewer } from './ThreeCakeViewer';

interface HeroSectionProps {
  onExploreCatalog: () => void;
  onOpenCustomModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreCatalog,
  onOpenCustomModal,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [show3D, setShow3D] = useState(false);

  // Preload all hero cake showcase images for silky smooth transitions
  useEffect(() => {
    HERO_FEATURED_CAKES.forEach((cake) => {
      const img = new Image();
      img.src = cake.image;
    });
  }, []);

  const currentCake = HERO_FEATURED_CAKES[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_FEATURED_CAKES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + HERO_FEATURED_CAKES.length) % HERO_FEATURED_CAKES.length);
  };

  return (
    <section id="inicio" className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-[#150e09] pt-24 pb-14 sm:py-16 lg:py-20">
      {/* Warm Ambient Gradients and Petal Confetti Bokeh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d69c4f]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-[32rem] h-[32rem] bg-[#b97f33]/12 rounded-full blur-[100px]" />
        
        {/* Subtle Decorative Floating Particles */}
        <div className="absolute top-16 left-12 w-2 h-2 rounded-full bg-[#e8b66f]/30 blur-[1px] animate-pulse" />
        <div className="absolute top-1/2 left-1/3 w-3 h-3 rounded-full bg-[#f5d49f]/20 blur-[1px]" />
        <div className="absolute top-24 right-1/4 w-2.5 h-2.5 rounded-full bg-[#e8b66f]/25 blur-[1px]" />
        <div className="absolute bottom-20 right-12 w-2 h-2 rounded-full bg-[#e8b66f]/30 blur-[1px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Text Content */}
          <div className="lg:col-span-6 space-y-6 lg:space-y-8 text-left z-10">

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#faf3e8] tracking-tight leading-[1.12] text-balance">
              El sabor que celebra tus <span className="text-[#e8b66f]">momentos especiales</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#dfcca9] max-w-xl font-normal leading-relaxed">
              Tortas y pastelería artesanal de alta calidad, creadas con dedicación para hacer único cada recuerdo.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreCatalog}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#b97f33] hover:bg-[#d69c4f] text-[#150e09] font-semibold text-sm sm:text-base transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>Explorar Catálogo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenCustomModal}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#d69c4f]/60 bg-[#1b120c] hover:bg-[#251911] text-[#faf3e8] hover:border-[#d69c4f] font-semibold text-sm sm:text-base transition-all shadow-xs hover:shadow-md cursor-pointer"
              >
                <span>Pedir a medida</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Cake Showcase on Luxury Pedestal */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
            
            {/* Arrow Nav: Prev */}
            <button
              onClick={handlePrev}
              aria-label="Torta anterior"
              className="absolute left-0 sm:left-4 z-20 w-11 h-11 rounded-full border border-[#d69c4f]/40 bg-[#1b120c]/80 hover:bg-[#251911] hover:border-[#d69c4f] flex items-center justify-center text-[#faf3e8] transition-all shadow-md group cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>

            {/* Arrow Nav: Next */}
            <div className="absolute right-0 sm:right-4 z-20 flex flex-col items-center gap-1">
              <button
                onClick={handleNext}
                aria-label="Siguiente torta"
                className="w-11 h-11 rounded-full border border-[#d69c4f]/40 bg-[#1b120c]/80 hover:bg-[#251911] hover:border-[#d69c4f] flex items-center justify-center text-[#faf3e8] transition-all shadow-md group cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <span className="text-[11px] text-[#b97f33] font-medium tracking-wider">deslizar</span>
            </div>

            {/* Central Pedestal & Cake Display */}
            <div className="relative w-full max-w-[460px] sm:max-w-[500px] aspect-square flex flex-col items-center justify-center">
              
              {show3D ? (
                /* Interactive Three.js 3D View */
                <div className="w-full h-full flex items-center justify-center animate-in fade-in zoom-in-95 duration-300">
                  <ThreeCakeViewer
                    cakeType={currentIndex === 1 ? 'roses' : currentIndex === 2 ? 'selva' : 'chocolate'}
                    onClose={() => setShow3D(false)}
                  />
                </div>
              ) : (
                /* Static High-Fidelity Cake Display with Seamless Page Integration */
                <div className="relative w-full h-full flex flex-col items-center justify-center group">
                  
                  {/* Warm Radiant Backlight Aura (Matches dark bakery ambiance) */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-radial from-[#d69c4f]/25 via-[#b97f33]/8 to-transparent blur-3xl pointer-events-none -z-0 scale-95" />

                  {/* Soft Ground Contact Shadow (Natural physical grounding on the floor) */}
                  <div className="absolute bottom-8 sm:bottom-10 w-[78%] h-9 bg-black/75 rounded-[100%] blur-xl pointer-events-none -z-0" />

                  {/* Seamless Background Blending Halo */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[400px] sm:h-[400px] rounded-full bg-[radial-gradient(circle,_#2a160c_0%,_#1c1008_50%,_transparent_80%)] -z-0 pointer-events-none" />

                  {/* Seamless Floating Cake (No rectangular card, no background box) */}
                  <div
                    className="relative z-10 w-[84%] sm:w-[88%] aspect-square transition-transform duration-500 ease-out hover:scale-[1.03] flex items-center justify-center will-change-transform"
                    style={{
                      WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 55%, rgba(0,0,0,0.8) 72%, transparent 92%)',
                      maskImage: 'radial-gradient(circle at 50% 50%, black 55%, rgba(0,0,0,0.8) 72%, transparent 92%)'
                    }}
                  >
                    <img
                      key={currentCake.id}
                      src={currentCake.image}
                      alt={currentCake.name}
                      width={460}
                      height={460}
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                      className="w-full h-full object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.85)] filter contrast-[1.04] select-none transition-opacity duration-300"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/cropped/torta_rosas.jpg';
                      }}
                    />
                  </div>

                  {/* 360 View Toggle Button over the Pedestal */}
                  <div className="absolute bottom-3 sm:bottom-5 z-20">
                    <button
                      onClick={() => setShow3D(true)}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#f7eee1] hover:bg-white text-[#150e09] font-semibold text-xs sm:text-sm shadow-[0_12px_28px_rgba(0,0,0,0.65)] hover:shadow-[0_15px_35px_rgba(214,156,79,0.35)] transition-all border border-[#b97f33]/50 group/btn cursor-pointer hover:scale-105 active:scale-95"
                      title="Explorar modelo 3D con rotación 360°"
                    >
                      <RotateCw className="w-4 h-4 text-[#b97f33] group-hover/btn:rotate-180 transition-transform duration-700" />
                      <span className="tracking-wide">Rotación 360°</span>
                      <span className="text-xs text-[#6e4624]">↺</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Caption & Pagination Dots */}
            <div className="mt-4 flex items-center justify-between w-full max-w-xs px-2">
              <span className="font-serif text-sm sm:text-base font-semibold text-[#faf3e8]">
                {currentCake.number}. {currentCake.name}
              </span>

              {/* Dots */}
              <div className="flex items-center gap-2">
                {HERO_FEATURED_CAKES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Ir a torta ${idx + 1}`}
                    className={`transition-all ${
                      idx === currentIndex
                        ? 'w-2.5 h-2.5 rounded-full bg-[#e8b66f]'
                        : 'w-2 h-2 rounded-full border border-[#d69c4f]/50 hover:bg-[#d69c4f]/40'
                    }`}
                  />
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
