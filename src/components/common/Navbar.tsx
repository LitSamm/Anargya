'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '../../context/StoreContext';
import { 
  ArrowDownToLine,
  ChevronRight,
  Menu, 
  X, 
  ShoppingBag
} from 'lucide-react';

interface NavbarProps {
  onOpenCart?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart }) => {
  const pathname = usePathname();
  const { cartCount, isOffline, triggerInstall } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'The Fleet', href: '/#cars' },
    { label: 'Achievements', href: '/#achievements' },
    { label: 'Divisions', href: '/#divisions' },
    { label: 'Store', href: '/store', badge: 'Merch' },
    { label: 'Admin', href: '/admin' },
  ];

  return (
    <>
      <header className={`z-40 w-full border-b border-white/10 backdrop-blur-xl transition-all font-sfui ${
        pathname === '/'
          ? 'absolute left-0 top-0 bg-black/25'
          : 'sticky top-0 bg-main-dark/85'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group min-w-0">
            <img
              src="/images/LOGO-POLOS.png"
              alt="Anargya"
              className="h-8 sm:h-9 w-auto object-contain brightness-110"
            />
            <div className="hidden sm:flex flex-col border-l border-white/15 pl-3">
              <span className="font-bold text-sm tracking-wide text-white leading-none">Anargya</span>
              <span className="text-[9px] uppercase tracking-[0.22em] text-main-green mt-1 font-semibold">ITS EV Team</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {isOffline && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-main-red/10 border border-main-red/30 text-main-red text-xs font-mono">
                <span className="font-bold">●</span>
                <span>OFFLINE</span>
              </div>
            )}

            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-main-green/50 text-white transition-all hover:scale-105"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-main-green text-main-dark text-[11px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex items-center gap-2 p-2.5 rounded-full bg-white/5 border border-white/15 text-white hover:border-main-green/60 hover:text-main-green transition-colors"
              aria-label="Open navigation sidebar"
              aria-expanded={mobileMenuOpen}
              aria-controls="site-sidebar"
            >
              <Menu className="w-4 h-4" />
              <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-[0.16em]">Menu</span>
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 font-sfui">
          <button
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation sidebar"
          />
          <aside
            id="site-sidebar"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="futuristic-sidebar relative flex h-full w-[min(22rem,calc(100vw-2rem))] flex-col border-r border-main-green/20 px-6 py-6 shadow-[20px_0_80px_rgba(0,0,0,0.6)] animate-[sidebar-enter_.28s_ease-out]"
          >
            <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-6">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3">
                <img src="/images/LOGO-POLOS.png" alt="Anargya" className="h-8 w-auto object-contain" />
                <div>
                  <p className="font-codec-cold text-sm tracking-wider text-white">ANARGYA</p>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.24em] text-main-green">ITS EV TEAM</p>
                </div>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-full border border-white/10 p-2 text-white/70 transition-colors hover:border-main-green/50 hover:text-main-green"
                aria-label="Close navigation sidebar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative z-10 mt-8 mb-4 flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.22em] text-main-green">
              <span className="h-px w-6 bg-main-green" />
              Navigation system
            </div>
            <nav className="relative z-10 flex flex-col gap-2" aria-label="Main navigation">
              {navLinks.map((link, index) => {
                const isActive = pathname === link.href || (link.href === '/' && pathname === '/');
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`group flex items-center justify-between border px-4 py-4 transition-all ${
                      isActive
                        ? 'border-main-green/35 bg-main-green/10 text-white'
                        : 'border-transparent text-white/65 hover:border-white/10 hover:bg-white/[0.04] hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-4">
                      <span className={`font-mono text-[10px] ${isActive ? 'text-main-green' : 'text-white/30'}`}>
                        0{index + 1}
                      </span>
                      <span className="text-sm font-medium tracking-wide">{link.label}</span>
                      {link.badge && (
                        <span className="border border-main-green/30 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-main-green">
                          {link.badge}
                        </span>
                      )}
                    </span>
                    <ChevronRight className="h-4 w-4 text-main-green opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                  </Link>
                );
              })}
            </nav>

            <div className="relative z-10 mt-auto border-t border-white/10 pt-5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  triggerInstall();
                }}
                className="flex w-full items-center justify-between border border-main-green/35 bg-main-green/10 px-4 py-3 text-xs font-semibold tracking-wide text-main-green transition-colors hover:bg-main-green hover:text-main-dark"
                title="Install Anargya Progressive Web App"
              >
                <span>Install Anargya App</span>
                <ArrowDownToLine className="h-4 w-4" />
              </button>
              <div className="mt-5 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">
                <span>Formula Student Electric</span>
                <span>ITS · 2026</span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
