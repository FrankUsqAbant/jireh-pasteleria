import React, { useState } from 'react';
import { ArrowUpRight, Award, Heart, Sparkles, ChefHat } from 'lucide-react';
import { STORY_IMAGE_URL } from '../data/bakeryData';

interface StorySectionProps {
  onLearnMore?: () => void;
}

export const StorySection: React.FC<StorySectionProps> = ({ onLearnMore }) => {
  const [showFullHistoryModal, setShowFullHistoryModal] = useState(false);

  return (
    <section id="historia" className="relative py-20 bg-[#120c08] border-t border-[#251911] overflow-hidden">
      {/* Background glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-[#d69c4f]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Story Prose and Cards */}
          <div className="lg:col-span-6 space-y-8 text-left">
            {/* Section Lead */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#b97f33] tracking-widest uppercase">
              <span className="w-8 h-px bg-[#b97f33]" />
              <span>02. NUESTRA HISTORIA & ESENCIA</span>
            </div>

            {/* Title */}
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#faf3e8] tracking-tight leading-tight text-balance">
              Tradición y sabor que unen a Cajamarca
            </h2>

            {/* Paragraph */}
            <p className="text-base sm:text-lg text-[#dfcca9] leading-relaxed">
              Desde 2007, en JIRÉH hemos sido parte de tus momentos más felices. Nacimos con el sueño de llevar a cada hogar el verdadero sabor de la pastelería artesanal, utilizando ingredientes locales de Cajamarca y recetas que guardan el cariño de lo hecho en casa.
            </p>

            {/* 2 Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Card 1: Amor por el Detalle */}
              <div className="p-6 rounded-2xl bg-[#1b120c] border border-[#39261a] hover:border-[#b97f33]/60 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-[#251911] flex items-center justify-center text-[#e8b66f] mb-4 group-hover:scale-110 transition-transform">
                  <ChefHat className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#faf3e8] mb-2">
                  Amor por el Detalle
                </h3>
                <p className="text-sm text-[#dfcca9] leading-relaxed">
                  Cada torta y pan se elabora y decora a mano por nuestros maestros pasteleros.
                </p>
              </div>

              {/* Card 2: Calidad de Nuestra Tierra */}
              <div className="p-6 rounded-2xl bg-[#1b120c] border border-[#39261a] hover:border-[#b97f33]/60 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-[#251911] flex items-center justify-center text-[#e8b66f] mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#faf3e8] mb-2">
                  Calidad de Nuestra Tierra
                </h3>
                <p className="text-sm text-[#dfcca9] leading-relaxed">
                  Seleccionamos la mejor materia prima para garantizar un sabor inigualable y natural.
                </p>
              </div>
            </div>

            {/* CTA: Conocer más sobre nosotros */}
            <div className="pt-2">
              <button
                onClick={() => setShowFullHistoryModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#d69c4f]/50 bg-[#1b120c] hover:bg-[#251911] text-[#faf3e8] hover:border-[#d69c4f] font-medium text-sm sm:text-base transition-all group"
              >
                <span>Conocer más sobre nosotros</span>
                <ArrowUpRight className="w-4 h-4 text-[#e8b66f] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: Artisan Bakery Composition Image */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="relative w-full max-w-lg aspect-[4/3] overflow-hidden rounded-3xl border border-[#39261a] shadow-2xl bg-[#1b120c] group">
              <img
                src={STORY_IMAGE_URL}
                alt="Historia y Tradición JIRÉH Panadería y Pastelería en Cajamarca"
                width={640}
                height={480}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-500 ease-out will-change-transform"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

        </div>
      </div>

      {/* History Detail Modal */}
      {showFullHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1b120c] border border-[#d69c4f]/50 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 text-left shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowFullHistoryModal(false)}
              className="absolute top-6 right-6 text-[#dfcca9] hover:text-white text-xl"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#b97f33] tracking-widest uppercase">
              <span>FUNDADA EN 2007 EN CAJAMARCA, PERÚ</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#faf3e8]">
              Nuestra Esencia & Compromiso Cajamarquino
            </h3>

            <div className="space-y-4 text-sm sm:text-base text-[#dfcca9] leading-relaxed">
              <p>
                JIRÉH Panadería y Pastelería abrió sus puertas por primera vez en la tradicional Av. San Martín de Porres con un horno a vapor y una premisa clara: <strong className="text-[#faf3e8]">la auténtica pastelería se hace con paciencia, manos expertas y los mejores lácteos de la campiña de Cajamarca.</strong>
              </p>
              <p>
                A lo largo de más de 15 años ininterrumpidos, hemos acompañado cumpleaños infantiles, bodas inolvidables, aniversarios y reuniones familiares con bizcochuelos esponjosos, manjar blanco puro batido en paila y decoraciones artísticas hechas a medida.
              </p>
              <div className="p-4 rounded-xl bg-[#251911] border border-[#39261a]">
                <h4 className="font-serif font-bold text-[#faf3e8] mb-1">Nuestros Valores Fundamentales:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-[#e4d5c4]">
                  <li><strong className="text-[#e8b66f]">Ingredientes 100% frescos:</strong> Leche entera fresca, huevos de corral y fruta seleccionada.</li>
                  <li><strong className="text-[#e8b66f]">Puntualidad garantizada:</strong> Tu torta lista en la hora convenida para tu celebración.</li>
                  <li><strong className="text-[#e8b66f]">Atención cercana:</strong> Coordinación directa por WhatsApp con fotos y cotización al instante.</li>
                </ul>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setShowFullHistoryModal(false)}
                className="px-6 py-2.5 rounded-full bg-[#b97f33] hover:bg-[#d69c4f] text-[#150e09] font-semibold text-sm transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
