export type CakeCategory = 
  | 'cumpleanos'
  | 'infantiles'
  | 'bodas'
  | 'tematicas'
  | 'panaderia';

export interface CakeItem {
  id: string;
  name: string;
  category: CakeCategory;
  description: string;
  portions: string;
  basePrice: number;
  image: string;
  badge?: string;
  isPopular?: boolean;
  isCustomizable?: boolean;
  flavors?: string[];
  fillings?: string[];
}

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface CustomCakeOrder {
  category: CakeCategory;
  portions: number;
  spongeFlavor: string;
  filling1: string;
  filling2: string;
  frostingType: string;
  themeNotes: string;
  dedicationText: string;
  deliveryDate: string;
  customerName: string;
  customerPhone: string;
}

export interface LibroReclamacionEntry {
  id: string;
  fullName: string;
  documentType: 'DNI' | 'CE' | 'Pasaporte';
  documentNumber: string;
  phone: string;
  email: string;
  address: string;
  serviceType: 'Producto' | 'Servicio';
  claimedAmount: string;
  claimType: 'Reclamo' | 'Queja';
  details: string;
  consumerRequest: string;
  createdAt: string;
}
