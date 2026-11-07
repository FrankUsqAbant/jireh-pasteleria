import React, { lazy, Suspense, useEffect, useState } from 'react';
import { SiteHeader } from './components/SiteHeader';
import { Hero } from './components/Hero';
import { CakeBuilder } from './components/CakeBuilder';
import { Seam } from './components/Seam';
import { Vitrina } from './components/Vitrina';
import { HowToOrder } from './components/HowToOrder';
import { Visit } from './components/Visit';
import { SiteFooter } from './components/SiteFooter';
import type { LegalModalType } from './components/LegalModal';
import { useCatalog } from './lib/catalog';

// El panel (y la librería de Supabase Auth) solo se descarga al entrar a #admin.
const AdminApp = lazy(() => import('./admin/AdminApp').then((m) => ({ default: m.AdminApp })));
// Los modales legales también se descargan recién al abrirlos.
const LibroReclamacionesModal = lazy(() => import('./components/LibroReclamacionesModal').then((m) => ({ default: m.LibroReclamacionesModal })));
const LegalModal = lazy(() => import('./components/LegalModal').then((m) => ({ default: m.LegalModal })));

export const isAdminHash = () =>
  typeof window !== 'undefined' && (window.location.hash === '#admin' || window.location.hash === '#adm');

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
        <Seam top="var(--ganache)" band="var(--manjar)" bottom="var(--bizcocho)" seed={3} />
        <Vitrina products={products} />
        <Seam top="var(--bizcocho)" band="var(--ganache)" bottom="var(--manjar)" seed={7} />
        <CakeBuilder />
        <Seam top="var(--manjar)" band="#fbf3e6" bottom="var(--bizcocho)" seed={11} />
        <HowToOrder />
        <Seam top="var(--bizcocho)" band="var(--manjar)" bottom="var(--bizcocho-claro)" seed={17} />
        <Visit />
      </main>

      <SiteFooter
        onOpenLibro={() => setIsLibroOpen(true)}
        onOpenLegal={(type) => setLegalModalType(type)}
        onOpenAdmin={navigateToAdmin}
      />

      <Suspense fallback={null}>
        {isLibroOpen && <LibroReclamacionesModal isOpen onClose={() => setIsLibroOpen(false)} />}
        {legalModalType && <LegalModal type={legalModalType} onClose={() => setLegalModalType(null)} />}
      </Suspense>
    </>
  );
}
