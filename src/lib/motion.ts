/** Utilidades de movimiento y navegación del sitio. */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Lleva a una sección con el desplazamiento nativo (sin secuestrar el scroll). */
export function goTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  // Llevar el foco a la sección para teclado y lectores de pantalla
  el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}
