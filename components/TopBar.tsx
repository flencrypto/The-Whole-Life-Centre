'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { ArrowLeft, Save, Grid3X3, Tag, Map, Download, Wand2, Leaf } from 'lucide-react';

export default function TopBar() {
  const {
    getCurrentProject,
    activeScreen,
    setScreen,
    showGrid,
    showLabels,
    toggleGrid,
    toggleLabels,
  } = useStore((s) => ({
    getCurrentProject: s.getCurrentProject,
    activeScreen: s.activeScreen,
    setScreen: s.setScreen,
    showGrid: s.showGrid,
    showLabels: s.showLabels,
    toggleGrid: s.toggleGrid,
    toggleLabels: s.toggleLabels,
  }));

  const project = getCurrentProject();
  if (!project) return null;

  const tabs: { id: typeof activeScreen; label: string; icon: React.ReactNode }[] = [
    { id: 'planner', label: 'Planner', icon: <Map className="w-4 h-4" /> },
    { id: 'render', label: 'Render', icon: <Wand2 className="w-4 h-4" /> },
    { id: 'export', label: 'Export', icon: <Download className="w-4 h-4" /> },
  ];

  const savedAgo = project.updatedAt
    ? (() => {
        const diff = Math.round((Date.now() - new Date(project.updatedAt).getTime()) / 1000);
        if (diff < 5) return 'Just saved';
        if (diff < 60) return `Saved ${diff}s ago`;
        if (diff < 3600) return `Saved ${Math.round(diff / 60)}m ago`;
        return `Saved ${Math.round(diff / 3600)}h ago`;
      })()
    : 'Unsaved';

  return (
    <header className="bg-white border-b border-stone-200 shadow-sm h-14 flex items-center px-4 gap-4 z-20">
      <button
        onClick={() => setScreen('dashboard')}
        className="flex items-center gap-1.5 text-stone-500 hover:text-stone-800 text-sm transition-colors"
        title="Back to dashboard"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-2 mr-2">
        <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center">
          <Leaf className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-stone-800 text-sm truncate max-w-[180px]">
          {project.projectName}
        </span>
      </div>

      <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-0.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setScreen(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-all ${
              activeScreen === tab.id
                ? 'bg-white text-stone-800 shadow-sm font-medium'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-2">
        {activeScreen === 'planner' && (
          <>
            <button
              onClick={toggleGrid}
              title="Toggle grid"
              className={`p-1.5 rounded-md transition-colors ${
                showGrid ? 'bg-stone-100 text-stone-700' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={toggleLabels}
              title="Toggle labels"
              className={`p-1.5 rounded-md transition-colors ${
                showLabels ? 'bg-stone-100 text-stone-700' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <Tag className="w-4 h-4" />
            </button>
          </>
        )}
        <div className="flex items-center gap-1.5 text-xs text-stone-400 pl-2 border-l border-stone-200">
          <Save className="w-3.5 h-3.5 text-emerald-500" />
          <span>{savedAgo}</span>
        </div>
        <span className="text-xs text-stone-300 hidden sm:block">v{project.version}</span>
      </div>
    </header>
  );
}
