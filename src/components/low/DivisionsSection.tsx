'use client';

import React from 'react';
import { DIVISIONS_DATA } from '../../data/mockData';
import { motion, useReducedMotion } from 'framer-motion';

export const DivisionsSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const viewport = { once: false, amount: 0.2 };

  return (
    <section
      id="divisions"
      className="relative overflow-hidden border-t border-b border-white/10 bg-main-dark py-24 font-sfui sm:py-28"
    >
      <div className="pointer-events-none absolute -right-24 top-12 h-80 w-80 rounded-full bg-main-green/5 blur-[150px]" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-main-red/5 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 flex flex-col gap-6 sm:mb-16 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <h2 className="text-4xl font-bold leading-none tracking-tight text-white sm:text-6xl">
              Meet the <span className="text-main-red">Divisions</span>
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-main-gray sm:text-base">
              A multidisciplinary team building every part of Anargya, on and off the track.
            </p>
          </div>

        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-4">
          {DIVISIONS_DATA.map((division, idx) => {
            const isFeatured = idx === 0;
            const isVMB = division.code === 'VMB-DIV';
            const mutedTextClass = isFeatured ? 'text-white/75' : 'text-main-gray';
            const dividerClass = isFeatured ? 'border-white/20' : 'border-white/10';

            return (
              <motion.article
                key={division.id}
                initial={{
                  opacity: 0,
                  y: shouldReduceMotion ? 0 : 32,
                  scale: shouldReduceMotion ? 1 : 0.98,
                }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={viewport}
                transition={{
                  duration: 0.55,
                  delay: shouldReduceMotion ? 0 : idx * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={shouldReduceMotion ? undefined : { y: -6 }}
                className={`group flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-colors duration-300 sm:p-7 ${
                  isFeatured
                    ? 'border-main-red/70 bg-main-red text-white shadow-[0_16px_50px_rgba(235,65,63,0.12)]'
                    : 'border-white/10 bg-secondary-dark/80 text-white hover:border-main-green/40'
                }`}
              >
                <div className="mb-7 flex items-start justify-between gap-3">
                  <div>
                    <span className={`mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] ${mutedTextClass}`}>
                      Division {String(idx + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-codec-cold text-2xl font-heavy leading-none tracking-tight sm:text-3xl">
                      {division.code}
                    </h3>
                    <span className={`mt-2 block text-[10px] font-bold uppercase tracking-wider ${mutedTextClass}`}>
                      {division.name}
                    </span>
                  </div>
                  <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${isFeatured ? 'bg-white' : 'bg-main-green'}`} />
                </div>

                <p className={`mb-7 flex-grow text-sm leading-relaxed ${mutedTextClass}`}>
                  {division.description}
                </p>

                <div className={`mb-6 space-y-3 border-t pt-5 ${dividerClass}`}>
                  <div className="flex items-start justify-between gap-3 text-xs">
                    <span className={`shrink-0 font-bold uppercase tracking-wider ${mutedTextClass}`}>Head</span>
                    <span className="text-right font-semibold">{division.leadRole}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className={`font-bold uppercase tracking-wider ${mutedTextClass}`}>Team size</span>
                    <span className="font-semibold">{division.memberCount} Members</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {division.tasks.slice(0, 3).map((task) => (
                    <span
                      key={task}
                      className={`rounded-md border px-2.5 py-1.5 text-[9px] font-bold uppercase leading-snug tracking-wide ${
                        isFeatured
                          ? 'border-white/25 bg-white/5 text-white/90'
                          : 'border-white/10 bg-white/[0.03] text-white/65'
                      }`}
                    >
                      {task}
                    </span>
                  ))}
                </div>

                {isVMB && (
                  <div className="mt-6">
                    <span className="inline-flex rounded-full bg-main-green px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-main-dark">
                      Now Hiring For 9th Gen
                    </span>
                  </div>
                )}
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
