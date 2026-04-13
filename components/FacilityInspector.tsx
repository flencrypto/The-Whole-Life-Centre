'use client';

import React, { useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';
import { Facility } from '@/lib/types';
import { ZONE_LABELS, ZONE_COLORS } from '@/lib/facilityTypes';
import {
  Lock,
  Unlock,
  Trash2,
  Eye,
  EyeOff,
  Tag,
  Info,
  RotateCw,
  Maximize2,
} from 'lucide-react';

const SUPPORT_LEVELS = ['low', 'medium', 'high', 'specialist'] as const;
const ZONE_KEYS = Object.keys(ZONE_LABELS) as Array<keyof typeof ZONE_LABELS>;

export default function FacilityInspector() {
  const { getSelectedFacility, updateFacility, deleteFacility } = useStore();
  const facility = getSelectedFacility();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function update(changes: Partial<Facility>) {
    if (!facility) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateFacility(facility.id, changes);
    }, 150);
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  if (!facility) {
    return (
      <aside className="w-72 bg-white border-l border-stone-200 flex items-center justify-center h-full">
        <div className="text-center px-6">
          <div className="text-4xl mb-3">🏗️</div>
          <p className="text-sm text-stone-500 leading-relaxed">
            Select a facility on the canvas to view and edit its properties.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-72 bg-white border-l border-stone-200 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div
        className="p-4 border-b border-stone-100"
        style={{ borderTop: `3px solid ${facility.color ?? ZONE_COLORS[facility.zone] ?? '#888'}` }}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-stone-400 uppercase tracking-wide">
            {ZONE_LABELS[facility.zone] ?? facility.zone}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => updateFacility(facility.id, { locked: !facility.locked })}
              title={facility.locked ? 'Unlock' : 'Lock position'}
              className={`p-1 rounded transition-colors ${facility.locked ? 'text-amber-500' : 'text-stone-400 hover:text-stone-600'}`}
            >
              {facility.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => {
                if (confirm(`Delete "${facility.name}"?`)) {
                  deleteFacility(facility.id);
                }
              }}
              className="p-1 text-stone-400 hover:text-red-500 rounded transition-colors"
              title="Delete facility"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <input
          type="text"
          value={facility.name}
          onChange={(e) => updateFacility(facility.id, { name: e.target.value })}
          className="w-full text-sm font-semibold text-stone-800 border-b border-transparent hover:border-stone-200 focus:border-emerald-400 focus:outline-none py-0.5 bg-transparent"
        />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Zone */}
        <Field label="Zone" icon={<Tag className="w-3.5 h-3.5" />}>
          <select
            value={facility.zone}
            onChange={(e) => updateFacility(facility.id, { zone: e.target.value as Facility['zone'] })}
            className="w-full text-xs border border-stone-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400"
          >
            {ZONE_KEYS.map((z) => (
              <option key={z} value={z}>{ZONE_LABELS[z]}</option>
            ))}
          </select>
        </Field>

        {/* Description */}
        <Field label="Description" icon={<Info className="w-3.5 h-3.5" />}>
          <textarea
            value={facility.description}
            onChange={(e) => update({ description: e.target.value })}
            rows={3}
            className="w-full text-xs border border-stone-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 resize-none"
          />
        </Field>

        {/* Capacity & support */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Capacity">
            <input
              type="number"
              min={0}
              value={facility.capacity}
              onChange={(e) => update({ capacity: parseInt(e.target.value) || 0 })}
              className="w-full text-xs border border-stone-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            />
          </Field>
          <Field label="Support level">
            <select
              value={facility.supportLevel}
              onChange={(e) => updateFacility(facility.id, { supportLevel: e.target.value as Facility['supportLevel'] })}
              className="w-full text-xs border border-stone-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            >
              {SUPPORT_LEVELS.map((l) => (
                <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
              ))}
            </select>
          </Field>
        </div>

        {/* Dimensions */}
        <Field label="Size (px)" icon={<Maximize2 className="w-3.5 h-3.5" />}>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-stone-400 mb-0.5">W</label>
              <input
                type="number"
                min={20}
                value={Math.round(facility.width)}
                onChange={(e) => update({ width: parseInt(e.target.value) || 20 })}
                className="w-full text-xs border border-stone-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-0.5">H</label>
              <input
                type="number"
                min={20}
                value={Math.round(facility.height)}
                onChange={(e) => update({ height: parseInt(e.target.value) || 20 })}
                className="w-full text-xs border border-stone-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-0.5 flex items-center gap-0.5">
                <RotateCw className="w-3 h-3" />°
              </label>
              <input
                type="number"
                value={Math.round(facility.rotation)}
                onChange={(e) => update({ rotation: parseInt(e.target.value) || 0 })}
                className="w-full text-xs border border-stone-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
            </div>
          </div>
        </Field>

        {/* Care tags */}
        <Field label="Care tags">
          <input
            type="text"
            value={facility.careTags.join(', ')}
            onChange={(e) => update({ careTags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
            placeholder="e.g. residential, therapy"
            className="w-full text-xs border border-stone-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400"
          />
        </Field>

        {/* Accessibility notes */}
        <Field label="Accessibility notes">
          <textarea
            value={facility.accessibilityNotes.join('\n')}
            onChange={(e) => update({ accessibilityNotes: e.target.value.split('\n').filter(Boolean) })}
            rows={3}
            placeholder="One note per line"
            className="w-full text-xs border border-stone-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 resize-none"
          />
        </Field>

        {/* Toggles */}
        <div className="flex items-center justify-between py-2 border-t border-stone-100">
          <div className="flex items-center gap-2">
            {facility.includeInRender ? (
              <Eye className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <EyeOff className="w-3.5 h-3.5 text-stone-400" />
            )}
            <span className="text-xs text-stone-600">Include in render</span>
          </div>
          <button
            onClick={() => updateFacility(facility.id, { includeInRender: !facility.includeInRender })}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${facility.includeInRender ? 'bg-emerald-500' : 'bg-stone-200'}`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${facility.includeInRender ? 'translate-x-4' : 'translate-x-0.5'}`}
            />
          </button>
        </div>
      </div>
    </aside>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1 text-xs font-medium text-stone-500 mb-1.5">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}
