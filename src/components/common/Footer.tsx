import React from 'react';
import Link from 'next/link';
import { Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-secondary-dark relative overflow-hidden font-sfui">
      {/* Top subtle border glow */}
      <div className="absolute top-0 left-1/3 w-80 h-1 bg-main-green/30 blur-sm pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          
          {/* Col 1 & 2: Branding & Philosophy */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/LOGO-ANARGYA-INLINE.webp"
                alt="Anargya ITS Formula EV Team"
                className="h-8 w-auto object-contain"
              />
            </div>

            <p className="text-main-gray text-xs sm:text-sm leading-relaxed max-w-sm font-regular">
              Anargya derives from Sanskrit meaning <span className="text-main-green font-medium">"Infinite Value"</span>. 
              We are Institut Teknologi Sepuluh Nopember's premier collegiate electric formula race team, advancing 
              sustainable motorsport technology through rigorous telemetry, digital-twin modeling, and international competition.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://instagram.com/anargya.its"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-secondary-gray hover:bg-main-green hover:text-main-dark flex items-center justify-center text-main-gray transition-all font-mono text-xs"
                aria-label="Instagram"
              >
                IG
              </a>
              <a
                href="https://linkedin.com/company/anargya-its"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-secondary-gray hover:bg-main-green hover:text-main-dark flex items-center justify-center text-main-gray transition-all font-mono text-xs"
                aria-label="LinkedIn"
              >
                IN
              </a>
              <a
                href="https://youtube.com/@anargyaitsteam1003"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-secondary-gray hover:bg-main-green hover:text-main-dark flex items-center justify-center text-main-gray transition-all font-mono text-xs"
                aria-label="YouTube"
              >
                YT
              </a>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-main-green mb-4 font-bold">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-main-gray font-regular">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link href="/#cars" className="hover:text-white transition-colors">
                  The Fleet (Mark 1 - 6)
                </Link>
              </li>
              <li>
                <Link href="/#achievements" className="hover:text-white transition-colors">
                  FSAE Japan Awards
                </Link>
              </li>
              <li>
                <Link href="/#divisions" className="hover:text-white transition-colors">
                  Team Divisions
                </Link>
              </li>
              <li>
                <Link href="/store" className="hover:text-main-green transition-colors font-medium">
                  Official Merch Store
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & PWA */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-main-green mb-4 font-bold">
              Platform & Tech
            </h4>
            <ul className="space-y-2 text-sm text-main-gray font-regular">
              <li>
                <Link href="/admin" className="hover:text-white transition-colors flex items-center gap-1">
                  Admin Dashboard
                  <span className="font-mono text-main-green text-xs">→</span>
                </Link>
              </li>
              <li>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary-gray text-main-gray inline-block">
                  Next.js App Router
                </span>
              </li>
              <li>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-main-green/15 text-main-green inline-block font-medium">
                  PWA Ready (Workbox)
                </span>
              </li>
            </ul>
          </div>

          {/* Col 5: Headquarter */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-main-green mb-4 font-bold">
              Headquarters
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-main-gray font-regular">
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-main-green" aria-hidden="true" />
                <span>
                  Gedung Riset Mobil Listrik (PUI-SKO), Kampus ITS Sukolilo, Surabaya 60111
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-main-green" aria-hidden="true" />
                <span className="font-mono text-xs">contact@anargyaits.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-main-gray">
          <div>
            © 2026 Anargya ITS EV Team (9th Generation). All Rights Reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Institut Teknologi Sepuluh Nopember</span>
            <span>•</span>
            <span className="text-main-green">Visual Media Branding Special Task</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
