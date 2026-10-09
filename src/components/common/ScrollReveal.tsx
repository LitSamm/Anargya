'use client';

import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({ children, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    amount: 0.12,
    margin: '-8% 0px -8% 0px',
  });
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={
        shouldReduceMotion || isInView
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 32 }
      }
      transition={{
        duration: shouldReduceMotion ? 0 : 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
};
