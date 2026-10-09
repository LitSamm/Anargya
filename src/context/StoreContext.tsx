'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, OrderItem } from '../types';
import { INITIAL_PRODUCTS } from '../data/mockData';
import { 
  getProducts as fetchDbProducts, 
  createProduct as createDbProduct, 
  updateProduct as updateDbProduct, 
  deleteProduct as deleteDbProduct 
} from '../app/actions/product';
import { 
  getOrders as fetchDbOrders, 
  createOrder as createDbOrder, 
  updateOrderStatus as updateDbOrderStatus, 
  deleteOrder as deleteDbOrder 
} from '../app/actions/order';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface StoreContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: OrderItem[];
  addToCart: (product: Product, size?: string) => void;
  removeFromCart: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  deleteOrder: (orderId: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  isOffline: boolean;
  installPrompt: any;
  triggerInstall: () => Promise<void>;
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load from localStorage & sync from Supabase
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const catalogVersion = 'merch-tee-sticker-tumbler-enamel';
        const savedVersion = localStorage.getItem('anargya_catalog_version');
        if (savedVersion !== catalogVersion) {
          setProducts(INITIAL_PRODUCTS);
          localStorage.setItem('anargya_catalog_version', catalogVersion);
          localStorage.setItem('anargya_products', JSON.stringify(INITIAL_PRODUCTS));
        } else {
          const savedProducts = localStorage.getItem('anargya_products');
          if (savedProducts) setProducts(JSON.parse(savedProducts));
        }

        const savedCart = localStorage.getItem('anargya_cart');
        if (savedCart) setCart(JSON.parse(savedCart));

        const savedOrders = localStorage.getItem('anargya_orders');
        if (savedOrders) setOrders(JSON.parse(savedOrders));
      } catch (e) {
        console.error('Failed reading from localStorage', e);
      }

      // Check online / offline
      setIsOffline(!navigator.onLine);
      const handleOnline = () => {
        setIsOffline(false);
        addToast('Connected to Supabase live network.', 'success');
      };
      const handleOffline = () => {
        setIsOffline(true);
        addToast('Running on cached offline storage.', 'warning');
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // PWA Install prompt listener
      const handleBeforeInstall = (e: Event) => {
        e.preventDefault();
        setInstallPrompt(e);
      };
      window.addEventListener('beforeinstallprompt', handleBeforeInstall);

      // Register Service Worker
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
          .then(() => console.log('Anargya PWA Service Worker Registered'))
          .catch((err) => console.log('Service Worker reg failed:', err));
      }

      // Sync products from DuckDB backend
      const syncFromDuckDb = async () => {
        try {
          const res = await fetch('/api/products');
          if (res.ok) {
            const data = (await res.json()) as { products?: Product[] };
            if (data.products && Array.isArray(data.products) && data.products.length > 0) {
              setProducts(data.products);
              localStorage.setItem('anargya_products', JSON.stringify(data.products));
            }
          }
        } catch (err) {
          console.error('Failed syncing from DuckDB:', err);
        }
      };

      syncFromDuckDb();

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      };
    }
  }, []);

  // Sync products to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('anargya_products', JSON.stringify(products));
    }
  }, [products]);

  // Sync cart to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('anargya_cart', JSON.stringify(cart));
    }
  }, [cart]);

  // Sync orders to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('anargya_orders', JSON.stringify(orders));
    }
  }, [orders]);

  const addToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

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
      prev.filter(
        (item) => !(item.productId === productId && item.selectedSize === size)
      )
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

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.productPrice * item.quantity,
    0
  );

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Order => {
    const newId = `ARG-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: Order = {
      ...orderData,
      id: newId,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    
    // Optimistic UI update
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    addToast(`Order ${newId} placed successfully!`, 'success');

    // Persist to Supabase in background
    createDbOrder({
      orderNumber: newId,
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
    }).catch((err) => {
      console.error('Failed saving order to Supabase:', err);
    });

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    addToast(`Order ${orderId} marked as ${status}`, 'info');

    // Update in Supabase
    updateDbOrderStatus(orderId, status).catch((err) => {
      console.error('Failed updating order status in Supabase:', err);
    });
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    addToast(`Order ${orderId} removed`, 'info');

    // Delete in Supabase
    deleteDbOrder(orderId).catch((err) => {
      console.error('Failed deleting order in Supabase:', err);
    });
  };

  const addProduct = (prodData: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => {
    const tempId = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...prodData,
      id: tempId,
      rating: 5.0,
      reviewsCount: 1,
    };
    setProducts((prev) => [newProduct, ...prev]);
    addToast(`Product "${newProduct.name}" added to catalog!`, 'success');

    // Persist to DuckDB backend
    fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prodData),
    })
      .then((res) => res.json())
      .then((data: { success?: boolean; product?: Product }) => {
        if (data.success && data.product) {
          setProducts((prev) =>
            prev.map((p) => (p.id === tempId ? data.product! : p))
          );
        }
      })
      .catch((err) => {
        console.error('Failed creating product in DuckDB:', err);
      });
  };

  const updateProduct = (product: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? product : p))
    );
    addToast(`Product "${product.name}" updated!`, 'success');

    // Persist to DuckDB backend
    fetch(`/api/admin/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    }).catch((err) => {
      console.error('Failed updating product in DuckDB:', err);
    });
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addToast('Product deleted from catalog', 'info');

    // Delete in DuckDB backend
    fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
    }).catch((err) => {
      console.error('Failed deleting product in DuckDB:', err);
    });
  };

  const triggerInstall = async () => {
    if (!installPrompt) {
      addToast('PWA is already installed or your browser doesn\'t support automatic prompt. Add to home screen from browser menu.', 'info');
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
        setProducts,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        orders,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        addProduct,
        updateProduct,
        deleteProduct,
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
