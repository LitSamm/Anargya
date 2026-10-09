'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { PWAInstallBanner } from '../components/high/PWAInstallBanner';
import { MobileBottomNav } from '../components/high/MobileBottomNav';
import { HeroSection } from '../components/low/HeroSection';
import { CarsSection } from '../components/low/CarsSection';
import { AchievementsSection } from '../components/low/AchievementsSection';
import { DivisionsSection } from '../components/low/DivisionsSection';
import { SponsorsSection } from '../components/low/SponsorsSection';
import { ProductCard } from '../components/med/ProductCard';
import { CartDrawer } from '../components/med/CartDrawer';
import { CheckoutModal } from '../components/med/CheckoutModal';
import { ScrollReveal } from '../components/common/ScrollReveal';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { 
  Sparkles, 
  X,
} from 'lucide-react';

export default function HomePage() {
  const { products } = useStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Use curated featured merchandise that matches the official product artwork set
  const featuredProductIds = [
    'prod-tee-blueprint',
    'prod-sticker-pack',
    'prod-tumbler-racing',
    'prod-enamel-pin',
  ];

  const featuredProducts = featuredProductIds
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));

  return (
    <div className="relative min-h-screen flex flex-col bg-main-dark">
      <Navbar onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1">
        {/* 1. LOW TASK: Hero Section */}
        <ScrollReveal>
          <HeroSection />
        </ScrollReveal>

        <PWAInstallBanner />

        {/* 2. LOW TASK: Cars Fleet Lineup (Mark 1.0 - 6.0) */}
        <ScrollReveal>
          <CarsSection />
        </ScrollReveal>

        {/* 3. LOW TASK: Achievements (FSAE Japan 2026 Awards) */}
        <ScrollReveal>
          <AchievementsSection />
        </ScrollReveal>

        {/* 4. MED TASK: Featured Official Merchandise Section */}
        <ScrollReveal>
          <section className="py-24 bg-main-dark border-t border-b border-white/10 relative font-sfui">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-sfui font-semibold tracking-wider text-main-red mb-2">
                    <span>Team Apparel & Accessories</span>
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
                    Official <span className="text-main-red">Merchandise</span>
                  </h2>
                  <p className="text-white/60 text-sm sm:text-base mt-2 max-w-xl leading-relaxed">
                    Gear up with genuine team wear. 100% of proceeds directly fund the research and international competition logistics of Anargya ITS EV Team.
                  </p>
                </div>

              </div>

              {/* Product Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>

            </div>
          </section>
        </ScrollReveal>

        {/* 5. LOW TASK: Divisions Section */}
        <ScrollReveal>
          <DivisionsSection />
        </ScrollReveal>

        {/* 6. LOW TASK: Sponsors Section */}
        <ScrollReveal>
          <SponsorsSection />
        </ScrollReveal>
      </main>

      {/* Footer */}
      <ScrollReveal>
        <Footer />
      </ScrollReveal>

      {/* HIGH TASK: Mobile Bottom Navigation Bar */}
      <MobileBottomNav onOpenCart={() => setIsCartOpen(true)} />

      {/* MED TASK: Cart Sliding Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* MED TASK: Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* Quick View Modal for Product */}
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
