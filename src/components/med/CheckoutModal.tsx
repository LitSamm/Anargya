'use client';

import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  QrCode, 
  Building2, 
  ArrowRight,
  Copy,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order } from '../../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderComplete?: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderComplete,
}) => {
  const { cart, cartTotal, createOrder } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Surabaya',
    courier: 'JNE Express (Next Day - Rp 18.000)',
    paymentMethod: 'QRIS Instant Payment',
  });

  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const courierFee = formData.courier.includes('Pickup') ? 0 : 18000;
  const grandTotal = cartTotal + courierFee;

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      alert('Please fill out all required customer shipping fields.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder = createOrder({
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: `${formData.address}, ${formData.city}`,
        courier: formData.courier,
        paymentMethod: formData.paymentMethod,
        items: [...cart],
        totalAmount: grandTotal,
      });

      setCompletedOrder(newOrder);
      setIsSubmitting(false);

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00FF66', '#FFFFFF', '#FF2A55'],
        });
      } catch (err) {
        // fail silently if canvas not available
      }

      if (onOrderComplete) onOrderComplete(newOrder);
    }, 600);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-secondary-dark border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 font-sfui">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-card-dark">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-main-green/20 border border-main-green/40 flex items-center justify-center text-main-green">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-codec-cold font-heavy text-white">
                {completedOrder ? 'Order Confirmed!' : 'Anargya Paddock Checkout'}
              </h3>
              <span className="text-xs font-mono text-gray-400">
                {completedOrder ? 'Thank you for supporting 9th Gen' : 'Fast & secure official merchandise order'}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setCompletedOrder(null);
              onClose();
            }}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {completedOrder ? (
            /* Order Success View */
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-main-green/20 border border-main-green/50 flex items-center justify-center mx-auto mb-4 text-main-green shadow-neon-green">
                <span className="w-9 h-9 font-bold text-2xl">✓</span>
              </div>

              <h4 className="text-2xl font-black text-white mb-1">
                Order #{completedOrder.id} Placed!
              </h4>
              <p className="text-xs text-gray-300 max-w-md mx-auto mb-6">
                Your order has been recorded into the Anargya Paddock management system.
                A confirmation has been prepared for <strong className="text-white">{completedOrder.customerEmail}</strong>.
              </p>

              {/* Payment Mockup Details */}
              <div className="p-5 rounded-2xl bg-card-dark border border-white/10 max-w-md mx-auto text-left mb-6 font-mono text-xs space-y-3">
                <div className="flex justify-between text-gray-400">
                  <span>Method:</span>
                  <span className="text-white font-bold">{completedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Total Amount:</span>
                  <span className="text-main-green font-bold text-sm">
                    {formatIDR(completedOrder.totalAmount)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/10">
                  <div>
                    <span className="text-[10px] text-gray-500 block">VIRTUAL ACCOUNT / QRIS REF</span>
                    <span className="text-xs text-white font-bold tracking-wider">
                      88019-9021-4820
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard('8801990214820')}
                    className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                  >
                    {copied ? <span className="w-3.5 h-3.5 text-main-green font-bold">✓</span> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <span className="text-[10px] text-gray-500 block text-center italic">
                  *Simulation mode active (no live credit card required as per test task spec).
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setCompletedOrder(null);
                    onClose();
                  }}
                  className="px-6 py-3 rounded-xl bg-main-green text-main-dark font-black text-xs shadow-neon-green"
                >
                  Continue Shopping
                </button>
                <a
                  href="/admin"
                  className="px-6 py-3 rounded-xl bg-card-dark border border-white/20 text-white font-bold text-xs hover:border-main-green transition-colors"
                >
                  View in Admin Panel
                </a>
              </div>
            </div>
          ) : (
            /* Checkout Form View */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Customer Info */}
              <div>
                <h4 className="text-xs font-mono uppercase text-main-green font-bold tracking-wider mb-3">
                  1. Shipping Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-gray-300 mb-1 font-medium">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bima Satria"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-card-dark border border-white/10 focus:border-main-green focus:outline-none text-white font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1 font-medium">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="bima@alumni.its.ac.id"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-card-dark border border-white/10 focus:border-main-green focus:outline-none text-white font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1 font-medium">WhatsApp Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+62 812-3456-7890"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-card-dark border border-white/10 focus:border-main-green focus:outline-none text-white font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1 font-medium">City / Regency *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-card-dark border border-white/10 focus:border-main-green focus:outline-none text-white font-sans"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-gray-300 mb-1 font-medium">Delivery Address *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Jl. Raya ITS, Sukolilo, Surabaya, Jawa Timur 60111"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-card-dark border border-white/10 focus:border-main-green focus:outline-none text-white font-sans resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Courier Selection */}
              <div>
                <h4 className="text-xs font-mono uppercase text-main-green font-bold tracking-wider mb-3">
                  2. Courier & Delivery Method
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {[
                    { label: 'JNE Express (Next Day)', price: 'Rp 18.000', code: 'JNE' },
                    { label: 'SiCepat REG (2-3 Days)', price: 'Rp 18.000', code: 'SICEPAT' },
                    { label: 'Paddock Pickup (PUI-SKO ITS)', price: 'FREE', code: 'PICKUP' },
                  ].map((courier) => (
                    <label
                      key={courier.code}
                      className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                        formData.courier.includes(courier.code) || (courier.code === 'PICKUP' && formData.courier.includes('Pickup'))
                          ? 'border-main-green bg-main-green/10 text-white'
                          : 'border-white/10 bg-card-dark text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <input
                        type="radio"
                        name="courier"
                        className="sr-only"
                        checked={formData.courier.includes(courier.code) || (courier.code === 'PICKUP' && formData.courier.includes('Pickup'))}
                        onChange={() => setFormData({ ...formData, courier: `${courier.label} - ${courier.price}` })}
                      />
                      <span className="font-bold text-white text-[11px] mb-1">{courier.label}</span>
                      <span className="text-[10px] font-mono text-main-green font-bold">{courier.price}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h4 className="text-xs font-mono uppercase text-main-green font-bold tracking-wider mb-3">
                  3. Payment Method (Simulated)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {[
                    { name: 'QRIS Instant Payment', icon: QrCode },
                    { name: 'BCA Virtual Account', icon: Building2 },
                    { name: 'Mandiri Livin VA', icon: CreditCard },
                  ].map((method) => {
                    const Icon = method.icon;
                    const isSelected = formData.paymentMethod === method.name;
                    return (
                      <label
                        key={method.name}
                        className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-main-green bg-main-green/10 text-white shadow-neon-green-sm'
                            : 'border-white/10 bg-card-dark text-gray-400 hover:border-white/20'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          className="sr-only"
                          checked={isSelected}
                          onChange={() => setFormData({ ...formData, paymentMethod: method.name })}
                        />
                        <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-main-green' : 'text-gray-400'}`} />
                        <span className="font-bold text-xs">{method.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Order Calculation */}
              <div className="p-4 rounded-2xl bg-card-dark border border-white/10 text-xs font-mono space-y-1.5">
                <div className="flex justify-between text-gray-400">
                  <span>Cart Items ({cart.length})</span>
                  <span className="text-white">{formatIDR(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping Fee</span>
                  <span className="text-white">{formatIDR(courierFee)}</span>
                </div>
                <div className="flex justify-between text-sm font-sans font-black text-white pt-2 border-t border-white/10">
                  <span>Grand Total</span>
                  <span className="text-main-green font-mono text-base">{formatIDR(grandTotal)}</span>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-4 rounded-xl bg-main-green text-main-dark font-black text-sm flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all shadow-neon-green hover:scale-[1.01]"
              >
                {isSubmitting ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <span>Confirm & Place Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
