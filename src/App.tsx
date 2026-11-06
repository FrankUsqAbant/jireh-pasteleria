import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StorySection } from './components/StorySection';
import { CakeCatalogSection } from './components/CakeCatalogSection';
import { OrderStepsSection } from './components/OrderStepsSection';
import { ContactLocationSection } from './components/ContactLocationSection';
import { FooterSection } from './components/FooterSection';
import { CustomCakeModal } from './components/CustomCakeModal';
import { GalleryModal } from './components/GalleryModal';
import { LibroReclamacionesModal } from './components/LibroReclamacionesModal';
import { LegalModal, LegalModalType } from './components/LegalModal';
import { CakeItem } from './types/bakery';
import { useCatalog } from './lib/catalog';

// El panel (y la librería de Supabase Auth) solo se descarga al entrar a #admin.
const AdminApp = lazy(() => import('./admin/AdminApp').then((m) => ({ default: m.AdminApp })));

export default function App() {
  const { products } = useCatalog();
  const [currentView, setCurrentView] = useState<'store' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash === '#admin' || window.location.hash === '#adm' ? 'admin' : 'store';
    }
    return 'store';
  });

  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isLibroOpen, setIsLibroOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<LegalModalType>(null);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin' || window.location.hash === '#adm') {
        setCurrentView('admin');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (currentView === 'admin' && window.location.hash !== '#admin' && window.location.hash !== '#adm') {
        setCurrentView('store');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentView]);

  const navigateToAdmin = () => {
    window.location.hash = 'admin';
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToStore = () => {
    window.location.hash = '';
    setCurrentView('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreCatalog = () => {
    const el = document.getElementById('tortas');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCake = (cake: CakeItem) => {
    setIsCustomModalOpen(true);
  };

  // Dedicated Full-Page Admin View
  if (currentView === 'admin') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#0e0805]" />}>
        <AdminApp onBackToStore={navigateToStore} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-[#120c08] text-[#faf3e8] selection:bg-[#d69c4f] selection:text-[#150e09] flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <Navbar onOpenCustomModal={() => setIsCustomModalOpen(true)} />

      {/* Main Content Modules */}
      <main className="flex-1">
        {/* Module 01: Hero Section */}
        <HeroSection
          onExploreCatalog={handleExploreCatalog}
          onOpenCustomModal={() => setIsCustomModalOpen(true)}
        />

        {/* Module 02: Story & Essence */}
        <StorySection
          onLearnMore={() => {
            const el = document.getElementById('tortas');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Module 03: Cakes & Specialties Catalog */}
        <CakeCatalogSection
          products={products}
          onOpenGallery={() => setIsGalleryOpen(true)}
          onSelectCake={handleSelectCake}
        />

        {/* Module 04: Order Steps & Google Reviews */}
        <OrderStepsSection
          onOpenCustomOrder={() => setIsCustomModalOpen(true)}
        />

        {/* Module 05: Location, Live Hours & Map */}
        <ContactLocationSection />
      </main>

      {/* Module 06: Peruvian Extended Footer */}
      <FooterSection
        onOpenLibroReclamaciones={() => setIsLibroOpen(true)}
        onOpenLegalModal={(type) => setLegalModalType(type)}
        onOpenAdminModal={navigateToAdmin}
      />

      {/* Modals */}
      <CustomCakeModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
      />

      <GalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelectCake={handleSelectCake}
        products={products}
      />

      <LibroReclamacionesModal
        isOpen={isLibroOpen}
        onClose={() => setIsLibroOpen(false)}
      />

      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
}
