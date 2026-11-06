import React, { lazy, Suspense, useEffect, useState } from 'react';
import { SiteHeader } from './components/SiteHeader';
import { Hero } from './components/Hero';
import { CakeBuilder } from './components/CakeBuilder';
import { Seam } from './components/Seam';
import { CakeCatalogSection } from './components/CakeCatalogSection';
import { OrderStepsSection } from './components/OrderStepsSection';
import { ContactLocationSection } from './components/ContactLocationSection';
import { FooterSection } from './components/FooterSection';
import { LibroReclamacionesModal } from './components/LibroReclamacionesModal';
import { LegalModal, type LegalModalType } from './components/LegalModal';
import { useCatalog } from './lib/catalog';
import { goTo } from './lib/motion';

// El panel (y la librería de Supabase Auth) solo se descarga al entrar a #admin.
const AdminApp = lazy(() => import('./admin/AdminApp').then((m) => ({ default: m.AdminApp })));

const isAdminHash = () => window.location.hash === '#admin' || window.location.hash === '#adm';

export default function App() {
  const { products } = useCatalog();
  const [view, setView] = useState<'store' | 'admin'>(() => (isAdminHash() ? 'admin' : 'store'));
  const [isLibroOpen, setIsLibroOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<LegalModalType>(null);

  useEffect(() => {
    const onHash = () => setView(isAdminHash() ? 'admin' : 'store');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigateToAdmin = () => {
    window.location.hash = 'admin';
    window.scrollTo({ top: 0 });
  };

  const navigateToStore = () => {
    history.pushState(null, '', window.location.pathname);
    setView('store');
    window.scrollTo({ top: 0 });
  };

  if (view === 'admin') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#0e0805]" />}>
        <AdminApp onBackToStore={navigateToStore} />
      </Suspense>
    );
  }

  return (
    <>
      <a href="#contenido" className="skip-link">Saltar al contenido</a>
      <SiteHeader />

      <main id="contenido">
        <Hero />
        <Seam top="var(--ganache)" band="var(--manjar)" bottom="var(--manjar)" seed={3} />
        <CakeBuilder />

        <CakeCatalogSection products={products} onOpenGallery={() => goTo('vitrina')} onSelectCake={() => goTo('arma')} />
        <OrderStepsSection onOpenCustomOrder={() => goTo('arma')} />
        <ContactLocationSection />
      </main>

      <FooterSection
        onOpenLibroReclamaciones={() => setIsLibroOpen(true)}
        onOpenLegalModal={(type) => setLegalModalType(type)}
        onOpenAdminModal={navigateToAdmin}
      />

      <LibroReclamacionesModal isOpen={isLibroOpen} onClose={() => setIsLibroOpen(false)} />
      <LegalModal type={legalModalType} onClose={() => setLegalModalType(null)} />
    </>
  );
}
