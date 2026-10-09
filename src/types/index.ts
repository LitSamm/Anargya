export interface CarModel {
  id: string;
  name: string;
  generation: string;
  year: number;
  topSpeed: string;
  acceleration: string;
  motorType: string;
  batteryCapacity: string;
  weight: string;
  chassis: string;
  description: string;
  image: string;
  badge?: string;
  achievements: string[];
  specs: {
    label: string;
    value: string;
  }[];
}

export interface Product {
  id: string;
  name: string;
  category: 'Apparel' | 'Headwear' | 'Accessories' | 'Collectibles';
  price: number;
  originalPrice?: number;
  stock: number;
  description: string;
  image: string;
  badge?: 'Best Seller' | 'Limited 9th Gen' | 'Pre-Order' | 'Special Edition';
  sizes?: string[];
  rating: number;
  reviewsCount: number;
  inStock: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  quantity: number;
  selectedSize?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  courier: string;
  paymentMethod: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Completed';
  createdAt: string;
}

export interface Achievement {
  id: string;
  year: number;
  competition: string;
  award: string;
  rank: '1st Place' | '2nd Place' | '3rd Place' | 'Finalist';
  category: string;
  location: string;
  description: string;
  carUsed: string;
  image?: string;
}

export interface Division {
  id: string;
  name: string;
  code: string;
  leadRole: string;
  description: string;
  tasks: string[];
  icon: string;
  memberCount: number;
}
