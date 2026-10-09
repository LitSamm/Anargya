'use client';

import React, { useState } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag, Check, Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenQuickView }) => {
  const { addToCart } = useStore();
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes ? product.sizes[0] : undefined
  );
  const [addedAnim, setAddedAnim] = useState(false);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleAddToCart = (e: React.MouseEvent, sizeOverride?: string) => {
    e.stopPropagation();
    const sizeToUse = sizeOverride || selectedSize;
    addToCart(product, sizeToUse);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1200);
  };

  return (
    <div
      onClick={() => onOpenQuickView && onOpenQuickView(product)}
      className="group relative flex flex-col justify-between rounded-2xl bg-[#131313] border border-white/[0.08] hover:border-main-red/50 hover:shadow-[0_12px_32px_rgba(235,65,63,0.12)] transition-all duration-400 overflow-hidden cursor-pointer hover:-translate-y-1 font-sfui"
    >
      {/* 1. Image Pedestal & Interactive Hover Drawer */}
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-b from-[#181818] to-[#0e0e0e] flex items-center justify-center p-7 border-b border-white/[0.06]">
        
        {/* Subtle radial spotlight */}
        <div className="absolute inset-0 bg-radial from-white/[0.04] to-transparent pointer-events-none" />

        {/* Sold Out indicator only when out of stock */}
        {!product.inStock && (
          <div className="absolute top-3 right-3 flex items-center text-[10px] font-mono tracking-wider z-10 pointer-events-none">
            <span className="flex items-center gap-1.5 font-medium text-main-red bg-black/60 px-2 py-0.5 rounded border border-main-red/30">
              <span className="w-1.5 h-1.5 rounded-full bg-main-red" />
              <span>Sold Out</span>
            </span>
          </div>
        )}

        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain filter drop-shadow-[0_16px_28px_rgba(0,0,0,0.85)] group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-500"
        />

        {/* Slide-Up Quick Action Drawer on Hover */}
        {product.inStock && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/95 via-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out flex items-center justify-center gap-1.5 z-20"
          >
            {product.sizes && product.sizes.length > 1 ? (
              <div className="flex items-center gap-1 bg-black/70 p-1 rounded-lg border border-white/15 backdrop-blur-md">
                <span className="text-[10px] font-mono text-white/50 px-1.5 font-semibold">SIZE:</span>
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={(e) => {
                      setSelectedSize(sz);
                      handleAddToCart(e, sz);
                    }}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                      selectedSize === sz
                        ? 'bg-main-red text-white shadow-sm'
                        : 'text-white/70 hover:text-white hover:bg-white/15'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            ) : (
              <button
                type="button"
                onClick={(e) => handleAddToCart(e)}
                className="w-full py-2 rounded-lg bg-main-red hover:bg-main-red/90 text-white text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-main-red/30"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Quick Add to Bag</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2. Product Information Panel */}
      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-main-red transition-colors line-clamp-1 leading-snug">
            {product.name}
          </h3>

          <p className="text-xs text-white/50 line-clamp-1 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing & Add to Cart Footer */}
        <div className="pt-4 mt-3 border-t border-white/[0.06] flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-black text-white tabular-nums tracking-tight">
              {formatIDR(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-white/30 line-through tabular-nums">
                {formatIDR(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={(e) => handleAddToCart(e)}
            disabled={!product.inStock}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              !product.inStock
                ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                : addedAnim
                ? 'bg-main-green text-main-dark font-bold'
                : 'bg-white/5 hover:bg-main-red text-white hover:border-main-red border border-white/10'
            }`}
            title="Add to Cart"
            aria-label="Add to Cart"
          >
            {addedAnim ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
