import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Plus, Edit3, Trash2, Shield, Lock, Unlock, KeyRound, 
  RotateCcw, Search, Sparkles, Star, Check, AlertCircle, Image as ImageIcon,
  DollarSign, Layers, Tag, Eye, LayoutGrid, List, Download, Upload,
  CheckCircle2, ArrowUpDown, ChevronRight, Store, RefreshCw
} from 'lucide-react';
import { CakeCategory, CakeItem } from '../types/bakery';
import { CAKE_CATEGORIES, LOGO_URL } from '../data/bakeryData';
import { 
  PRESET_PRODUCT_IMAGES, 
  getAdminPin, 
  setAdminPin as persistAdminPin, 
  DEFAULT_ADMIN_PIN 
} from '../utils/productStore';

interface AdminProductsPageProps {
  onBackToStore: () => void;
  products: CakeItem[];
  onSaveProducts: (products: CakeItem[]) => void;
  onResetProducts: () => void;
}

export const AdminProductsPage: React.FC<AdminProductsPageProps> = ({
  onBackToStore,
  products,
  onSaveProducts,
  onResetProducts,
}) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('jireh_admin_auth') === 'true';
    }
    return false;
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Active view tab
  const [activeTab, setActiveTab] = useState<'catalog' | 'new_product' | 'settings'>('catalog');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Search, Filter and Sort
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<'name' | 'price_asc' | 'price_desc' | 'popular'>('popular');

  // Edit / Form state
  const [editingProduct, setEditingProduct] = useState<CakeItem | null>(null);
  const [productToDelete, setProductToDelete] = useState<CakeItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<CakeCategory>('cumpleanos');
  const [formDescription, setFormDescription] = useState('');
  const [formPortions, setFormPortions] = useState('20-25 porciones');
  const [formPrice, setFormPrice] = useState<number>(85);
  const [formImage, setFormImage] = useState(PRESET_PRODUCT_IMAGES[0].url);
  const [formBadge, setFormBadge] = useState('');
  const [formIsPopular, setFormIsPopular] = useState(false);
  const [formIsCustomizable, setFormIsCustomizable] = useState(true);
  const [formFlavors, setFormFlavors] = useState('Vainilla, Chocolate, Marmoleado');
  const [formFillings, setFormFillings] = useState('Fudge casero, Manjar blanco cajamarquino');

  // Settings State
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinSuccessMsg, setPinSuccessMsg] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auth handler
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPin = getAdminPin();
    if (pinInput.trim() === storedPin) {
      setIsAuthenticated(true);
      setPinError(false);
      setPinInput('');
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('jireh_admin_auth', 'true');
      }
      showToast('¡Bienvenido al Panel de Administración JIRÉH!');
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('jireh_admin_auth');
    }
  };

  // Form reset / open
  const startNewProduct = () => {
    setFormName('');
    setFormCategory('cumpleanos');
    setFormDescription('');
    setFormPortions('20-25 porciones');
    setFormPrice(85);
    setFormImage(PRESET_PRODUCT_IMAGES[0].url);
    setFormBadge('');
    setFormIsPopular(false);
    setFormIsCustomizable(true);
    setFormFlavors('Vainilla, Chocolate, Marmoleado');
    setFormFillings('Fudge casero, Manjar blanco cajamarquino');
    setEditingProduct(null);
    setActiveTab('new_product');
  };

  const startEditProduct = (item: CakeItem) => {
    setFormName(item.name);
    setFormCategory(item.category);
    setFormDescription(item.description);
    setFormPortions(item.portions);
    setFormPrice(item.basePrice);
    setFormImage(item.image);
    setFormBadge(item.badge || '');
    setFormIsPopular(Boolean(item.isPopular));
    setFormIsCustomizable(Boolean(item.isCustomizable));
    setFormFlavors(item.flavors ? item.flavors.join(', ') : 'Vainilla, Chocolate, Marmoleado');
    setFormFillings(item.fillings ? item.fillings.join(', ') : 'Fudge casero, Manjar blanco cajamarquino');
    setEditingProduct(item);
    setActiveTab('new_product');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || formPrice <= 0) return;

    const flavorsArray = formFlavors.split(',').map((s) => s.trim()).filter(Boolean);
    const fillingsArray = formFillings.split(',').map((s) => s.trim()).filter(Boolean);

    if (editingProduct) {
      const updated: CakeItem = {
        ...editingProduct,
        name: formName.trim(),
        category: formCategory,
        description: formDescription.trim(),
        portions: formPortions.trim(),
        basePrice: Number(formPrice),
        image: formImage.trim() || editingProduct.image,
        badge: formBadge.trim() || undefined,
        isPopular: formIsPopular,
        isCustomizable: formIsCustomizable,
        flavors: flavorsArray.length > 0 ? flavorsArray : undefined,
        fillings: fillingsArray.length > 0 ? fillingsArray : undefined,
      };
      const newList = products.map((p) => (p.id === updated.id ? updated : p));
      onSaveProducts(newList);
      showToast(`¡Torta "${updated.name}" actualizada con éxito!`);
    } else {
      const newProduct: CakeItem = {
        id: `prod-${Date.now()}`,
        name: formName.trim(),
        category: formCategory,
        description: formDescription.trim() || 'Elaborada artesanalmente con ingredientes seleccionados de Cajamarca.',
        portions: formPortions.trim() || '20-25 porciones',
        basePrice: Number(formPrice),
        image: formImage.trim() || PRESET_PRODUCT_IMAGES[0].url,
        badge: formBadge.trim() || undefined,
        isPopular: formIsPopular,
        isCustomizable: formIsCustomizable,
        flavors: flavorsArray.length > 0 ? flavorsArray : undefined,
        fillings: fillingsArray.length > 0 ? fillingsArray : undefined,
      };
      onSaveProducts([newProduct, ...products]);
      showToast(`¡Torta "${newProduct.name}" agregada con éxito!`);
    }

    setEditingProduct(null);
    setActiveTab('catalog');
  };

  const handleTogglePopular = (item: CakeItem) => {
    const updated = products.map((p) => {
      if (p.id === item.id) {
        return { ...p, isPopular: !p.isPopular };
      }
      return p;
    });
    onSaveProducts(updated);
    showToast(`Estado de destacada en portada actualizado para "${item.name}"`);
  };

  const handleDeleteProduct = () => {
    if (!productToDelete) return;
    const updated = products.filter((p) => p.id !== productToDelete.id);
    onSaveProducts(updated);
    showToast(`Producto "${productToDelete.name}" eliminado del catálogo.`);
    setProductToDelete(null);
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length >= 4 && newPin === confirmPin) {
      persistAdminPin(newPin);
      setNewPin('');
      setConfirmPin('');
      setPinSuccessMsg(true);
      setTimeout(() => setPinSuccessMsg(false), 3000);
      showToast('PIN de acceso actualizado correctamente.');
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `catalogo_jireh_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Copia de seguridad descargada.');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0) {
          onSaveProducts(parsed);
          showToast(`Se importaron ${parsed.length} productos correctamente.`);
        } else {
          alert('El archivo no contiene un catálogo válido de productos.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  // Filter & Sort
  const filteredProducts = products.filter((p) => {
    const matchCat = categoryFilter === 'todos' || p.category === categoryFilter;
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.portions.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'popular') {
      if (a.isPopular && !b.isPopular) return -1;
      if (!a.isPopular && b.isPopular) return 1;
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'price_asc') return a.basePrice - b.basePrice;
    if (sortBy === 'price_desc') return b.basePrice - a.basePrice;
    return a.name.localeCompare(b.name);
  });

  // KPI Calculations
  const totalProducts = products.length;
  const featuredCount = products.filter((p) => p.isPopular).length;
  const avgPrice = totalProducts > 0 
    ? Math.round(products.reduce((acc, p) => acc + p.basePrice, 0) / totalProducts)
    : 0;

  // =========================================================================
  // VIEW 1: FULL PAGE AUTHENTICATION GATE
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0e0805] text-[#faf3e8] flex flex-col items-center justify-center p-4 selection:bg-[#d69c4f] selection:text-[#150e09]">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-[#d69c4f]/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Back link */}
        <div className="mb-6 z-10">
          <button
            onClick={onBackToStore}
            className="inline-flex items-center gap-2 text-xs text-[#dfcca9] hover:text-[#faf3e8] bg-[#1a110a] hover:bg-[#28180e] border border-[#3d2719] px-4 py-2 rounded-full transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#e8b66f]" />
            <span>Volver a la Tienda Web</span>
          </button>
        </div>

        {/* Auth Box */}
        <div className="max-w-md w-full bg-[#150e09] border border-[#d69c4f]/40 rounded-3xl p-8 sm:p-10 text-center shadow-2xl relative z-10">
          
          <div className="w-20 h-20 rounded-full bg-[#faf3e8] border-2 border-[#d69c4f] p-1 mx-auto mb-5 shadow-lg overflow-hidden">
            <img src={LOGO_URL} alt="JIRÉH Logo" className="w-full h-full object-cover rounded-full" />
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#faf3e8] mb-1">
            Panel de Administración
          </h1>
          <p className="text-xs text-[#dfcca9] mb-6">
            JIRÉH Panadería y Pastelería — Gestión de Catálogo y Tortas
          </p>

          <form onSubmit={handleVerifyPin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#a89078] mb-2">
                Ingresa el PIN de seguridad
              </label>
              <input
                type="password"
                maxLength={10}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="••••"
                autoFocus
                className="w-full text-center tracking-[0.5em] font-mono text-2xl py-3 px-4 rounded-xl bg-[#0b0604] border border-[#d69c4f]/40 text-[#faf3e8] placeholder:tracking-normal placeholder:font-sans placeholder:text-xs placeholder:text-[#88705b] focus:outline-none focus:border-[#e8b66f]"
              />
              {pinError && (
                <p className="text-xs text-red-400 mt-2 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> PIN incorrecto. Intenta con 1234
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#b97f33] to-[#d69c4f] hover:from-[#c88d3d] hover:to-[#e4ac61] text-[#150e09] font-bold text-sm tracking-wide shadow-xl transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              Ingresar al Administrador
            </button>
          </form>

          <div className="mt-8 pt-5 border-t border-[#2d1b11] text-[11px] text-[#a89078] flex items-center justify-between">
            <span>PIN predeterminado: <strong className="text-[#e8b66f] font-mono">1234</strong></span>
            <span className="text-[#7d6754]">Cajamarca, Perú</span>
          </div>

        </div>

      </div>
    );
  }

  // =========================================================================
  // VIEW 2: FULL-PAGE ADMIN DASHBOARD & WORKSPACE
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#0e0805] text-[#faf3e8] flex flex-col font-sans selection:bg-[#d69c4f] selection:text-[#150e09]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#d69c4f] text-[#150e09] px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP STICKY HEADER */}
      <header className="sticky top-0 z-40 bg-[#150e09]/95 backdrop-blur-md border-b border-[#2d1b11] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        
        {/* Left: Back to store & brand */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToStore}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#22150d] hover:bg-[#311e13] border border-[#4a2e1c] text-xs font-semibold text-[#faf3e8] transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-sm"
            title="Regresar a la página principal de la tienda"
          >
            <ArrowLeft className="w-4 h-4 text-[#e8b66f]" />
            <span className="hidden sm:inline">Volver a la Tienda Web</span>
            <span className="sm:hidden">Tienda</span>
          </button>

          <div className="h-6 w-px bg-[#39261a] hidden sm:block" />

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#faf3e8] p-0.5 border border-[#d69c4f] shrink-0 overflow-hidden">
              <img src={LOGO_URL} alt="JIRÉH" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <h1 className="font-serif text-sm sm:text-base font-bold text-[#faf3e8] leading-tight">
                Panel de Administración JIRÉH
              </h1>
              <p className="text-[11px] text-[#b97f33] leading-tight flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Gestión de Catálogo y Tortas</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Quick actions & Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
              activeTab === 'settings'
                ? 'bg-[#d69c4f] text-[#150e09] font-bold border-[#d69c4f]'
                : 'bg-[#1b120c] text-[#dfcca9] border-[#39261a] hover:bg-[#251911]'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 inline mr-1 text-[#e8b66f]" />
            <span className="hidden sm:inline">Ajustes & PIN</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#251911] hover:bg-[#342216] border border-[#39261a] text-xs text-[#dfcca9] hover:text-[#faf3e8] transition-colors cursor-pointer"
            title="Cerrar sesión de administrador"
          >
            <Lock className="w-3.5 h-3.5 text-[#e8b66f]" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>

      </header>

      {/* 2. MAIN BODY */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">

        {/* KPI Summary Cards Banner */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          <div className="bg-[#150e09] border border-[#2d1b11] p-4 rounded-2xl flex items-center gap-3.5 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-[#b97f33]/20 border border-[#d69c4f]/40 flex items-center justify-center text-[#e8b66f] shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-[#a89078] uppercase font-semibold tracking-wider">Total Productos</p>
              <p className="font-serif text-2xl font-bold text-[#faf3e8]">{totalProducts}</p>
            </div>
          </div>

          <div className="bg-[#150e09] border border-[#2d1b11] p-4 rounded-2xl flex items-center gap-3.5 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-amber-900/30 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div>
              <p className="text-[11px] text-[#a89078] uppercase font-semibold tracking-wider">Destacadas Portada</p>
              <p className="font-serif text-2xl font-bold text-[#e8b66f]">{featuredCount}</p>
            </div>
          </div>

          <div className="bg-[#150e09] border border-[#2d1b11] p-4 rounded-2xl flex items-center gap-3.5 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-[#a89078] uppercase font-semibold tracking-wider">Precio Promedio</p>
              <p className="font-serif text-2xl font-bold text-[#faf3e8]">S/. {avgPrice}</p>
            </div>
          </div>

          <div className="bg-[#150e09] border border-[#2d1b11] p-4 rounded-2xl flex items-center gap-3.5 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-purple-950/40 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-[#a89078] uppercase font-semibold tracking-wider">Categorías</p>
              <p className="font-serif text-2xl font-bold text-[#faf3e8]">{CAKE_CATEGORIES.length}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Catálogo vs Nueva Torta vs Ajustes) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[#2d1b11] pb-4">
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'catalog'
                  ? 'bg-[#d69c4f] text-[#150e09] shadow-md font-bold'
                  : 'bg-[#150e09] text-[#dfcca9] hover:bg-[#251911] border border-[#2d1b11]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Catálogo ({totalProducts})</span>
            </button>

            <button
              onClick={startNewProduct}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'new_product'
                  ? 'bg-[#d69c4f] text-[#150e09] shadow-md font-bold'
                  : 'bg-[#150e09] text-[#dfcca9] hover:bg-[#251911] border border-[#2d1b11]'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>{editingProduct ? 'Editar Producto' : 'Nueva Torta / Producto'}</span>
            </button>
          </div>

          {activeTab === 'catalog' && (
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <div className="flex items-center bg-[#150e09] border border-[#39261a] rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'grid' ? 'bg-[#d69c4f] text-[#150e09]' : 'text-[#a89078] hover:text-white'
                  }`}
                  title="Vista Cuadrícula (Cards)"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'table' ? 'bg-[#d69c4f] text-[#150e09]' : 'text-[#a89078] hover:text-white'
                  }`}
                  title="Vista Tabla (Lista)"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-[#150e09] border border-[#39261a] text-xs text-[#dfcca9] focus:outline-none focus:border-[#d69c4f]"
              >
                <option value="popular">★ Destacadas primero</option>
                <option value="name">Alfabético (A-Z)</option>
                <option value="price_asc">Precio: Menor a Mayor</option>
                <option value="price_desc">Precio: Mayor a Menor</option>
              </select>
            </div>
          )}

        </div>

        {/* =================================================================== */}
        {/* TAB 1: CATALOG OVERVIEW (GRID OR TABLE)                            */}
        {/* =================================================================== */}
        {activeTab === 'catalog' && (
          <div className="space-y-5">
            
            {/* Search Bar & Category Filters */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-lg">
                <Search className="w-4 h-4 text-[#a89078] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre de torta, porciones o detalles..."
                  className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-[#150e09] border border-[#39261a] text-xs sm:text-sm text-[#faf3e8] placeholder-[#7d6754] focus:outline-none focus:border-[#d69c4f]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a89078] hover:text-white"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setCategoryFilter('todos')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    categoryFilter === 'todos'
                      ? 'bg-[#d69c4f] text-[#150e09] font-bold shadow-sm'
                      : 'bg-[#150e09] text-[#dfcca9] hover:bg-[#251911] border border-[#2d1b11]'
                  }`}
                >
                  Todas ({products.length})
                </button>
                {CAKE_CATEGORIES.map((cat) => {
                  const count = products.filter((p) => p.category === cat.id).length;
                  const isActive = categoryFilter === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
                        isActive
                          ? 'bg-[#d69c4f] text-[#150e09] font-bold shadow-sm'
                          : 'bg-[#150e09] text-[#dfcca9] hover:bg-[#251911] border border-[#2d1b11]'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                      <span className="opacity-70 text-[10px]">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Empty state */}
            {sortedProducts.length === 0 ? (
              <div className="text-center py-16 bg-[#150e09] rounded-3xl border border-dashed border-[#39261a]">
                <p className="text-base text-[#dfcca9] mb-3">No se encontraron tortas con los filtros actuales.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('todos');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#251911] hover:bg-[#342216] border border-[#d69c4f]/40 text-xs text-[#faf3e8]"
                >
                  Limpiar Filtros
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* GRID VIEW (CARDS) */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {sortedProducts.map((cake) => (
                  <div
                    key={cake.id}
                    className="bg-[#150e09] border border-[#2d1b11] hover:border-[#d69c4f]/50 rounded-2xl p-4 flex flex-col justify-between transition-all group hover:shadow-xl"
                  >
                    <div>
                      {/* Image Thumbnail & Badges */}
                      <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-[#0a0604] border border-[#39261a] mb-3.5">
                        <img
                          src={cake.image}
                          alt={cake.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/cropped/torta_chocodrip.jpg';
                          }}
                        />

                        {/* Top floating badges */}
                        <div className="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap">
                          {cake.isPopular && (
                            <span className="bg-[#d69c4f] text-[#150e09] font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                              <Star className="w-2.5 h-2.5 fill-current" /> En Portada
                            </span>
                          )}
                          {cake.badge && (
                            <span className="bg-[#1b120c]/90 text-[#e8b66f] border border-[#d69c4f]/50 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                              {cake.badge}
                            </span>
                          )}
                        </div>

                        {/* Category tag */}
                        <div className="absolute bottom-2 right-2 bg-black/80 text-[10px] text-[#dfcca9] px-2 py-0.5 rounded capitalize backdrop-blur-xs">
                          {cake.category}
                        </div>
                      </div>

                      {/* Title & Price */}
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-serif text-base font-bold text-[#faf3e8] leading-snug group-hover:text-[#e8b66f] transition-colors">
                          {cake.name}
                        </h3>
                        <span className="text-base font-bold font-mono text-[#e8b66f] shrink-0">
                          S/. {cake.basePrice.toFixed(2)}
                        </span>
                      </div>

                      <p className="text-xs text-[#dfcca9] line-clamp-2 mb-3">
                        {cake.description}
                      </p>

                      <div className="text-[11px] text-[#a89078] flex items-center gap-2 mb-4">
                        <span>Rendimiento: <strong className="text-[#faf3e8]">{cake.portions}</strong></span>
                        {cake.isCustomizable && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-400">Personalizable</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-[#251911] flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleTogglePopular(cake)}
                        className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                          cake.isPopular
                            ? 'bg-[#d69c4f]/20 border-[#d69c4f] text-[#e8b66f]'
                            : 'bg-[#1b120c] border-[#39261a] text-[#88705b] hover:text-[#faf3e8]'
                        }`}
                        title={cake.isPopular ? 'Quitar de portada de inicio' : 'Mostrar en carrusel de inicio'}
                      >
                        <Star className={`w-3.5 h-3.5 ${cake.isPopular ? 'fill-current' : ''}`} />
                        <span>{cake.isPopular ? 'En Portada' : 'Destacar'}</span>
                      </button>

                      <button
                        onClick={() => startEditProduct(cake)}
                        className="py-1.5 px-3 rounded-lg bg-[#22150d] hover:bg-[#311e13] border border-[#d69c4f]/40 text-xs font-semibold text-[#faf3e8] flex items-center gap-1 transition-colors cursor-pointer"
                        title="Editar información"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#e8b66f]" />
                        <span>Editar</span>
                      </button>

                      <button
                        onClick={() => setProductToDelete(cake)}
                        className="py-1.5 px-2 rounded-lg bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 text-xs text-red-300 hover:text-white transition-colors cursor-pointer"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              /* TABLE VIEW (LIST) */
              <div className="bg-[#150e09] border border-[#2d1b11] rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#1e130c] text-[#a89078] uppercase text-[10px] tracking-wider border-b border-[#2d1b11]">
                      <tr>
                        <th className="py-3 px-4">Foto</th>
                        <th className="py-3 px-4">Torta / Producto</th>
                        <th className="py-3 px-4">Categoría</th>
                        <th className="py-3 px-4">Porciones</th>
                        <th className="py-3 px-4">Precio Base</th>
                        <th className="py-3 px-4 text-center">En Portada</th>
                        <th className="py-3 px-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#251911]">
                      {sortedProducts.map((cake) => (
                        <tr key={cake.id} className="hover:bg-[#1c120a] transition-colors">
                          <td className="py-3 px-4">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#0a0604] border border-[#39261a] shrink-0">
                              <img src={cake.image} alt={cake.name} className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-serif font-bold text-sm text-[#faf3e8]">{cake.name}</div>
                            {cake.badge && (
                              <span className="text-[10px] text-[#e8b66f] font-semibold">{cake.badge} • </span>
                            )}
                            <span className="text-[11px] text-[#a89078] truncate max-w-xs block">{cake.description}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="bg-[#24170f] px-2 py-0.5 rounded text-[11px] text-[#dfcca9] capitalize">
                              {cake.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[#dfcca9]">{cake.portions}</td>
                          <td className="py-3 px-4 font-mono font-bold text-[#e8b66f] text-sm">
                            S/. {cake.basePrice.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleTogglePopular(cake)}
                              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                cake.isPopular
                                  ? 'bg-[#d69c4f]/20 border-[#d69c4f] text-[#e8b66f]'
                                  : 'bg-[#1b120c] border-[#39261a] text-[#5c4637] hover:text-[#faf3e8]'
                              }`}
                              title={cake.isPopular ? 'Activa en portada' : 'No en portada'}
                            >
                              <Star className={`w-4 h-4 ${cake.isPopular ? 'fill-current' : ''}`} />
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => startEditProduct(cake)}
                                className="p-1.5 rounded-lg bg-[#22150d] hover:bg-[#311e13] border border-[#d69c4f]/30 text-[#e8b66f] hover:text-white"
                                title="Editar"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setProductToDelete(cake)}
                                className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 text-red-400 hover:text-white"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: CREATE / EDIT PRODUCT (SIDE-BY-SIDE WITH LIVE PREVIEW)       */}
        {/* =================================================================== */}
        {activeTab === 'new_product' && (
          <div className="bg-[#150e09] border border-[#d69c4f]/40 rounded-3xl p-6 sm:p-8 shadow-xl">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#2d1b11] mb-6">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#faf3e8]">
                  {editingProduct ? `Editar Torta: ${editingProduct.name}` : 'Crear Nueva Torta / Producto'}
                </h2>
                <p className="text-xs text-[#dfcca9]">
                  Los cambios se guardan al instante y se reflejan en el catálogo público de la tienda.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setActiveTab('catalog');
                }}
                className="px-3.5 py-1.5 rounded-xl border border-[#39261a] text-xs text-[#dfcca9] hover:bg-[#251911]"
              >
                Volver al Catálogo
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Form Controls (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#faf3e8] mb-1.5">
                    Nombre de la Torta / Producto *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ej. Torta Selva Negra con Frutos del Bosque"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0a07] border border-[#39261a] text-xs sm:text-sm text-[#faf3e8] focus:outline-none focus:border-[#d69c4f]"
                  />
                </div>

                {/* Category & Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#faf3e8] mb-1.5">
                      Categoría *
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as CakeCategory)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0a07] border border-[#39261a] text-xs sm:text-sm text-[#faf3e8] focus:outline-none focus:border-[#d69c4f]"
                    >
                      {CAKE_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#faf3e8] mb-1.5">
                      Precio Base (S/.) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#d69c4f]">
                        S/.
                      </span>
                      <input
                        type="number"
                        min="1"
                        step="0.5"
                        required
                        value={formPrice}
                        onChange={(e) => setFormPrice(parseFloat(e.target.value) || 0)}
                        placeholder="85.00"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0f0a07] border border-[#39261a] text-xs sm:text-sm text-[#faf3e8] font-mono focus:outline-none focus:border-[#d69c4f]"
                      />
                    </div>
                  </div>
                </div>

                {/* Portions & Badge */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#faf3e8] mb-1.5">
                      Porciones / Rendimiento
                    </label>
                    <input
                      type="text"
                      value={formPortions}
                      onChange={(e) => setFormPortions(e.target.value)}
                      placeholder="Ej. 20-25 porciones"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0a07] border border-[#39261a] text-xs sm:text-sm text-[#faf3e8] focus:outline-none focus:border-[#d69c4f]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#faf3e8] mb-1.5">
                      Insignia / Badge (Opcional)
                    </label>
                    <input
                      type="text"
                      value={formBadge}
                      onChange={(e) => setFormBadge(e.target.value)}
                      placeholder="Ej. La Más Pedida, Especial, Nuevo"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0a07] border border-[#39261a] text-xs sm:text-sm text-[#faf3e8] focus:outline-none focus:border-[#d69c4f]"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-[#faf3e8] mb-1.5">
                    Descripción / Ingredientes & Acabados
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Describe los sabores, la técnica de decoración, frutos frescos y masa artesanal..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0a07] border border-[#39261a] text-xs text-[#faf3e8] focus:outline-none focus:border-[#d69c4f]"
                  />
                </div>

                {/* Photo Presets & Custom Image */}
                <div>
                  <label className="block text-xs font-semibold text-[#faf3e8] mb-1.5">
                    Foto del Producto (Elige una foto real o escribe URL)
                  </label>
                  
                  {/* Preset thumbnails */}
                  <div className="grid grid-cols-5 gap-2 p-2 bg-[#0a0604] rounded-xl border border-[#2d1b11] mb-2.5 max-h-32 overflow-y-auto">
                    {PRESET_PRODUCT_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormImage(preset.url)}
                        className={`relative rounded-lg overflow-hidden h-14 border transition-all cursor-pointer ${
                          formImage === preset.url
                            ? 'border-[#d69c4f] ring-2 ring-[#d69c4f]/50 scale-105'
                            : 'border-[#39261a] opacity-70 hover:opacity-100'
                        }`}
                        title={preset.label}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="/assets/cropped/... o enlace web https://"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0f0a07] border border-[#39261a] text-xs text-[#faf3e8] font-mono focus:outline-none focus:border-[#d69c4f]"
                  />
                </div>

                {/* Checkboxes */}
                <div className="flex flex-wrap items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 text-xs text-[#dfcca9] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsPopular}
                      onChange={(e) => setFormIsPopular(e.target.checked)}
                      className="w-4 h-4 rounded text-[#d69c4f] bg-[#0f0a07] border-[#39261a] focus:ring-0"
                    />
                    <span className="font-semibold text-[#faf3e8]">★ Mostrar como Especialidad Destacada en Inicio</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-[#dfcca9] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsCustomizable}
                      onChange={(e) => setFormIsCustomizable(e.target.checked)}
                      className="w-4 h-4 rounded text-[#d69c4f] bg-[#0f0a07] border-[#39261a] focus:ring-0"
                    />
                    <span>100% Personalizable (bizcocho, rellenos)</span>
                  </label>
                </div>

                {/* Flavors & Fillings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#a89078] mb-1">
                      Sabores de Bizcocho (separados por coma)
                    </label>
                    <input
                      type="text"
                      value={formFlavors}
                      onChange={(e) => setFormFlavors(e.target.value)}
                      placeholder="Vainilla, Chocolate, Marmoleado"
                      className="w-full px-3 py-2 rounded-xl bg-[#0f0a07] border border-[#39261a] text-xs text-[#faf3e8]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#a89078] mb-1">
                      Rellenos Disponibles (separados por coma)
                    </label>
                    <input
                      type="text"
                      value={formFillings}
                      onChange={(e) => setFormFillings(e.target.value)}
                      placeholder="Fudge casero, Manjar blanco"
                      className="w-full px-3 py-2 rounded-xl bg-[#0f0a07] border border-[#39261a] text-xs text-[#faf3e8]"
                    />
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="pt-4 flex items-center justify-start gap-3">
                  <button
                    type="submit"
                    className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#b97f33] to-[#d69c4f] hover:from-[#c88d3d] hover:to-[#e4ac61] text-[#150e09] font-bold text-sm tracking-wide shadow-xl transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {editingProduct ? 'Guardar Cambios del Producto' : 'Crear y Publicar Torta'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setActiveTab('catalog');
                    }}
                    className="px-5 py-3 rounded-xl border border-[#39261a] text-xs text-[#dfcca9] hover:bg-[#251911]"
                  >
                    Cancelar
                  </button>
                </div>

              </div>

              {/* Right Column: Live Customer View Preview (5 cols) */}
              <div className="lg:col-span-5 bg-[#0a0604] border border-[#39261a] p-5 rounded-2xl sticky top-24">
                <div className="flex items-center gap-2 mb-3 text-xs text-[#a89078]">
                  <Eye className="w-4 h-4 text-[#e8b66f]" />
                  <span className="font-semibold uppercase tracking-wider text-[11px]">Vista Previa en Vivo para Clientes</span>
                </div>

                <div className="bg-[#150e09] border border-[#d69c4f]/40 rounded-2xl p-4 shadow-xl text-left">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-[#0a0604] border border-[#39261a] mb-4 flex items-center justify-center">
                    <img
                      src={formImage || PRESET_PRODUCT_IMAGES[0].url}
                      alt={formName || 'Vista Previa'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/cropped/torta_chocodrip.jpg';
                      }}
                    />

                    {formBadge && (
                      <span className="absolute top-2 left-2 bg-[#d69c4f] text-[#150e09] font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-md">
                        {formBadge}
                      </span>
                    )}

                    {formIsPopular && (
                      <span className="absolute top-2 right-2 bg-[#1b120c]/90 text-[#e8b66f] border border-[#d69c4f]/50 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                        ★ Destacada en Inicio
                      </span>
                    )}
                  </div>

                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-serif text-lg font-bold text-[#faf3e8]">
                      {formName || 'Nombre de la Torta'}
                    </h4>
                    <span className="text-lg font-mono font-bold text-[#e8b66f] shrink-0">
                      S/. {Number(formPrice || 0).toFixed(2)}
                    </span>
                  </div>

                  <p className="text-xs text-[#dfcca9] mb-3 line-clamp-3">
                    {formDescription || 'Descripción de la torta artesanal elaborada con recetas tradicionales cajamarquinas.'}
                  </p>

                  <div className="text-xs text-[#a89078] mb-4 space-y-1">
                    <p>Porciones: <strong className="text-[#faf3e8]">{formPortions || '20-25 porciones'}</strong></p>
                    <p>Categoría: <strong className="text-[#e8b66f] capitalize">{formCategory}</strong></p>
                  </div>

                  <div className="w-full py-2.5 rounded-xl bg-[#b97f33] text-[#150e09] text-center font-bold text-xs">
                    Cotizar por WhatsApp ↗
                  </div>
                </div>
              </div>

            </form>

          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: SETTINGS, BACKUP & SECURITY                                 */}
        {/* =================================================================== */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Box 1: Change PIN */}
            <div className="bg-[#150e09] border border-[#2d1b11] p-6 sm:p-8 rounded-3xl shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#b97f33]/20 border border-[#d69c4f]/40 flex items-center justify-center text-[#e8b66f]">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#faf3e8]">
                    Seguridad y PIN de Acceso
                  </h3>
                  <p className="text-xs text-[#dfcca9]">
                    Cambia la clave para ingresar a esta página de administración.
                  </p>
                </div>
              </div>

              <form onSubmit={handleUpdatePin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#faf3e8] mb-1">
                    Nuevo PIN (mínimo 4 caracteres)
                  </label>
                  <input
                    type="password"
                    required
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="Nuevo PIN"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0a07] border border-[#39261a] text-xs text-[#faf3e8] focus:outline-none focus:border-[#d69c4f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#faf3e8] mb-1">
                    Confirmar Nuevo PIN
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    placeholder="Repite el nuevo PIN"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f0a07] border border-[#39261a] text-xs text-[#faf3e8] focus:outline-none focus:border-[#d69c4f]"
                  />
                </div>

                {pinSuccessMsg && (
                  <p className="text-xs text-emerald-400 flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> ¡PIN actualizado exitosamente!
                  </p>
                )}

                <button
                  type="submit"
                  disabled={newPin.length < 4 || newPin !== confirmPin}
                  className="w-full py-2.5 rounded-xl bg-[#d69c4f] hover:bg-[#e4ac61] text-[#150e09] font-bold text-xs disabled:opacity-50 transition-all cursor-pointer"
                >
                  Actualizar PIN
                </button>
              </form>

              <p className="text-[11px] text-[#88705b] mt-4">
                * El PIN actual se conserva en tu navegador y protege este portal de accesos no autorizados.
              </p>
            </div>

            {/* Box 2: Backup & Restore */}
            <div className="bg-[#150e09] border border-[#2d1b11] p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#faf3e8]">
                      Copia de Seguridad y Restauración
                    </h3>
                    <p className="text-xs text-[#dfcca9]">
                      Exporta o restaura tus tortas y precios en formato JSON.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={handleExportJSON}
                    className="w-full py-3 px-4 rounded-xl bg-[#1f130b] hover:bg-[#2c1b10] border border-[#d69c4f]/40 text-xs text-[#faf3e8] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#e8b66f]" />
                    <span>Descargar Copia de Seguridad (.json)</span>
                  </button>

                  <label className="w-full py-3 px-4 rounded-xl bg-[#1f130b] hover:bg-[#2c1b10] border border-[#39261a] hover:border-[#d69c4f]/40 text-xs text-[#dfcca9] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer">
                    <Upload className="w-4 h-4 text-[#e8b66f]" />
                    <span>Importar Catálogo (.json)</span>
                    <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Reset to Factory Defaults */}
              <div className="mt-8 pt-6 border-t border-[#251911]">
                <h4 className="text-xs font-bold text-red-300 mb-1">Zona de Restauración</h4>
                <p className="text-[11px] text-[#dfcca9] mb-3">
                  Si deseas volver al catálogo original de JIRÉH con las recetas y fotos iniciales:
                </p>
                <button
                  onClick={() => {
                    if (window.confirm('¿Seguro que deseas restaurar el catálogo a los productos originales de JIRÉH?')) {
                      onResetProducts();
                      showToast('Catálogo restaurado a los valores originales.');
                    }
                  }}
                  className="py-2 px-4 rounded-xl bg-[#2a1313] hover:bg-[#3d1818] border border-red-500/30 text-xs text-red-200 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Catálogo Predeterminado</span>
                </button>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* 3. CONFIRM DELETE DIALOG */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#150e09] border border-red-500/50 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-900/30 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-bold text-[#faf3e8] mb-2">
              ¿Eliminar {productToDelete.name}?
            </h4>
            <p className="text-xs text-[#dfcca9] mb-6">
              Esta torta se retirará del catálogo de la web. Siempre podrás restaurarla desde Ajustes si lo necesitas.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 rounded-xl border border-[#39261a] text-xs text-[#dfcca9] hover:bg-[#251911]"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteProduct}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
