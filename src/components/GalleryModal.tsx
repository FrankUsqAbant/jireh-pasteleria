import React, { useState } from 'react';
import { X, Search, Sparkles, MessageCircle, ExternalLink } from 'lucide-react';
import { CakeCategory, CakeItem } from '../types/bakery';
import { CAKE_CATEGORIES, GALLERY_CAKES } from '../data/bakeryData';
import { generateWhatsAppCakeQuote } from '../utils/orderCalculator';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCake: (cake: CakeItem) => void;
  products?: CakeItem[];
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  onSelectCake,
  products = GALLERY_CAKES,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // The 4 authentic cake sheet images uploaded by the user
  const photoSheets = [
    {
      id: 'sheet-1',
      title: 'Tortas Infantiles, Rosas & Personajes',
      image: '/assets/aistudio/Captura_de_pantalla_2026-10-31_005823_b8e3cd0d.jpg',
      category: 'infantiles',
    },
    {
      id: 'sheet-2',
      title: 'Bodas, Quinceaños, Paw Patrol & Drip Cakes',
      image: '/assets/aistudio/Captura_de_pantalla_2026-10-31_005810_e5bf024c.jpg',
      category: 'bodas',
    },
    {
      id: 'sheet-3',
      title: 'Tortas con Frutas Frescas, Bautizos & Selva',
      image: '/assets/aistudio/Captura_de_pantalla_2026-10-31_005840_3d36985c.jpg',
      category: 'cumpleanos',
    },
    {
      id: 'sheet-4',
      title: 'Selva Negra Tradicional, Milhojas & Especialidades',
      image: '/assets/aistudio/Captura_de_pantalla_2026-10-31_005756_448f9d70.jpg',
      category: 'panaderia',
    },
  ];

  const filteredCakes = products.filter((cake) => {
    const matchCategory = activeTab === 'todos' || cake.category === activeTab;
    const matchSearch = cake.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        cake.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#150e09] border border-[#d69c4f]/50 rounded-3xl max-w-5xl w-full p-6 sm:p-8 text-left shadow-2xl relative max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#251911] border border-[#39261a] hover:border-[#d69c4f] flex items-center justify-center text-[#dfcca9] hover:text-white transition-colors z-10"
          aria-label="Cerrar galería"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-1 mb-6 pr-10 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#251911] border border-[#d69c4f]/40 text-xs text-[#e8b66f]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Catálogo Completo (+100 Modelos Reales)</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#faf3e8]">
            Galería de Creaciones JIRÉH
          </h2>
          <p className="text-xs sm:text-sm text-[#dfcca9]">
            Fotografías directas de tortas y pasteles elaborados en nuestro obrador de Cajamarca.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 shrink-0">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveTab('todos')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'todos'
                  ? 'bg-[#b97f33] text-[#150e09]'
                  : 'bg-[#251911] text-[#dfcca9] hover:text-white border border-[#39261a]'
              }`}
            >
              Todos los modelos
            </button>
            {CAKE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === cat.id
                    ? 'bg-[#b97f33] text-[#150e09]'
                    : 'bg-[#251911] text-[#dfcca9] hover:text-white border border-[#39261a]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-60 shrink-0">
            <Search className="w-4 h-4 text-[#a89078] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar torta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1b120c] border border-[#39261a] rounded-full pl-9 pr-4 py-1.5 text-xs text-[#faf3e8] focus:border-[#d69c4f] focus:outline-none"
            />
          </div>
        </div>

        {/* Scrollable Gallery Content */}
        <div className="overflow-y-auto space-y-8 pr-1">
          
          {/* Authentic Cake Photo Grids (Original JIRÉH creations from the bakery) */}
          <div>
            <h3 className="font-serif text-lg font-bold text-[#f5d49f] mb-3 flex items-center gap-2">
              <span>Muestrarios Reales del Taller</span>
              <span className="text-xs text-[#a89078] font-normal font-sans">
                (Elige cualquiera y cotízala por WhatsApp)
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {photoSheets.map((sheet) => (
                <div
                  key={sheet.id}
                  className="rounded-2xl overflow-hidden border border-[#39261a] bg-[#1b120c] p-3 hover:border-[#d69c4f]/60 transition-all group"
                >
                  <div className="rounded-xl overflow-hidden mb-3 aspect-[16/10] bg-[#251911]">
                    <img
                      src={sheet.image}
                      alt={sheet.title}
                      width={480}
                      height={300}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#faf3e8]">
                        {sheet.title}
                      </h4>
                      <p className="text-[11px] text-[#dfcca9]">
                        Modelos entregados en Cajamarca
                      </p>
                    </div>
                    <a
                      href={generateWhatsAppCakeQuote(sheet.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold transition-all shadow-xs"
                    >
                      <span>Cotizar foto</span>
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Cakes Detail Cards */}
          <div>
            <h3 className="font-serif text-lg font-bold text-[#f5d49f] mb-3">
              Modelos Individuales Seleccionados
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredCakes.map((cake) => (
                <div
                  key={cake.id}
                  className="p-4 rounded-2xl bg-[#1b120c] border border-[#39261a] hover:border-[#d69c4f]/60 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="rounded-xl overflow-hidden mb-3 aspect-square bg-[#251911] flex items-center justify-center p-2">
                      <img
                        src={cake.image}
                        alt={cake.name}
                        width={240}
                        height={240}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/cropped/torta_rosas.jpg';
                        }}
                      />
                    </div>
                    <h4 className="font-serif font-bold text-sm text-[#faf3e8] mb-1">
                      {cake.name}
                    </h4>
                    <p className="text-xs text-[#dfcca9] line-clamp-2 mb-2">
                      {cake.description}
                    </p>
                    <p className="text-[11px] text-[#e8b66f] font-mono">
                      {cake.portions} • Desde S/. {cake.basePrice}
                    </p>
                  </div>

                  <a
                    href={generateWhatsAppCakeQuote(cake.name, cake.portions)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#251911] hover:bg-[#b97f33] text-[#faf3e8] hover:text-[#150e09] border border-[#39261a] text-xs font-semibold transition-all"
                  >
                    <span>Pedir este diseño</span>
                    <MessageCircle className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
