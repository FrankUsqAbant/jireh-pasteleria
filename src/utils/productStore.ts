import { CakeItem } from '../types/bakery';
import { FEATURED_SPECIALTIES, GALLERY_CAKES } from '../data/bakeryData';

const STORAGE_KEY = 'jireh_products_catalog_v1';
const ADMIN_PIN_KEY = 'jireh_admin_pin';
export const DEFAULT_ADMIN_PIN = '1234';

// Available preset authentic bakery images for quick product assignment
export const PRESET_PRODUCT_IMAGES = [
  { label: 'Torta de Chocolate Drip', url: '/assets/cropped/torta_chocodrip.jpg' },
  { label: 'Torta Rosas de Ensueño', url: '/assets/cropped/torta_rosas.jpg' },
  { label: 'Torta Temática Infantil', url: '/assets/cropped/torta_infantil.jpg' },
  { label: 'Chocolatísima Fresas (Transparente)', url: '/assets/seamless/torta_chocolatisima.png' },
  { label: 'Rosas Ensueño (Transparente)', url: '/assets/seamless/torta_rosas.png' },
  { label: 'Selva Negra (Transparente)', url: '/assets/seamless/torta_selva_negra.png' },
  { label: 'Torta Spider-Man / Infantil', url: '/assets/aistudio/Captura_de_pantalla_2026-10-31_005823_b8e3cd0d.jpg' },
  { label: 'Torta de Bodas Clásica', url: '/assets/aistudio/Captura_de_pantalla_2026-10-31_005810_e5bf024c.jpg' },
  { label: 'Torta Bautizo / Drip Azul', url: '/assets/aistudio/Captura_de_pantalla_2026-10-31_005840_3d36985c.jpg' },
  { label: 'Milhojas Crocante Tradicional', url: '/assets/aistudio/Captura_de_pantalla_2026-10-31_005756_448f9d70.jpg' },
];

export function getInitialCatalog(): CakeItem[] {
  // Combine featured specialties and gallery items uniquely
  const map = new Map<string, CakeItem>();
  
  FEATURED_SPECIALTIES.forEach((item) => {
    map.set(item.id, { ...item });
  });

  GALLERY_CAKES.forEach((item) => {
    if (!map.has(item.id)) {
      map.set(item.id, { ...item });
    }
  });

  return Array.from(map.values());
}

export function loadStoredProducts(): CakeItem[] {
  if (typeof window === 'undefined') {
    return getInitialCatalog();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialCatalog();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return getInitialCatalog();
  } catch (err) {
    console.error('Error reading products from localStorage:', err);
    return getInitialCatalog();
  }
}

export function saveStoredProducts(products: CakeItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (err) {
    console.error('Error saving products to localStorage:', err);
  }
}

export function resetStoredProducts(): CakeItem[] {
  const initial = getInitialCatalog();
  saveStoredProducts(initial);
  return initial;
}

export function getAdminPin(): string {
  if (typeof window === 'undefined') return DEFAULT_ADMIN_PIN;
  return localStorage.getItem(ADMIN_PIN_KEY) || DEFAULT_ADMIN_PIN;
}

export function setAdminPin(newPin: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADMIN_PIN_KEY, newPin);
}
