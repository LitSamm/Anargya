'use client';

import React, { useState } from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { PWAInstallBanner } from '../../components/high/PWAInstallBanner';
import { MobileBottomNav } from '../../components/high/MobileBottomNav';
import { ProductCard } from '../../components/med/ProductCard';
import { CartDrawer } from '../../components/med/CartDrawer';
import { CheckoutModal } from '../../components/med/CheckoutModal';
import { ScrollReveal } from '../../components/common/ScrollReveal';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { INITIAL_PRODUCTS } from '../../data/mockData';
import { 
  Search, 
  Sparkles, 
  Zap,
  Filter,
  ArrowUpDown,
  ShoppingBag,
  X,
} from 'lucide-react';

export default function StorePage() {
  const { products } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const categories = ['All', 'Apparel', 'Accessories', 'Collectibles'];
  const storeProducts = INITIAL_PRODUCTS.map((catalogProduct) => {
    const currentProduct = products.find((product) => product.id === catalogProduct.id);

    return currentProduct
      ? {
          ...catalogProduct,
          ...currentProduct,
          name: catalogProduct.name,
          description: catalogProduct.description,
          image: catalogProduct.image,
        }
      : catalogProduct;
  });

  // Filtering
  const filteredProducts = storeProducts.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0; // featured
  });

  return (
    <div className="relative min-h-screen flex flex-col bg-main-dark">
      <PWAInstallBanner />
      <Navbar onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full font-sfui">
        
        {/* Storefront Hero Banner */}
        <ScrollReveal>
          <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-8 sm:p-12 mb-10 bg-gradient-to-r from-card-dark via-secondary-dark to-card-dark shadow-2xl">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-main-red/10 border border-main-red/30 text-main-red text-xs font-sfui font-bold uppercase tracking-[0.18em] mb-4">
              <span>Anargya Official Store</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3 uppercase">
              OFFICIAL TEAM <span className="text-main-red">GEAR</span>
            </h1>
            <p className="font-sfui text-main-gray text-sm sm:text-base leading-relaxed">
              Tee, sticker pack, tumbler, and enamel pin, four official pieces. Every purchase funds Anargya research, battery development, and Formula SAE logistics.
            </p>
          </div>

          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 bg-gradient-to-l from-main-green/30 to-transparent pointer-events-none" />
          </div>
        </ScrollReveal>

        {/* Filter and Search Bar */}
        <ScrollReveal>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          
          {/* Categories Pill Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-sfui font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-main-red text-white shadow-md shadow-main-red/30'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input and Sort Dropdown */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-card-dark border border-white/10 focus:border-main-green focus:outline-none text-xs text-white font-sfui"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc')}
                className="px-3 py-2 rounded-xl bg-card-dark border border-white/10 text-xs font-sfui text-gray-300 focus:border-main-red focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          </div>
        </ScrollReveal>

        {/* Product Count Strip */}
        <ScrollReveal>
          <div className="flex items-center justify-between text-xs font-sfui text-main-gray mb-6 pb-3 border-b border-white/10">
            <span>Showing {sortedProducts.length} {sortedProducts.length === 1 ? 'merchandise item' : 'merchandise items'}</span>
            <span className="text-main-green font-semibold">Official Anargya merch</span>
          </div>

          {/* Products Grid */}
          {sortedProducts.length === 0 ? (
            <div className="py-20 text-center glass-panel rounded-3xl border border-white/10 p-8">
              <div className="w-12 h-12 text-gray-500 mx-auto mb-3 flex items-center justify-center">
                <ShoppingBag className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="font-codec-cold text-lg font-heavy text-white mb-1">No products found</h3>
              <p className="font-sfui text-xs text-gray-400 max-w-sm mx-auto mb-4">
                We couldn't find any products matching your search "{searchQuery}". Try different keywords or reset filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="px-4 py-2 rounded-xl bg-main-green text-main-dark font-bold text-xs shadow-neon-green"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          )}
        </ScrollReveal>

      </main>

      {/* Footer */}
      <ScrollReveal>
        <Footer />
      </ScrollReveal>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onOpenCart={() => setIsCartOpen(true)} />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-card-dark border border-white/20 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="aspect-square w-full rounded-2xl overflow-hidden mb-4 bg-black">
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.name}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xs font-sfui text-main-green font-bold uppercase tracking-wider">
              {quickViewProduct.category}
            </span>
            <h3 className="font-sfui text-xl font-bold text-white mb-2">{quickViewProduct.name}</h3>
            <p className="font-sfui text-sm text-main-gray mb-4 leading-relaxed">{quickViewProduct.description}</p>
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-xl font-sfui font-bold text-white">
                Rp {quickViewProduct.price.toLocaleString('id-ID')}
              </span>
              <button
                onClick={() => {
                  setQuickViewProduct(null);
                  setIsCartOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-main-green text-main-dark font-bold text-xs shadow-neon-green"
              >
                Go to Cart
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
