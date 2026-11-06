import React, { useState } from 'react';
import { X, Sparkles, Send, Calculator } from 'lucide-react';
import { CakeCategory, CustomCakeOrder } from '../types/bakery';
import { estimateCakePrice, generateWhatsAppOrderUrl } from '../utils/orderCalculator';

interface CustomCakeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomCakeModal: React.FC<CustomCakeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [order, setOrder] = useState<Partial<CustomCakeOrder>>({
    category: 'cumpleanos',
    portions: 25,
    spongeFlavor: 'Chocolate Intenso',
    filling1: 'Manjar blanco cajamarquino',
    filling2: 'Fudge artesanal',
    frostingType: 'Chocolate Drip con frutas',
    themeNotes: '',
    dedicationText: '',
    deliveryDate: '',
    customerName: '',
  });

  const estimatedPrice = estimateCakePrice(order.portions || 20, order.category === 'bodas' || order.category === 'tematicas');

  const spongeOptions = [
    'Chocolate Intenso (Cacao Puro)',
    'Vainilla Francesa con chispas',
    'Marmoleado Tradicional',
    'Red Velvet Terciopelo Rojo',
    'Keke Inglés Navideño / Frutas'
  ];

  const fillingOptions = [
    'Manjar blanco artesanal de Cajamarca',
    'Fudge casero de chocolate',
    'Crema Chantilly fresca con fresas',
    'Crema pastelera a la canela',
    'Mousse de maracuyá refrescante',
    'Duraznos en almíbar'
  ];

  const frostingOptions = [
    'Chocolate Drip con fresas y bombones',
    'Rosetones de crema suiza en degradé',
    'Cobertura lisa satinada con flores naturales',
    'Temática Infantil / Modelado Fondant',
    'Chantilly clásico con frutas variadas'
  ];

  const handleSendToWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const url = generateWhatsAppOrderUrl(order);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#1b120c] border border-[#d69c4f]/50 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-left shadow-2xl relative max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#251911] border border-[#39261a] hover:border-[#d69c4f] flex items-center justify-center text-[#dfcca9] hover:text-white transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#251911] border border-[#d69c4f]/40 text-xs text-[#e8b66f]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pastelería Artesanal Cajamarca</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#faf3e8]">
            Diseña tu Torta a Medida
          </h2>
          <p className="text-xs sm:text-sm text-[#dfcca9]">
            Elige cada detalle y te enviamos la cotización exacta directamente a tu WhatsApp.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSendToWhatsApp} className="space-y-5">
          
          {/* Step 1: Occasion / Category */}
          <div>
            <label className="block text-xs font-semibold text-[#f5d49f] uppercase tracking-wider mb-2">
              1. Ocasión o Categoría
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'cumpleanos', label: '🎂 Cumpleaños' },
                { id: 'infantiles', label: '🎈 Infantil' },
                { id: 'bodas', label: '💍 Boda/Evento' },
                { id: 'tematicas', label: '🎨 Especial' },
              ].map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setOrder({ ...order, category: c.id as CakeCategory })}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                    order.category === c.id
                      ? 'bg-[#b97f33] text-[#150e09] font-bold border-[#e8b66f]'
                      : 'bg-[#251911] text-[#dfcca9] border-[#39261a] hover:border-[#d69c4f]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Portions Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-[#f5d49f] uppercase tracking-wider">
                2. Tamaño y Porciones
              </label>
              <span className="font-serif font-bold text-sm text-[#e8b66f]">
                {order.portions} personas
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              step="5"
              value={order.portions}
              onChange={(e) => setOrder({ ...order, portions: Number(e.target.value) })}
              className="w-full h-2 bg-[#251911] rounded-lg appearance-none cursor-pointer accent-[#b97f33]"
            />
            <div className="flex justify-between text-[11px] text-[#a89078] mt-1">
              <span>10 porc. (Familiar)</span>
              <span>25 porc. (Mediana)</span>
              <span>60 porc. (Fiesta/Boda)</span>
            </div>
          </div>

          {/* Step 3: Flavors & Fillings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#f5d49f] uppercase tracking-wider mb-1.5">
                3. Sabor de Bizcocho
              </label>
              <select
                value={order.spongeFlavor}
                onChange={(e) => setOrder({ ...order, spongeFlavor: e.target.value })}
                className="w-full bg-[#251911] border border-[#39261a] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#faf3e8] focus:border-[#d69c4f] focus:outline-none"
              >
                {spongeOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#1b120c] text-[#faf3e8]">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#f5d49f] uppercase tracking-wider mb-1.5">
                4. Relleno Principal
              </label>
              <select
                value={order.filling1}
                onChange={(e) => setOrder({ ...order, filling1: e.target.value })}
                className="w-full bg-[#251911] border border-[#39261a] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#faf3e8] focus:border-[#d69c4f] focus:outline-none"
              >
                {fillingOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#1b120c] text-[#faf3e8]">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Step 4: Cobertura / Acabado */}
          <div>
            <label className="block text-xs font-semibold text-[#f5d49f] uppercase tracking-wider mb-1.5">
              5. Estilo de Cobertura y Decorado
            </label>
            <select
              value={order.frostingType}
              onChange={(e) => setOrder({ ...order, frostingType: e.target.value })}
              className="w-full bg-[#251911] border border-[#39261a] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#faf3e8] focus:border-[#d69c4f] focus:outline-none"
            >
              {frostingOptions.map((opt) => (
                <option key={opt} value={opt} className="bg-[#1b120c] text-[#faf3e8]">
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Dedication Text & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#f5d49f] uppercase tracking-wider mb-1.5">
                Frase / Dedicatoria en la torta
              </label>
              <input
                type="text"
                placeholder='Ej: "¡Feliz 5to Cumpleaños Mateo!"'
                value={order.dedicationText}
                onChange={(e) => setOrder({ ...order, dedicationText: e.target.value })}
                className="w-full bg-[#251911] border border-[#39261a] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#faf3e8] placeholder-[#7d6855] focus:border-[#d69c4f] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#f5d49f] uppercase tracking-wider mb-1.5">
                Fecha del Evento
              </label>
              <input
                type="date"
                value={order.deliveryDate}
                onChange={(e) => setOrder({ ...order, deliveryDate: e.target.value })}
                className="w-full bg-[#251911] border border-[#39261a] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#faf3e8] focus:border-[#d69c4f] focus:outline-none"
              />
            </div>
          </div>

          {/* Customer Name */}
          <div>
            <label className="block text-xs font-semibold text-[#f5d49f] uppercase tracking-wider mb-1.5">
              Tu Nombre (para la cotización)
            </label>
            <input
              type="text"
              placeholder="Ej: Carmen Rosas"
              value={order.customerName}
              onChange={(e) => setOrder({ ...order, customerName: e.target.value })}
              className="w-full bg-[#251911] border border-[#39261a] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#faf3e8] placeholder-[#7d6855] focus:border-[#d69c4f] focus:outline-none"
            />
          </div>

          {/* Live Price Estimate Banner */}
          <div className="p-4 rounded-2xl bg-[#251911] border border-[#d69c4f]/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1b120c] flex items-center justify-center text-[#e8b66f]">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-[#dfcca9]">Precio estimado sugerido:</p>
                <p className="font-serif text-lg font-bold text-[#faf3e8]">
                  Aprox. S/. {estimatedPrice}.00
                </p>
              </div>
            </div>
            <span className="text-[11px] text-[#b97f33] italic">
              *Confirmación final por WhatsApp
            </span>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Pedido a WhatsApp (+51 943 347 113)</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
