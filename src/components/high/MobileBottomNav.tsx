'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '../../context/StoreContext';
import { Activity, Home, Settings, ShoppingBag, Trophy } from 'lucide-react';

interface MobileBottomNavProps {
  onOpenCart?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenCart }) => {
  const pathname = usePathname();
  const { cartCount } = useStore();

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Fleet', href: '/#cars', icon: Activity },
    { label: 'Awards', href: '/#achievements', icon: Trophy },
    { label: 'Store', href: '/store', icon: ShoppingBag },
    { label: 'Admin', href: '/admin', icon: Settings },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-secondary-dark/95 backdrop-blur-xl border-t border-white/10 px-3 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
                isActive
                  ? 'text-main-green font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="relative">
                <item.icon className="w-5 h-5" strokeWidth={1.8} aria-hidden="true" />
                {item.label === 'Store' && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-main-green text-main-dark text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="font-codec-cold text-[10px] tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
