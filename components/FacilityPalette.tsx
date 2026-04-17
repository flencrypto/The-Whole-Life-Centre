'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { FACILITY_TEMPLATES, ZONE_LABELS, ZONE_COLORS } from '@/lib/facilityTypes';
import { FacilityCategory } from '@/lib/types';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const CATEGORY_ORDER: FacilityCategory[] = [
  'residential',
  'adult_care',
  'therapy_health',
  'community',
  'family_respite',
  'recreational',
  'landscape_sensory',
  'operations_services',
  'commercial_training',
];

export default function FacilityPalette() {
  const addFacility = useStore((s) => s.addFacility);
  const siteBoundary = useStore((s) => {
    const project = s.projects.find((p) => p.projectId === s.currentProjectId);
    return project?.siteBoundary ?? null;
  });
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  function toggleCollapse(cat: string) {
    setCollapsed((prev) => ({ ...prev, [cat]: !prev[cat] }));
  }

  function handleAdd(type: string) {
    const template = FACILITY_TEMPLATES.find((t) => t.type === type);
    if (!template) return;
    const cx = siteBoundary ? siteBoundary.width / 2 - template.defaultWidth / 2 : 560;
    const cy = siteBoundary ? siteBoundary.height / 2 - template.defaultHeight / 2 : 360;
    addFacility({
      id: uuidv4(),
      type: template.type,
      name: template.name,
      x: cx + Math.random() * 40 - 20,
      y: cy + Math.random() * 40 - 20,
      width: template.defaultWidth,
      height: template.defaultHeight,
      rotation: 0,
      zone: template.zone,
      capacity: template.capacity,
      supportLevel: template.supportLevel,
      description: template.description,
      accessibilityNotes: [...template.accessibilityNotes],
      careTags: [...template.careTags],
      styleTags: [...template.styleTags],
      includeInRender: true,
      locked: false,
      color: template.color,
    });
  }

  const filtered = search
    ? FACILITY_TEMPLATES.filter(
        (t) =>
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.careTags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
      )
    : null;

  const grouped = CATEGORY_ORDER.reduce<Record<string, typeof FACILITY_TEMPLATES>>((acc, cat) => {
    const items = (filtered ?? FACILITY_TEMPLATES).filter((t) => t.zone === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  return (
    <aside className="w-60 bg-white border-r border-stone-200 flex flex-col h-full overflow-hidden">
      <div className="p-3 border-b border-stone-100">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search facilities…"
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {Object.entries(grouped).map(([cat, items]) => {
          const isCollapsed = collapsed[cat];
          const zoneColor = ZONE_COLORS[cat] ?? '#888';
          return (
            <div key={cat}>
              <button
                onClick={() => toggleCollapse(cat)}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-stone-50 transition-colors text-left"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: zoneColor }}
                />
                <span className="text-xs font-semibold text-stone-600 flex-1 truncate">
                  {ZONE_LABELS[cat] ?? cat}
                </span>
                <span className="text-xs text-stone-400">{items.length}</span>
                {isCollapsed ? (
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                )}
              </button>
              {!isCollapsed &&
                items.map((t) => (
                  <button
                    key={t.type}
                    onClick={() => handleAdd(t.type)}
                    className="w-full flex items-center gap-2 px-4 py-1.5 hover:bg-emerald-50 transition-colors text-left group"
                  >
                    <span className="text-base leading-none w-5 text-center">{t.emoji}</span>
                    <span className="text-xs text-stone-700 truncate group-hover:text-emerald-800">
                      {t.name}
                    </span>
                  </button>
                ))}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
