'use client';

import React from 'react';

const TIER_1 = [
  { name: 'Anargya 40 Wujudkan', logo: '/images/sponsors/ayo-rek.png' },
  { name: 'RapidHarness', logo: '/images/sponsors/rapidharness.png' },
  { name: 'Batemo', logo: '/images/sponsors/Batemo.png' },
];

const TIER_2 = [
  { name: 'Hasston', logo: '/images/sponsors/Hasston-Gold.png' },
  { name: 'Spindo', logo: '/images/sponsors/Spindo-Silver.png' },
];

const TIER_3 = [
  { name: 'PLN Mobile', logo: '/images/sponsors/Pln-Mobile.png' },
  { name: 'TDR Racing', logo: '/images/sponsors/TDR.png' },
  { name: 'PT RAN Andalan Indonesia', logo: '/images/sponsors/RAN.png' },
];

const MARQUEE_SPONSORS = [
  { name: 'Nexa Logistic', logo: '/images/sponsors/Nexo.png' },
  { name: 'Wilson Cables', logo: '/images/sponsors/Wilson.png' },
  { name: 'Grab', logo: '/images/sponsors/Grab.png' },
  { name: 'Bender', logo: '/images/sponsors/Bender.png' },
  { name: 'PGN Saka', logo: '/images/sponsors/PGN-Saka.png' },
  { name: 'Suspension', logo: '/images/sponsors/Suspension.png' },
  { name: 'IPG', logo: '/images/sponsors/IPG.png' },
  { name: 'Tridiku', logo: '/images/sponsors/Tridiku.png' },
  { name: 'SDI', logo: '/images/sponsors/SDI.png' },
  { name: 'Spectrum', logo: '/images/sponsors/Spectrum.png' },
  { name: 'Honda', logo: '/images/sponsors/Honda.png' },
  { name: 'Memoji Studio', logo: '/images/sponsors/Memoji.png' },
  { name: 'Belkote', logo: '/images/sponsors/Belkote.png' },
  { name: 'PJ Graphics', logo: '/images/sponsors/PJ-Graphics.png' },
  { name: 'Blink Car Studio', logo: '/images/sponsors/Blink.png' },
  { name: 'Seni Jayaplast', logo: '/images/sponsors/Seni-Jayaplast.png' },
  { name: 'Bodok LNG', logo: '/images/sponsors/Bodok-LNG.png' },
  { name: 'Pertamina', logo: '/images/sponsors/Pertamina.png' },
  { name: 'JNE', logo: '/images/sponsors/JNE.png' },
];

export const SponsorsSection: React.FC = () => {
  return (
    <section id="sponsors" className="py-20 bg-main-dark border-t border-white/10 relative overflow-hidden font-sfui">
      
      {/* Ambient background glows */}
      <div className="bg-main-green/5 pointer-events-none absolute -left-[8vw] top-[10%] h-[22vh] w-[28vw] rounded-full blur-[90px] md:h-[28vh] md:w-[22vw] md:blur-[150px]" />
      <div className="bg-main-red/5 pointer-events-none absolute bottom-[5%] left-[40vw] h-[18vh] w-[25vw] rounded-full blur-[80px] md:h-[22vh] md:w-[20vw] md:blur-[130px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Our Sponsors
          </h2>
          <p className="text-main-gray text-xs sm:text-sm mt-2 max-w-xl mx-auto">
            Accelerating Indonesia transition to high-performance electric mobility with our valued industry collaborators.
          </p>
        </div>

        {/* Tier 1 Sponsors (3 Large Cards) */}
        <div className="mb-6 flex w-full flex-wrap items-center justify-center gap-x-8 gap-y-4 md:mb-8 md:gap-x-12">
          {TIER_1.map((sp) => (
            <figure key={sp.name} className="group relative h-[90px] w-[220px] md:h-[120px] md:w-[280px]">
              <div className="absolute inset-0 rounded-xl bg-white p-3.5 transition-transform duration-300 ease-out group-hover:scale-105 shadow-md flex items-center justify-center">
                <img
                  src={sp.logo}
                  alt={sp.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </figure>
          ))}
        </div>

        {/* Tier 2 & 3 Sponsors */}
        <div className="mb-12 flex w-full max-w-[900px] flex-col items-center justify-center gap-4 md:gap-6">
          
          {/* Tier 2 (2 Mid Cards) */}
          <div className="flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-4 md:gap-x-10 md:gap-y-6">
            {TIER_2.map((sp) => (
              <figure key={sp.name} className="group relative flex-shrink-0 h-[85px] w-[190px] md:h-[110px] md:w-[260px]">
                <div className="absolute inset-0 rounded-xl bg-white p-3 transition-transform duration-300 ease-out group-hover:scale-105 shadow-md flex items-center justify-center">
                  <img
                    src={sp.logo}
                    alt={sp.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </figure>
            ))}
          </div>

          {/* Tier 3 (3 Cards) */}
          <div className="flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-4 md:gap-x-10 md:gap-y-6">
            {TIER_3.map((sp) => (
              <figure key={sp.name} className="group relative flex-shrink-0 h-[75px] w-[160px] md:h-[95px] md:w-[220px]">
                <div className="absolute inset-0 rounded-xl bg-white p-3 transition-transform duration-300 ease-out group-hover:scale-105 shadow-md flex items-center justify-center">
                  <img
                    src={sp.logo}
                    alt={sp.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </figure>
            ))}
          </div>

        </div>

      </div>

      {/* Infinite Marquee Ticker */}
      <div className="relative w-full overflow-hidden py-3 border-t border-white/5">
        
        {/* Gradient edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 md:w-32 bg-gradient-to-r from-main-dark to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 md:w-32 bg-gradient-to-l from-main-dark to-transparent" />

        <div className="animate-marquee flex w-max items-center gap-x-5 hover:[animation-play-state:paused] md:gap-x-8">
          {[...MARQUEE_SPONSORS, ...MARQUEE_SPONSORS].map((sp, idx) => (
            <figure key={`${sp.name}-${idx}`} className="group relative flex-shrink-0 h-[65px] w-[130px] md:h-[80px] md:w-[160px]">
              <div className="absolute inset-0 rounded-lg bg-white p-2.5 transition-transform duration-300 ease-out group-hover:scale-105 flex items-center justify-center shadow-sm">
                <img
                  src={sp.logo}
                  alt={sp.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </figure>
          ))}
        </div>

      </div>

    </section>
  );
};
