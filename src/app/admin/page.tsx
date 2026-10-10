'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { ScrollReveal } from '../../components/common/ScrollReveal';
import { PWAInstallBanner } from '../../components/high/PWAInstallBanner';
import { MobileBottomNav } from '../../components/high/MobileBottomNav';
import { Product } from '../../types';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../actions/product';
import { getOrders, updateOrderStatus, deleteOrder } from '../actions/order';
import {
  Plus,
  Trash2,
  ArrowLeft,
  X,
  PackageOpen,
  LogOut,
  Lock,
  Upload,
  Image as ImageIcon,
  Check,
  Loader2,
  Link2,
  Sparkles,
} from 'lucide-react';

type OrdersResult = Awaited<ReturnType<typeof getOrders>>;
type AdminOrder = NonNullable<OrdersResult['data']>[number];

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [actionError, setActionError] = useState('');

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const loadDashboard = useCallback(async () => {
    const [productsRes, ordersRes] = await Promise.all([getProducts(), getOrders()]);
    if (productsRes.success && productsRes.data) setProducts(productsRes.data);
    if (ordersRes.success && ordersRes.data) setOrders(ordersRes.data);
  }, []);

  useEffect(() => {
    fetch('/api/admin/check')
      .then((res) => res.json())
      .then((data: { authenticated?: boolean }) => {
        setIsAuthenticated(Boolean(data.authenticated));
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadDashboard();
  }, [isAuthenticated, loadDashboard]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUser, password: loginPass }),
      });

      const data = (await res.json()) as { success?: boolean; error?: string };
      if (res.ok && data.success) {
        setIsAuthenticated(true);
      } else {
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch {
      setLoginError('Failed communicating with server');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setIsAuthenticated(false);
  };

  // New product form state
  const [newProd, setNewProd] = useState({
    name: '',
    category: 'Apparel' as Product['category'],
    price: 150000,
    stock: 25,
    description: '',
    image: '/images/Tee.webp',
    badge: 'Limited 9th Gen' as Product['badge'],
    inStock: true,
  });

  // Image upload and assets state
  const [imageMode, setImageMode] = useState<'upload' | 'assets' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [availableAssets, setAvailableAssets] = useState<Array<{ name: string; url: string; category: string }>>([
    { name: 'Blueprint Tee', url: '/images/Tee.webp', category: 'Team Assets' },
    { name: 'Sticker Pack', url: '/images/Sticker Pack.webp', category: 'Team Assets' },
    { name: 'Achievement Tumbler', url: '/images/Tumbler.webp', category: 'Team Assets' },
    { name: 'Logo Enamel Pin', url: '/images/enamel.webp', category: 'Team Assets' },
  ]);

  const loadAssets = useCallback(async () => {
    try {
      const res = await fetch('/api/upload');
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        setAvailableAssets(data.items);
      }
    } catch (err) {
      console.error('Failed loading media assets', err);
    }
  }, []);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  const compressImageClient = (file: File, maxWidth = 1200, quality = 0.82): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result;
        if (typeof src !== 'string') {
          resolve('');
          return;
        }
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(src);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/webp', quality);
          resolve(compressed);
        };
        img.onerror = () => resolve(src);
        img.src = src;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    try {
      // Compress file on client first to keep payload lightweight (~80-150KB)
      const compressedDataUrl = await compressImageClient(file);

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        // If upload returned a public static URL (/uploads/...), use it.
        // If on serverless where it returned a data URL, use our ultra-compact compressed data URL.
        const finalUrl = data.url.startsWith('data:') && compressedDataUrl ? compressedDataUrl : data.url;
        setNewProd((prev) => ({ ...prev, image: finalUrl }));
        loadAssets();
      } else {
        if (compressedDataUrl) {
          setNewProd((prev) => ({ ...prev, image: compressedDataUrl }));
        }
      }
    } catch {
      const compressedDataUrl = await compressImageClient(file);
      if (compressedDataUrl) {
        setNewProd((prev) => ({ ...prev, image: compressedDataUrl }));
      }
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;
  const inStockCount = products.filter((p) => p.inStock).length;

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.description) {
      alert('Please fill out all product fields.');
      return;
    }

    setActionError('');
    const res = await createProduct({
      name: newProd.name,
      category: newProd.category,
      price: Number(newProd.price),
      stock: Number(newProd.stock),
      description: newProd.description,
      imageUrl: newProd.image || undefined,
      badge: newProd.badge,
      inStock: newProd.stock > 0,
    });

    if (!res.success) {
      setActionError(res.error || 'Failed to create product');
      return;
    }

    await loadDashboard();
    setIsAddModalOpen(false);
    setNewProd({
      name: '',
      category: 'Apparel',
      price: 150000,
      stock: 25,
      description: '',
      image: '/images/Tee.webp',
      badge: 'Limited 9th Gen',
      inStock: true,
    });
  };

  const handleUpdateProduct = async (id: string, patch: Partial<Product>) => {
    setActionError('');
    const res = await updateProduct(id, patch);
    if (!res.success) {
      setActionError(res.error || 'Failed to update product');
      return;
    }
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}?`)) return;
    setActionError('');
    const res = await deleteProduct(id);
    if (!res.success) {
      setActionError(res.error || 'Failed to delete product');
      return;
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    setActionError('');
    const res = await updateOrderStatus(id, status);
    if (!res.success) {
      setActionError(res.error || 'Failed to update order');
      return;
    }
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const handleDeleteOrder = async (id: string, orderNumber: string) => {
    if (!confirm(`Delete order ${orderNumber}?`)) return;
    setActionError('');
    const res = await deleteOrder(id);
    if (!res.success) {
      setActionError(res.error || 'Failed to delete order');
      return;
    }
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-main-dark">
      <PWAInstallBanner />
      <Navbar />

      <ScrollReveal className="flex-1">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {isAuthenticated === null ? (
          <div className="min-h-[400px] flex items-center justify-center font-mono text-xs text-white/50">
            Verifying admin session...
          </div>
        ) : !isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center py-16">
            <div className="max-w-md w-full bg-secondary-dark/95 border border-white/15 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-main-red/10 border border-main-red/30 text-main-red text-[11px] font-mono font-bold tracking-wider mb-3">
                  <Lock className="w-3.5 h-3.5" />
                  <span>ADMIN ACCESS ONLY</span>
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Admin Sign In</h2>
                <p className="text-xs text-gray-400 mt-1">Sign in with administrator credentials to manage merchandise catalog & database.</p>
              </div>

              {loginError && (
                <div className="mb-5 p-3 rounded-xl bg-main-red/10 border border-main-red/30 text-main-red text-xs font-medium text-center">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">Username</label>
                  <input
                    type="text"
                    value={loginUser}
                    onChange={(e) => setLoginUser(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-main-red focus:outline-none transition-colors"
                    placeholder="admin"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">Password</label>
                  <input
                    type="password"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-main-red focus:outline-none transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3.5 rounded-xl bg-main-red text-white font-bold text-xs uppercase tracking-wider hover:bg-main-red/90 active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
                >
                  {isLoggingIn ? 'Authenticating...' : 'Sign In to Dashboard'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-main-green uppercase mb-1">
                  <span className="font-black">[ADMIN]</span>
                  <span>Anargya Operations Backoffice</span>
                </div>
                <h1 className="text-3xl font-black text-white">
                  ADMIN CONTROL PANEL
                </h1>
                <p className="text-xs sm:text-sm text-gray-400">
                  Manage incoming customer orders, inventory stock, and merchandise products in real-time.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/store"
                  className="px-4 py-2 rounded-xl bg-card-dark border border-white/10 hover:border-main-green text-gray-200 hover:text-white text-xs font-bold transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Storefront</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-main-red text-gray-300 hover:text-main-red text-xs font-bold transition-all flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-main-green text-main-dark font-black text-xs flex items-center gap-1.5 transition-all shadow-neon-green"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>
            </div>

        {actionError && (
          <div className="mb-6 p-3 rounded-xl bg-main-red/10 border border-main-red/30 text-main-red text-xs font-medium text-center">
            {actionError}
          </div>
        )}

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

          <div className="glass-panel p-5 rounded-2xl border-white/10">
            <span className="text-[11px] font-mono text-gray-400 block mb-1 uppercase tracking-wider">
              Total Order Revenue
            </span>
            <div className="text-xl sm:text-2xl font-black text-main-green font-mono">
              {formatIDR(totalRevenue)}
            </div>
            <span className="text-[10px] text-gray-400 font-mono mt-1 block">
              From {orders.length} transactions
            </span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border-white/10">
            <span className="text-[11px] font-mono text-gray-400 block mb-1 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">
              {orders.length}
            </div>
            <span className="text-[10px] text-gray-400 font-mono mt-1 block">
              Customer orders recorded
            </span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border-white/10">
            <span className="text-[11px] font-mono text-gray-400 block mb-1 uppercase tracking-wider">
              Pending Orders
            </span>
            <div className="text-xl sm:text-2xl font-black text-yellow-400 font-mono">
              {pendingOrdersCount}
            </div>
            <span className="text-[10px] text-gray-400 font-mono mt-1 block">
              Requires confirmation
            </span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border-white/10">
            <span className="text-[11px] font-mono text-gray-400 block mb-1 uppercase tracking-wider">
              Active Catalog Items
            </span>
            <div className="text-xl sm:text-2xl font-black text-electric-cyan font-mono">
              {products.length}
            </div>
            <span className="text-[10px] text-gray-400 font-mono mt-1 block">
              {inStockCount} items in stock
            </span>
          </div>

        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-white/10 mb-6 gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-4 text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'orders'
                ? 'border-main-green text-main-green'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <span className="font-mono text-[10px]">ORD</span>
            <span>Orders Management ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-4 text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'products'
                ? 'border-main-green text-main-green'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <span className="font-mono text-[10px]">PRD</span>
            <span>Products Catalog ({products.length})</span>
          </button>
        </div>

        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="p-12 text-center glass-panel rounded-2xl border-white/10 text-gray-400">
                <div className="w-12 h-12 mx-auto mb-2 text-gray-600 flex items-center justify-center">
                  <PackageOpen className="h-8 w-8" aria-hidden="true" />
                </div>
                <p className="text-sm">No orders yet.</p>
              </div>
            ) : (
              orders.map((order) => {
                const isPending = order.status === 'Pending';
                const isConfirmed = order.status === 'Confirmed';
                const isShipped = order.status === 'Shipped';

                return (
                  <div
                    key={order.id}
                    className="p-5 sm:p-6 rounded-2xl glass-panel border border-white/10 hover:border-white/20 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    {/* Left: Customer Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-black text-main-green">
                          #{order.orderNumber}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                          isPending
                            ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                            : isConfirmed
                            ? 'bg-blue-400/20 text-blue-400 border border-blue-400/30'
                            : isShipped
                            ? 'bg-purple-400/20 text-purple-400 border border-purple-400/30'
                            : 'bg-main-green/20 text-main-green border border-main-green/30'
                        }`}>
                          {order.status}
                        </span>
                        <span className="text-[11px] font-mono text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <div className="text-xs text-gray-300">
                        <span className="font-bold text-white text-sm block">{order.customerName}</span>
                        <span>{order.customerEmail} • {order.customerPhone}</span>
                        <p className="text-gray-400 text-[11px] mt-0.5 font-mono">{order.shippingAddress}</p>
                      </div>

                      {/* Items */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {order.items.map((item) => (
                          <span
                            key={item.id}
                            className="px-2 py-1 rounded bg-black/40 border border-white/10 text-[11px] text-gray-300 font-mono"
                          >
                            {item.quantity}x {item.productName} {item.selectedSize ? `(${item.selectedSize})` : ''}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right: Payment & Action Buttons */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/10">
                      <div className="text-left lg:text-right">
                        <span className="text-[10px] font-mono text-gray-400 uppercase block">Total Amount</span>
                        <span className="text-lg font-black text-white font-mono">
                          {formatIDR(order.totalAmount)}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400 block">
                          Via {order.paymentMethod}
                        </span>
                      </div>

                      {/* Status Selector & Delete */}
                      <div className="flex items-center gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="px-3 py-1.5 rounded-xl bg-card-dark border border-white/20 text-xs font-mono text-white focus:border-main-green focus:outline-none cursor-pointer"
                        >
                          <option value="Pending">Set Pending</option>
                          <option value="Confirmed">Set Confirmed</option>
                          <option value="Shipped">Set Shipped</option>
                          <option value="Completed">Set Completed</option>
                        </select>

                        <button
                          onClick={() => handleDeleteOrder(order.id, order.orderNumber)}
                          className="p-2 rounded-xl text-gray-500 hover:text-main-red hover:bg-white/5 transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="p-4 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between"
                >
                  <div className="flex gap-3 mb-3">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-16 h-16 rounded-xl object-cover bg-black shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-mono text-main-green uppercase font-bold">
                        {prod.category}
                      </span>
                      <h4 className="text-xs font-bold text-white truncate">{prod.name}</h4>
                      <span className="text-xs font-mono font-bold text-white block mt-1">
                        {formatIDR(prod.price)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Stock:</span>
                      <input
                        type="number"
                        min="0"
                        value={prod.stock}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          handleUpdateProduct(prod.id, { stock: val, inStock: val > 0 });
                        }}
                        className="w-14 px-1.5 py-0.5 rounded bg-black/60 border border-white/20 text-white font-mono text-xs text-center"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateProduct(prod.id, { inStock: !prod.inStock })}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          prod.inStock
                            ? 'bg-main-green/20 text-main-green border border-main-green/30'
                            : 'bg-main-red/20 text-main-red border border-main-red/30'
                        }`}
                      >
                        {prod.inStock ? 'In Stock' : 'Out of Stock'}
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(prod.id, prod.name)}
                        className="p-1 rounded text-gray-500 hover:text-main-red"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}
          </>
        )}
      </main>
      </ScrollReveal>

      {/* Modal: Add New Product */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-card-dark border border-white/20 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <h3 className="text-lg font-black text-white">Add New Merchandise</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anargya 9th Gen Pit Polo Shirt"
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-secondary-dark border border-white/10 text-white focus:border-main-green focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1">Category</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value as Product['category'] })}
                    className="w-full px-3 py-2 rounded-xl bg-secondary-dark border border-white/10 text-white focus:border-main-green focus:outline-none"
                  >
                    <option value="Apparel">Apparel</option>
                    <option value="Headwear">Headwear</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Collectibles">Collectibles</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Badge</label>
                  <select
                    value={newProd.badge}
                    onChange={(e) => setNewProd({ ...newProd, badge: e.target.value as Product['badge'] })}
                    className="w-full px-3 py-2 rounded-xl bg-secondary-dark border border-white/10 text-white focus:border-main-green focus:outline-none"
                  >
                    <option value="Limited 9th Gen">Limited 9th Gen</option>
                    <option value="Best Seller">Best Seller</option>
                    <option value="Special Edition">Special Edition</option>
                    <option value="Pre-Order">Pre-Order</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1">Price (IDR) *</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    step="5000"
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-secondary-dark border border-white/10 text-white focus:border-main-green focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Initial Stock *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-secondary-dark border border-white/10 text-white focus:border-main-green focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Enhanced Product Image Section: Upload from Local, Pick Asset, or URL */}
              <div className="rounded-2xl border border-white/10 bg-secondary-dark/60 p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-gray-300 font-bold text-xs">
                    Product Image *
                  </label>
                  <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/10 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setImageMode('upload')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                        imageMode === 'upload'
                          ? 'bg-main-green text-main-dark font-bold'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Upload className="w-3 h-3" />
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('assets')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                        imageMode === 'assets'
                          ? 'bg-main-green text-main-dark font-bold'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <ImageIcon className="w-3 h-3" />
                      Team Assets
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('url')}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                        imageMode === 'url'
                          ? 'bg-main-green text-main-dark font-bold'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Link2 className="w-3 h-3" />
                      URL
                    </button>
                  </div>
                </div>

                {/* Mode 1: Upload via Local Files */}
                {imageMode === 'upload' && (
                  <div>
                    <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-white/20 hover:border-main-green/60 rounded-xl p-4 cursor-pointer bg-black/30 hover:bg-black/50 transition-all group">
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="sr-only"
                      />
                      {isUploading ? (
                        <div className="flex flex-col items-center gap-2 py-2">
                          <Loader2 className="w-6 h-6 text-main-green animate-spin" />
                          <span className="text-gray-300 font-mono text-[11px]">Uploading file to server...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 text-center">
                          <div className="p-2 rounded-full bg-main-green/10 text-main-green group-hover:scale-110 transition-transform">
                            <Upload className="w-5 h-5" />
                          </div>
                          <span className="text-white font-medium text-xs">Click to browse or drop an image</span>
                          <span className="text-gray-400 text-[10px]">Supports WEBP, PNG, JPG, SVG up to 15MB</span>
                        </div>
                      )}
                    </label>
                    {uploadError && (
                      <p className="mt-1.5 text-[11px] text-main-red font-mono">{uploadError}</p>
                    )}
                  </div>
                )}

                {/* Mode 2: Choose from Team Assets */}
                {imageMode === 'assets' && (
                  <div className="space-y-2">
                    <p className="text-[10px] text-gray-400">
                      Pick directly from public assets (including Tee, Sticker Pack, Tumbler, Enamel Pin):
                    </p>
                    <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1 bg-black/30 rounded-xl border border-white/5 custom-scrollbar">
                      {availableAssets.map((asset) => {
                        const isSelected = newProd.image === asset.url;
                        return (
                          <button
                            key={asset.url}
                            type="button"
                            onClick={() => setNewProd({ ...newProd, image: asset.url })}
                            className={`group relative rounded-lg overflow-hidden border p-1 flex flex-col items-center text-left transition-all ${
                              isSelected
                                ? 'border-main-green bg-main-green/15 ring-2 ring-main-green/30'
                                : 'border-white/10 hover:border-white/30 bg-black/40'
                            }`}
                          >
                            <img
                              src={asset.url}
                              alt={asset.name}
                              className="w-full h-12 object-contain rounded bg-black/60"
                            />
                            <span className="mt-1 text-[9px] font-mono text-gray-300 truncate w-full text-center">
                              {asset.name}
                            </span>
                            {isSelected && (
                              <div className="absolute top-1 right-1 bg-main-green text-main-dark rounded-full p-0.5 shadow-md">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Mode 3: Custom URL */}
                {imageMode === 'url' && (
                  <div>
                    <input
                      type="url"
                      placeholder="https://... or /images/..."
                      value={newProd.image}
                      onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-secondary-dark border border-white/10 text-white focus:border-main-green focus:outline-none font-mono text-[11px]"
                    />
                  </div>
                )}

                {/* Live Preview Bar */}
                {newProd.image && (
                  <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                    <img
                      src={newProd.image}
                      alt="Selected preview"
                      className="w-12 h-12 rounded-lg object-contain bg-black border border-white/15 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-gray-400 block font-mono">Selected Image Source:</span>
                      <p className="text-[11px] font-mono text-main-green truncate">{newProd.image}</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detailed material spec, telemetry inspiration, features..."
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-secondary-dark border border-white/10 text-white focus:border-main-green focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-main-green text-main-dark font-black text-xs shadow-neon-green"
              >
                Save & Publish to Storefront
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <ScrollReveal>
        <Footer />
      </ScrollReveal>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
