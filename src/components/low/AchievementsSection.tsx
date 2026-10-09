'use client';

import React from 'react';
import { ACHIEVEMENTS_DATA } from '../../data/mockData';

export const AchievementsSection: React.FC = () => {
  const secondaryAchs = ACHIEVEMENTS_DATA.slice(1, 3);

  return (
    <section id="achievements" className="py-24 bg-main-dark border-t border-b border-white/10 font-sfui relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-4 leading-none">
            Our Latest <br className="sm:hidden" /> Achievements
          </h2>
          <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Marking years of continuous podium finishes at international Student Formula competitions.
          </p>
        </div>

        {/* Main Showcase Banner: Full Laurels Trophy Image Directly */}
        <div className="mb-8 rounded-2xl bg-secondary-dark/60 border border-white/10 p-4 sm:p-8 lg:p-12 flex items-center justify-center">
          <img
            src="/images/achievements-anargya-2025.png"
            alt="Anargya FSAE Japan Achievement Laurels"
            className="w-full max-h-[520px] object-contain filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)]"
          />
        </div>

        {/* Secondary Achievement Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {secondaryAchs.map((ach) => (
            <div
              key={ach.id}
              className="group relative overflow-hidden rounded-xl h-[340px] sm:h-[380px] bg-secondary-dark border border-white/10"
            >
              {ach.image && (
                <img
                  src={ach.image}
                  alt={ach.award}
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />

              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-left">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-3 py-1 bg-main-red text-white text-[10px] font-semibold tracking-wider rounded-sm">
                    {ach.rank}
                  </span>
                  <span className="px-3 py-1 bg-white/10 text-white text-[10px] font-semibold tracking-wider backdrop-blur-md rounded-sm border border-white/10">
                    {ach.year}
                  </span>
                </div>

                <h3 className="text-xl sm:text-3xl font-bold text-white leading-tight mb-2 tracking-tight">
                  {ach.award}
                </h3>

                <p className="text-white/80 font-medium text-xs sm:text-sm max-w-xl mb-2">
                  {ach.competition}: {ach.category}
                </p>

                <p className="text-white/60 text-xs max-w-lg hidden sm:block leading-relaxed">
                  {ach.description}
                </p>
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
};
