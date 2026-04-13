'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import TopBar from './TopBar';
import { Download, FileJson, FileText, Image as ImageIcon, Check } from 'lucide-react';

export default function ExportScreen() {
  const { getCurrentProject, updateProject } = useStore();
  const project = getCurrentProject();
  const [exported, setExported] = useState<Record<string, boolean>>({});

  if (!project) return null;

  const p = project; // narrow type for closures

  function flashDone(key: string) {
    setExported((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => setExported((prev) => ({ ...prev, [key]: false })), 2000);
  }

  function handleExportJSON() {
    const json = JSON.stringify(p, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${p.projectName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    flashDone('json');
  }

  function handleExportCSV() {
    const headers = [
      'Name',
      'Type',
      'Zone',
      'Capacity',
      'Support Level',
      'X',
      'Y',
      'Width',
      'Height',
      'Description',
    ];
    const rows = p.facilities.map((f) => [
      f.name,
      f.type,
      f.zone,
      f.capacity,
      f.supportLevel,
      Math.round(f.x),
      Math.round(f.y),
      Math.round(f.width),
      Math.round(f.height),
      `"${f.description.replace(/"/g, '""')}"`,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${p.projectName.replace(/\s+/g, '_')}_facilities.csv`;
    a.click();
    URL.revokeObjectURL(url);
    flashDone('csv');
  }

  const { renderSettings } = p;
  function updateSettings(updates: Partial<typeof renderSettings>) {
    updateProject({ renderSettings: { ...renderSettings, ...updates } });
  }

  return (
    <div className="flex flex-col h-screen bg-stone-50">
      <TopBar />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
              <Download className="w-5 h-5 text-emerald-600" />
              Export
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              Export your masterplan data for use in other tools or to share with your team.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* JSON */}
            <ExportCard
              icon={<FileJson className="w-6 h-6 text-emerald-600" />}
              title="Project JSON"
              description="Full project data including all facilities, settings, and metadata. Use this to back up or share your project."
              badge=".json"
              done={exported['json']}
              onExport={handleExportJSON}
            />

            {/* CSV */}
            <ExportCard
              icon={<FileText className="w-6 h-6 text-blue-600" />}
              title="Facility Schedule (CSV)"
              description="Spreadsheet of all facilities with name, type, zone, capacity, support level, and dimensions."
              badge=".csv"
              done={exported['csv']}
              onExport={handleExportCSV}
            />

            {/* Canvas PNG – instructions */}
            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-stone-50 rounded-lg">
                  <ImageIcon className="w-6 h-6 text-stone-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-stone-800 mb-1">Canvas PNG</h3>
                  <p className="text-sm text-stone-500 mb-3">
                    To export the canvas as a PNG, use your browser&apos;s screenshot tool or take a screen capture of the Planner view. Full canvas export is available in the desktop version.
                  </p>
                  <span className="inline-block text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-md font-mono">
                    .png
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Export config */}
          <div className="mt-8 bg-white rounded-xl border border-stone-200 p-5">
            <h3 className="text-sm font-semibold text-stone-700 mb-4">Export Configuration</h3>
            <div className="space-y-3">
              {(
                [
                  { key: 'showLabels', label: 'Include facility labels' },
                  { key: 'showLegend', label: 'Include zone legend' },
                  { key: 'showNorthArrow', label: 'Include north arrow' },
                ] as const
              ).map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-stone-600">{label}</span>
                  <button
                    onClick={() => updateSettings({ [key]: !renderSettings[key] })}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      renderSettings[key] ? 'bg-emerald-500' : 'bg-stone-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                        renderSettings[key] ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 bg-stone-100 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-stone-600 mb-3">Project Summary</h3>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <dt className="text-stone-500">Project name</dt>
              <dd className="text-stone-800 font-medium">{p.projectName}</dd>
              <dt className="text-stone-500">Site name</dt>
              <dd className="text-stone-800">{p.siteName}</dd>
              <dt className="text-stone-500">Facilities</dt>
              <dd className="text-stone-800">{p.facilities.length}</dd>
              <dt className="text-stone-500">Total capacity</dt>
              <dd className="text-stone-800">
                {p.facilities.reduce((s, f) => s + (f.capacity ?? 0), 0)} people
              </dd>
              <dt className="text-stone-500">Last updated</dt>
              <dd className="text-stone-800">
                {new Date(p.updatedAt).toLocaleString()}
              </dd>
              <dt className="text-stone-500">Version</dt>
              <dd className="text-stone-800">{p.version}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExportCard({
  icon,
  title,
  description,
  badge,
  done,
  onExport,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge: string;
  done: boolean;
  onExport: () => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5 flex items-start gap-4">
      <div className="p-2 bg-stone-50 rounded-lg">{icon}</div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-stone-800">{title}</h3>
          <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-md font-mono">
            {badge}
          </span>
        </div>
        <p className="text-sm text-stone-500 mb-3">{description}</p>
        <button
          onClick={onExport}
          className={`flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg font-medium transition-all ${
            done
              ? 'bg-emerald-600 text-white'
              : 'bg-stone-800 text-white hover:bg-stone-900'
          }`}
        >
          {done ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
          {done ? 'Downloaded!' : `Download ${badge}`}
        </button>
      </div>
    </div>
  );
}
