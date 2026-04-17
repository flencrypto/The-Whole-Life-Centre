'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import FacilityPalette from './FacilityPalette';
import FacilityInspector from './FacilityInspector';
import TopBar from './TopBar';
import LayerControls from './LayerControls';
import { Layers } from 'lucide-react';

const PlannerCanvas = dynamic(() => import('./PlannerCanvas'), { ssr: false });

export default function PlannerScreen() {
  const [showLayerPanel, setShowLayerPanel] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-stone-100">
      <TopBar />
      <div className="flex flex-1 overflow-hidden relative">
        <FacilityPalette />
        <div className="flex-1 relative overflow-hidden">
          <PlannerCanvas />
          {/* Layer toggle button */}
          <button
            onClick={() => setShowLayerPanel((v) => !v)}
            className={`absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border shadow-sm transition-all ${
              showLayerPanel
                ? 'bg-stone-800 text-white border-stone-700'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Layers
          </button>
          {/* Layer controls panel */}
          {showLayerPanel && (
            <div className="absolute top-12 right-3 z-20">
              <LayerControls />
            </div>
          )}
        </div>
        <FacilityInspector />
      </div>
    </div>
  );
}
