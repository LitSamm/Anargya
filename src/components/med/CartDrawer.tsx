'use client';

import React from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck,
  Zap,
  ShoppingBag
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onCheckout,
}) => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useStore();

  if (!isOpen) return null;

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-secondary-dark border-l border-white/10 shadow-2xl flex flex-col justify-between font-sfui">
          
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-main-green/20 border border-main-green/40 flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-main-green" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-codec-cold font-heavy text-white text-base">Your Cart</h3>
                <span className="text-xs font-sfui text-gray-400">
                  {cart.length} unique {cart.length === 1 ? 'item' : 'items'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-gray-400 hover:text-main-red transition-colors p-1.5"
                  title="Clear all items"
                >
                  Clear
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <ShoppingBag className="h-8 w-8 text-gray-500" aria-hidden="true" />
                </div>
                <h4 className="text-white font-bold text-base mb-1">Your cart is empty</h4>
                <p className="text-xs text-gray-400 max-w-xs mb-6">
                  Support Anargya ITS EV Team research by gearing up with official 9th Generation merchandise!
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-main-green text-main-dark font-bold text-xs shadow-neon-green"
                >
                  Browse Store Catalog
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.productId}-${item.selectedSize}`}
                  className="p-4 rounded-2xl bg-card-dark border border-white/10 flex gap-4 transition-all hover:border-white/20"
                >
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-20 h-20 rounded-xl object-cover bg-black/40 shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-white line-clamp-1">
                          {item.productName}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.productId, item.selectedSize)}
                          className="text-gray-500 hover:text-main-red transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.selectedSize && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-main-green border border-white/10 inline-block mt-1">
                          Size: {item.selectedSize}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                      <span className="font-mono text-xs font-bold text-white">
                        {formatIDR(item.productPrice * item.quantity)}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-secondary-dark rounded-lg p-1 border border-white/10">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.selectedSize)}
                          className="w-5 h-5 rounded flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-bold w-4 text-center text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.selectedSize)}
                          className="w-5 h-5 rounded flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-card-dark">
              <div className="space-y-2 mb-4 text-xs font-mono">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white font-bold">{formatIDR(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Estimated Shipping</span>
                  <span className="text-main-green font-bold">Calculated at Checkout</span>
                </div>
                <div className="flex justify-between text-sm text-white pt-2 border-t border-white/10 font-sans font-black">
                  <span>Total Amount</span>
                  <span className="font-mono text-main-green text-base">{formatIDR(cartTotal)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onCheckout();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-main-green text-main-dark font-black text-sm flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all shadow-neon-green"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                <ShieldCheck className="h-3.5 w-3.5 text-main-green" aria-hidden="true" />
                <span>Supports Anargya EV Team Research & Racing</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
