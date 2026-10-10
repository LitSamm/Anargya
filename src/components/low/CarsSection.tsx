'use client';

import React, { useState } from 'react';
import { CARS_DATA } from '../../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const FEATURED_CARS = CARS_DATA.filter(
  (car) => car.id !== 'mark-6' && car.id !== 'mark-1-to-3',
);

export const CarsSection: React.FC = () => {
  const [carIndex, setCarIndex] = useState<number>(0);

  const selectedCar = FEATURED_CARS[carIndex];

  const speedVal = selectedCar.topSpeed.replace(/[^0-9.]/g, '') || '115';
  const accelVal = selectedCar.acceleration.split('s')[0] || '3.8';
  const batteryVal = selectedCar.batteryCapacity.split(' ')[0] || '5.8';

  return (
    <section id="cars" className="py-24 sm:py-32 relative overflow-hidden bg-main-dark border-t border-b border-white/10 select-none font-sfui">
      
      {/* Top & Bottom gradient fades (Antasena style) */}
      <div className="absolute inset-x-0 top-0 h-32 md:h-48 bg-gradient-to-b from-main-dark to-transparent pointer-events-none z-[2]" />
      <div className="absolute inset-x-0 bottom-0 h-32 md:h-48 bg-gradient-to-t from-main-dark to-transparent pointer-events-none z-[2]" />

      {/* Atmospheric ambient glows */}
      <div className="absolute top-10 right-0 w-[500px] h-[500px] rounded-full bg-main-red/5 blur-[200px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[500px] h-[500px] rounded-full bg-main-green/5 blur-[200px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight whitespace-nowrap">
              The Formula <span className="text-main-green">Fleet</span>
            </h2>
          </div>

        </div>

        {/* Combined Showcase Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center relative">
          
          {/* Huge background watermark typography (Antasena style) */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={`bg-watermark-${selectedCar.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 0.03, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[13vw] lg:text-[11vw] font-bold whitespace-nowrap pointer-events-none text-white leading-none select-none z-0 tracking-tighter"
            >
              {selectedCar.generation}
            </motion.div>
          </AnimatePresence>

          {/* LEFT: Visual Vehicle Stage with Antasena-style Floating 3D Tilted Telemetry Cards */}
          <div className="lg:col-span-7 relative min-h-[380px] sm:min-h-[460px] lg:min-h-[540px] flex items-center justify-center z-10">
            
            {/* Desktop Tilted Glassmorphic Telemetry Cards */}
            <div className="hidden md:block pointer-events-none">
              
              {/* Stat Card 1: Top Speed (Top Left - tilted -rotate-[7deg] -skew-x-[7deg]) */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={`card1-${selectedCar.id}`}
                  initial={{ opacity: 0, y: -20, rotate: -7 }}
                  animate={{ opacity: 1, y: 0, rotate: -7 }}
                  exit={{ opacity: 0, y: -20, rotate: -7 }}
                  transition={{ duration: 0.4 }}
                  className="absolute top-[8%] left-[2%] z-[20] -skew-x-[7deg]"
                >
                  <div className="backdrop-blur-md bg-white/[0.08] border border-white/20 rounded-3xl py-4 lg:py-6 px-5 lg:px-6 w-[200px] lg:w-[230px] shadow-[inset_0_0_20px_rgba(255,255,255,0.06)]">
                    <p className="text-main-red text-[11px] font-semibold tracking-wider">Top Speed</p>
                    <div className="text-white font-black text-4xl lg:text-5xl leading-tight my-0.5 flex items-baseline">
                      {speedVal}
                      <span className="text-xs font-medium text-main-red ml-1">km/h</span>
                    </div>
                    <p className="text-white/60 text-[11px] leading-tight">Peak Track Velocity</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Stat Card 2: Acceleration (Top Right - tilted rotate-[7deg] skew-x-[7deg]) */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={`card2-${selectedCar.id}`}
                  initial={{ opacity: 0, y: -20, rotate: 7 }}
                  animate={{ opacity: 1, y: 0, rotate: 7 }}
                  exit={{ opacity: 0, y: -20, rotate: 7 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  className="absolute top-[6%] right-[2%] z-[20] skew-x-[7deg]"
                >
                  <div className="backdrop-blur-md bg-white/[0.08] border border-white/20 rounded-3xl py-4 lg:py-6 px-5 lg:px-6 w-[200px] lg:w-[230px] shadow-[inset_0_0_20px_rgba(255,255,255,0.06)]">
                    <p className="text-main-red text-[11px] font-semibold tracking-wider">Acceleration</p>
                    <div className="text-white font-black text-4xl lg:text-5xl leading-tight my-0.5 flex items-baseline">
                      {accelVal}
                      <span className="text-xs font-medium text-main-red ml-1">sec</span>
                    </div>
                    <p className="text-white/60 text-[11px] leading-tight">0-100 km/h Launch</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Stat Card 3: Energy Pack (Bottom Right - tilted rotate-[5deg] skew-x-[5deg]) */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={`card3-${selectedCar.id}`}
                  initial={{ opacity: 0, y: 20, rotate: 5 }}
                  animate={{ opacity: 1, y: 0, rotate: 5 }}
                  exit={{ opacity: 0, y: 20, rotate: 5 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="absolute bottom-[6%] right-[6%] z-[20] skew-x-[5deg]"
                >
                  <div className="backdrop-blur-md bg-white/[0.08] border border-white/20 rounded-3xl py-4 lg:py-5 px-5 lg:px-6 w-[190px] lg:w-[220px] shadow-[inset_0_0_20px_rgba(255,255,255,0.06)]">
                    <p className="text-main-green text-[11px] font-semibold tracking-wider">Energy Pack</p>
                    <div className="text-white font-black text-3xl lg:text-4xl leading-tight my-0.5 flex items-baseline">
                      {batteryVal}
                      <span className="text-xs font-medium text-main-green ml-1">kWh</span>
                    </div>
                    <p className="text-white/60 text-[11px] leading-tight">Custom Anargya BMS</p>
                  </div>
                </motion.div>
              </AnimatePresence>

            </div>

            {/* Central Floating Car Image: Draggable & Swipeable */}
            <div className="w-full flex items-center justify-center relative z-10 px-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCar.id}
                  initial={{ opacity: 0, scale: 0.9, x: 50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -50 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(e, { offset }) => {
                    if (offset.x < -50) setCarIndex(1);
                    else if (offset.x > 50) setCarIndex(0);
                  }}
                  className="w-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                >
                  <motion.img
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    src={selectedCar.image}
                    alt={selectedCar.name}
                    className="w-full max-w-2xl max-h-[380px] lg:max-h-[460px] object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.95)] pointer-events-none"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

          {/* RIGHT: Sapuangin-Style Clean Narrative & Engineering Specs Panel */}
          <div className="lg:col-span-5 flex flex-col justify-center z-10 lg:pl-6">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={`info-${selectedCar.id}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
              >
                {/* Car Overview */}
                <div className="mb-6">
                  <p className="text-xs font-semibold tracking-wider text-main-red mb-2">
                    Car Overview
                  </p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] font-semibold tracking-wider text-white bg-white/10 px-2.5 py-1 rounded-sm border border-white/15">
                      {selectedCar.generation}
                    </span>
                    <span className="text-[11px] font-semibold tracking-wider text-main-gray bg-white/5 px-2.5 py-1 rounded-sm border border-white/10">
                      Season {selectedCar.year}
                    </span>
                  </div>

                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3 leading-none">
                    {selectedCar.name}
                  </h3>

                  <p className="text-main-gray text-sm md:text-base leading-relaxed">
                    {selectedCar.description}
                  </p>
                </div>

                {/* Mobile-only Telemetry Cards */}
                <div className="grid grid-cols-3 gap-2.5 mb-6 md:hidden">
                  <div className="bg-white/5 border border-white/15 rounded-xl p-3 text-center">
                    <span className="text-[10px] text-main-red font-semibold block mb-1">Top Speed</span>
                    <span className="text-white text-lg font-bold">{speedVal}</span>
                    <span className="text-[11px] text-white/60 ml-0.5">km/h</span>
                  </div>
                  <div className="bg-white/5 border border-white/15 rounded-xl p-3 text-center">
                    <span className="text-[10px] text-main-red font-semibold block mb-1">0-100</span>
                    <span className="text-white text-lg font-bold">{accelVal}</span>
                    <span className="text-[11px] text-white/60 ml-0.5">s</span>
                  </div>
                  <div className="bg-white/5 border border-white/15 rounded-xl p-3 text-center">
                    <span className="text-[10px] text-main-green font-semibold block mb-1">Battery</span>
                    <span className="text-white text-lg font-bold">{batteryVal}</span>
                    <span className="text-[11px] text-white/60 ml-0.5">kWh</span>
                  </div>
                </div>

                {/* Engineering Specifications */}
                <div className="border-t border-white/10 pt-5 mb-8">
                  <div className="text-xs font-semibold tracking-wider text-white/60 mb-3">
                    Engineering Specifications
                  </div>

                  <div className="space-y-2.5 text-xs sm:text-sm">
                    {selectedCar.specs.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="flex justify-between items-baseline border-b border-white/5 pb-2">
                        <span className="text-main-gray">{item.label}</span>
                        <span className="text-white font-semibold">{item.value}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-baseline border-b border-white/5 pb-2">
                      <span className="text-main-gray">Chassis</span>
                      <span className="text-white font-semibold text-right max-w-[60%]">{selectedCar.chassis}</span>
                    </div>
                    <div className="flex justify-between items-baseline border-b border-white/5 pb-2">
                      <span className="text-main-gray">Total Weight</span>
                      <span className="text-white font-semibold">{selectedCar.weight}</span>
                    </div>
                  </div>
                </div>

                {/* Sapuangin-Style Action CTA Button */}
                <div>
                  <Link 
                    href="/#achievements"
                    className="inline-flex items-center justify-center gap-2 border border-main-red text-main-red hover:bg-main-red hover:text-white px-6 py-3 font-semibold text-xs tracking-wider transition-colors duration-300 rounded-sm"
                  >
                    <span>Explore Racing Heritage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </motion.div>
            </AnimatePresence>

          </div>

        </div>

      </div>
    </section>
  );
};
