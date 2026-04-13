'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { Layers, Grid3X3, Tag, Eye, EyeOff } from 'lucide-react';

const LAYER_DEFS = [
  { id: 'buildings', label: 'Buildings', emoji: '🏛️' },
  { id: 'roads', label: 'Roads', emoji: '🛣️' },
  { id: 'paths', label: 'Paths', emoji: '🚶' },
  { id: 'gardens', label: 'Gardens', emoji: '🌿' },
  { id: 'water', label: 'Water', emoji: '💧' },
  { id: 'services', label: 'Services', emoji: '⚙️' },
  { id: 'parking', label: 'Parking', emoji: '🅿️' },
  { id: 'labels', label: 'Labels', emoji: '🏷️' },
  { id: 'legend', label: 'Legend', emoji: '📋' },
  { id: 'site_boundary', label: 'Site Boundary', emoji: '📐' },
];

export default function LayerControls() {
  const { visibleLayers, toggleLayer, showGrid, toggleGrid, showLabels, toggleLabels } =
    useStore();

  return (
    <div className="bg-white border border-stone-200 rounded-xl shadow-lg w-52 overflow-hidden">
      <div className="px-3 py-2 border-b border-stone-100 flex items-center gap-2">
        <Layers className="w-4 h-4 text-stone-500" />
        <span className="text-xs font-semibold text-stone-700">Layers</span>
      </div>
      <div className="p-2 space-y-0.5">
        {LAYER_DEFS.map((layer) => {
          const visible = visibleLayers.includes(layer.id);
          return (
            <button
              key={layer.id}
              onClick={() => toggleLayer(layer.id)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors ${
                visible ? 'text-stone-700 hover:bg-stone-50' : 'text-stone-400 hover:bg-stone-50'
              }`}
            >
              <span className="w-4 text-center">{layer.emoji}</span>
              <span className="flex-1 text-left">{layer.label}</span>
              {visible ? (
                <Eye className="w-3 h-3 text-emerald-500" />
              ) : (
                <EyeOff className="w-3 h-3 text-stone-300" />
              )}
            </button>
          );
        })}
      </div>
      <div className="px-3 py-2 border-t border-stone-100 space-y-1">
        <button
          onClick={toggleGrid}
          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors ${
            showGrid ? 'text-stone-700' : 'text-stone-400'
          } hover:bg-stone-50`}
        >
          <Grid3X3 className="w-3.5 h-3.5" />
          <span>Grid</span>
          <span className={`ml-auto text-xs ${showGrid ? 'text-emerald-600' : 'text-stone-300'}`}>
            {showGrid ? 'On' : 'Off'}
          </span>
        </button>
        <button
          onClick={toggleLabels}
          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors ${
            showLabels ? 'text-stone-700' : 'text-stone-400'
          } hover:bg-stone-50`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Labels</span>
          <span className={`ml-auto text-xs ${showLabels ? 'text-emerald-600' : 'text-stone-300'}`}>
            {showLabels ? 'On' : 'Off'}
          </span>
        </button>
      </div>
    </div>
  );
}
