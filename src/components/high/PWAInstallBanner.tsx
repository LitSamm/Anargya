'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { X } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const { triggerInstall, installPrompt, isOffline } = useStore();
  const [dismissed, setDismissed] = useState(false);

  // If already dismissed in this session, don't show
  if (dismissed) return null;

  return (
    <div className="bg-secondary-dark border-b border-main-green/30 px-4 py-2 text-xs text-gray-300 relative z-30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        
        <div className="flex items-center gap-2.5 text-center sm:text-left">
          <div className="w-6 h-6 rounded-lg bg-main-green/20 border border-main-green/50 flex items-center justify-center text-main-green shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-main-green" aria-hidden="true" />
          </div>
          <div>
            <span className="font-bold text-white">Anargya 9th Gen PWA:</span>{' '}
            <span className="text-gray-300">
              Install as native app on Android, iOS & Desktop for offline telemetry & fast ordering!
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={triggerInstall}
            className="px-3 py-1 rounded-lg bg-main-green hover:bg-emerald-400 text-main-dark font-black text-xs transition-all shadow-neon-green-sm"
          >
            Install Now
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-lg text-gray-400 hover:text-white transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
