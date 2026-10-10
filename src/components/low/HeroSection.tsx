'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const ScrambleNumber: React.FC<{ value: string; duration?: number }> = ({ value, duration = 1200 }) => {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const isDecimal = value.includes('.');
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (progress < 1) {
        if (isDecimal) {
          const randDec = (Math.random() * 9).toFixed(1);
          setDisplay(randDec);
        } else {
          const numDigits = value.length;
          const min = Math.pow(10, numDigits - 1);
          const max = Math.pow(10, numDigits) - 1;
          const randInt = Math.floor(min + Math.random() * (max - min + 1));
          setDisplay(String(randInt));
        }
      } else {
        setDisplay(value);
        clearInterval(interval);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [value, duration]);

  return <span>{display}</span>;
};

export const HeroSection: React.FC = () => {
  return (
    <>
    <section className="relative h-[100svh] flex flex-col justify-end overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <img
          src="/images/FSAE_2025_ascii.webp"
          alt=""
          className="h-full w-full object-cover object-[68%_center]"
        />
        <div
          className="absolute inset-0 w-full"
          style={{
            backgroundImage:
              'linear-gradient(to top, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0) 62.5%)',
          }}
        />
      </div>

      <div className="relative z-20 flex flex-col items-center gap-8 px-6 md:px-12 lg:px-24 pb-12 md:pb-16 lg:pb-24">
        <div className="flex w-full justify-center">
          <h1
            className="font-codec-cold font-medium uppercase select-none text-center text-4xl sm:text-6xl md:text-7xl lg:text-[80px] leading-none text-main-green"
            style={{
              filter: 'drop-shadow(0 0 30px rgba(41, 217, 112, 0.9)) drop-shadow(0 0 60px rgba(41, 217, 112, 0.45))',
            }}
          >
            ANARGYA
          </h1>
        </div>

        <p className="font-sfui text-white text-sm md:text-lg lg:text-xl text-center tracking-tight leading-relaxed max-w-5xl mx-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] drop-shadow-[0_0_20px_rgba(41,217,112,0.22)]">
          Anargya is a student team from Institut Teknologi Sepuluh Nopember focused on building and
          developing innovative electric formula cars for the future of racing. Founded in 2018, Anargya
          has grown into a consistent competitor at Formula SAE Japan, representing Indonesia on the international stage.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/#cars"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-main-red px-6 sm:px-8 py-3.5 tracking-wider hover:bg-white hover:text-main-red transition-colors"
          >
            Explore The Fleet
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
          <Link
            href="/store"
            className="inline-flex items-center text-xs sm:text-sm font-bold text-white border-2 border-white/25 px-6 sm:px-8 py-3 tracking-wider hover:bg-white hover:text-main-dark transition-colors"
          >
            Team Store
          </Link>
        </div>
      </div>
    </section>

    <div className="relative w-full bg-main-red">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/20">
          {[
            { label: 'Acceleration 0-100', value: '3.4', unit: 'sec' },
            { label: 'Top Speed', value: '125', unit: 'km/h' },
            { label: 'Tractive System', value: '400', unit: 'V' },
            { label: 'Curb Weight', value: '198', unit: 'kg' },
          ].map((stat) => (
            <div key={stat.label} className="py-5 sm:py-6 px-4 sm:px-8 flex flex-col justify-center">
              <span className="font-sfui text-[11px] font-semibold text-white/75 mb-1">
                {stat.label}
              </span>
              <div className="font-sfui text-2xl sm:text-4xl font-heavy text-white tabular-nums">
                <ScrambleNumber value={stat.value} />
                <span className="font-sfui text-[10px] sm:text-sm font-bold ml-1.5 align-middle">{stat.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};
