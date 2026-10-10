'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, OrderItem } from '../types';
import { INITIAL_PRODUCTS } from '../data/mockData';
import { getProducts } from '../app/actions/product';
import { createOrder as createDbOrder } from '../app/actions/order';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

type CreateOrderInput = Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>;
type CreateOrderResult = { success: true; order: Order } | { success: false; error: string };

interface StoreContextType {
  products: Product[];
  cart: OrderItem[];
  addToCart: (product: Product, size?: string) => void;
  removeFromCart: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  createOrder: (orderData: CreateOrderInput) => Promise<CreateOrderResult>;
  isOffline: boolean;
  installPrompt: any;
  triggerInstall: () => Promise<void>;
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'anargya_cart';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load cart from localStorage (the only client-only state) & fetch live catalog
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) setCart(JSON.parse(savedCart));
    } catch (e) {
      console.error('Failed reading cart from localStorage', e);
    }

    setIsOffline(!navigator.onLine);
    const handleOnline = () => {
      setIsOffline(false);
      addToast('Back online — catalog is live.', 'success');
    };
    const handleOffline = () => {
      setIsOffline(true);
      addToast('Offline — showing last cached catalog.', 'warning');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('Anargya PWA Service Worker Registered'))
        .catch((err) => console.log('Service Worker reg failed:', err));
    }

    getProducts().then((res) => {
      if (res.success && res.data) setProducts(res.data);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product: Product, size?: string) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.productId === product.id && item.selectedSize === size
      );
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          productPrice: product.price,
          productImage: product.image,
          quantity: 1,
          selectedSize: size,
        },
      ];
    });
    addToast(`"${product.name}" added to cart!`, 'success');
  };

  const removeFromCart = (productId: string, size?: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.productId === productId && item.selectedSize === size))
    );
    addToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId && item.selectedSize === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((total, item) => total + item.productPrice * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const createOrder = async (orderData: CreateOrderInput): Promise<CreateOrderResult> => {
    const res = await createDbOrder({
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      shippingAddress: orderData.shippingAddress,
      courier: orderData.courier,
      paymentMethod: orderData.paymentMethod,
      totalAmount: orderData.totalAmount,
      items: orderData.items.map((it) => ({
        productId: it.productId,
        productName: it.productName,
        productPrice: it.productPrice,
        productImage: it.productImage,
        selectedSize: it.selectedSize,
        quantity: it.quantity,
      })),
    });

    if (!res.success || !res.data) {
      const errorMsg = 'error' in res && res.error ? res.error : 'Failed to place order';
      addToast(errorMsg, 'warning');
      return { success: false, error: errorMsg };
    }

    const order: Order = {
      id: res.data.id,
      orderNumber: res.data.orderNumber,
      customerName: res.data.customerName,
      customerEmail: res.data.customerEmail,
      customerPhone: res.data.customerPhone ?? undefined,
      shippingAddress: res.data.shippingAddress ?? undefined,
      courier: res.data.courier ?? undefined,
      paymentMethod: res.data.paymentMethod ?? undefined,
      totalAmount: res.data.totalAmount,
      status: res.data.status as Order['status'],
      createdAt: res.data.createdAt.toString(),
      items: res.data.items.map((it) => ({
        productId: it.productId,
        productName: it.productName,
        productPrice: it.productPrice,
        productImage: it.productImage ?? undefined,
        selectedSize: it.selectedSize ?? undefined,
        quantity: it.quantity,
      })),
    };

    clearCart();
    addToast(`Order ${order.orderNumber} placed successfully!`, 'success');
    return { success: true, order };
  };

  const triggerInstall = async () => {
    if (!installPrompt) {
      addToast("PWA is already installed or your browser doesn't support automatic prompt. Add to home screen from browser menu.", 'info');
      return;
    }
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      addToast('Thank you for installing Anargya App!', 'success');
      setInstallPrompt(null);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        createOrder,
        isOffline,
        installPrompt,
        triggerInstall,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
