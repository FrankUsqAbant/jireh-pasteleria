import React from 'react';
import { BookOpen, UtensilsCrossed, Gift, ArrowUpRight, Star } from 'lucide-react';
import { GOOGLE_REVIEWS } from '../data/bakeryData';
import { STORE_PHONE } from '../utils/orderCalculator';

interface OrderStepsSectionProps {
  onOpenCustomOrder: () => void;
}

export const OrderStepsSection: React.FC<OrderStepsSectionProps> = ({ onOpenCustomOrder }) => {
  const steps = [
    {
      number: '01',
      title: 'Inspírate y Elige',
      desc: 'Explora nuestro catálogo en línea o envíanos la foto de referencia de la torta que imaginas para tu evento.',
      icon: <BookOpen className="w-6 h-6 text-[#d69c4f]" />,
    },
    {
      number: '02',
      title: 'Personaliza sabor y tamaño',
      desc: 'Elige el tamaño de porciones, el sabor de bizcocho y tus rellenos favoritos (fudge, manjar, frutas).',
      icon: <UtensilsCrossed className="w-6 h-6 text-[#d69c4f]" />,
    },
    {
      number: '03',
      title: 'Horneado fresco y entrega puntual',
      desc: 'Elaboramos tu torta con ingredientes frescos de Cajamarca para que la recojas en nuestro local o la recibas directo en tu celebración.',
      icon: <Gift className="w-6 h-6 text-[#d69c4f]" />,
    },
  ];

  return (
    <section id="proceso" className="relative py-20 bg-[#120c08] border-t border-[#251911] overflow-hidden">
      {/* Background glow */}
      <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-96 h-96 bg-[#d69c4f]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Lead */}
        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#b97f33] tracking-widest uppercase mb-3">
          <span className="w-8 h-px bg-[#b97f33]" />
          <span>04. TU PEDIDO & EXPERIENCIA</span>
        </div>

        {/* Title & Subtitle */}
        <div className="max-w-3xl mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#faf3e8] tracking-tight leading-tight text-balance mb-4">
            Tu torta soñada en 3 simples pasos
          </h2>
          <p className="text-base sm:text-lg text-[#dfcca9] font-normal leading-relaxed">
            Hacer tu pedido es rápido y transparente. Cuidamos cada detalle desde el primer boceto hasta la primera rebanada.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          
          {/* Left Column: 3 Order Steps */}
          <div className="lg:col-span-7 space-y-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex items-center gap-6 p-6 rounded-2xl bg-[#1b120c] border border-[#39261a] hover:border-[#b97f33]/60 transition-all group"
              >
                {/* Step Number Badge */}
                <div className="w-14 h-14 rounded-full bg-[#b97f33] flex items-center justify-center text-[#150e09] font-serif font-bold text-xl shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  {step.number}
                </div>

                {/* Step Content */}
                <div className="flex-1 text-left">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#faf3e8] mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#dfcca9] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Subtle Right Icon */}
                <div className="hidden sm:flex w-12 h-12 rounded-xl bg-[#251911] items-center justify-center shrink-0 border border-[#39261a]">
                  {step.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Google Reviews Card & Diverse Testimonials */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Top Google Rating Header Card */}
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-[#fdfaf5] text-[#150e09] shadow-xl">
              {/* Google G Logo */}
              <div className="w-11 h-11 rounded-full bg-white shadow-xs border border-gray-100 flex items-center justify-center shrink-0 font-bold text-xl">
                <span className="text-[#4285F4]">G</span>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-gray-900 leading-none">Excelente 4.4</span>
                  <div className="flex text-[#F4B400] text-sm">
                    {'★★★★★'}
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  30 opiniones verificadas en Google • Cajamarca, Perú
                </p>
              </div>
            </div>

            {/* Testimonials List */}
            {GOOGLE_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-[#faf3e8] text-[#150e09] shadow-md text-left transition-transform duration-200 hover:-translate-y-0.5"
              >
                <p className="text-xs sm:text-sm font-medium text-gray-800 leading-relaxed mb-3">
                  &ldquo;{rev.comment}&rdquo;
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-amber-900/10">
                  <span className="font-semibold text-xs sm:text-sm text-gray-900">
                    — {rev.author}
                  </span>
                  <div className="flex items-center gap-1">
                    <div className="flex text-[#F4B400] text-xs">
                      {'★'.repeat(rev.rating)}
                    </div>
                    <span className="text-[10px] text-gray-500 ml-1">{rev.date}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Iniciar mi pedido por WhatsApp CTA Button */}
            <div className="pt-2">
              <button
                onClick={onOpenCustomOrder}
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#b97f33] hover:bg-[#d69c4f] text-[#150e09] font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all"
              >
                <span>Iniciar mi pedido por WhatsApp</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
