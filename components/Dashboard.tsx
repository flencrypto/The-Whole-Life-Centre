'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Project } from '@/lib/types';
import { PlusCircle, FolderOpen, Upload, Trash2, Calendar, Building2, Leaf } from 'lucide-react';

export default function Dashboard() {
  const { projects, createProject, openProject, deleteProject, importProject } =
    useStore();
  const [showNewModal, setShowNewModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [useTemplate, setUseTemplate] = useState(true);

  function handleCreate() {
    if (!newProjectName.trim()) return;
    createProject(newProjectName.trim(), useTemplate);
    setShowNewModal(false);
    setNewProjectName('');
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const project: Project = JSON.parse(ev.target?.result as string);
        importProject(project);
      } catch {
        alert('Invalid project file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-stone-800">Whole Life Centre Planner</h1>
              <p className="text-xs text-stone-500">Village masterplan design tool</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-4 py-2 text-sm text-stone-600 border border-stone-300 rounded-lg cursor-pointer hover:bg-stone-50 transition-colors">
              <Upload className="w-4 h-4" />
              Import JSON
              <input type="file" accept=".json" className="hidden" onChange={handleImport} />
            </label>
            <button
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              <PlusCircle className="w-4 h-4" />
              New Project
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Templates section */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-stone-700 mb-4">Start from a template</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => {
                setNewProjectName('Whole Life Centre');
                setUseTemplate(true);
                setShowNewModal(true);
              }}
              className="group text-left p-5 bg-white border-2 border-emerald-200 rounded-xl hover:border-emerald-400 hover:shadow-md transition-all"
            >
              <div className="text-3xl mb-3">🌿</div>
              <h3 className="font-semibold text-stone-800 mb-1">WLC Full Template</h3>
              <p className="text-sm text-stone-500">
                Pre-populated village layout with 30+ facilities across all zones. Ready to customise.
              </p>
            </button>
            <button
              onClick={() => {
                setNewProjectName('New Project');
                setUseTemplate(false);
                setShowNewModal(true);
              }}
              className="group text-left p-5 bg-white border-2 border-stone-200 rounded-xl hover:border-stone-300 hover:shadow-md transition-all"
            >
              <div className="text-3xl mb-3">📐</div>
              <h3 className="font-semibold text-stone-800 mb-1">Blank Canvas</h3>
              <p className="text-sm text-stone-500">
                Start from scratch with an empty 1200×800 site canvas.
              </p>
            </button>
          </div>
        </section>

        {/* Recent projects */}
        <section>
          <h2 className="text-lg font-semibold text-stone-700 mb-4">
            {projects.length > 0 ? 'Recent Projects' : 'No projects yet'}
          </h2>
          {projects.length === 0 && (
            <div className="bg-white border border-stone-200 rounded-xl p-10 text-center text-stone-400">
              <Building2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Create your first project above to get started.</p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project.projectId}
                className="bg-white border border-stone-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div
                  className="p-5 cursor-pointer"
                  onClick={() => openProject(project.projectId)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-center text-xl">
                      🌿
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete "${project.projectName}"?`)) {
                          deleteProject(project.projectId);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-stone-400 hover:text-red-500 transition-all rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-stone-800 mb-1 truncate">{project.projectName}</h3>
                  <p className="text-sm text-stone-500 mb-3 truncate">{project.siteName}</p>
                  <div className="flex items-center gap-3 text-xs text-stone-400">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {project.facilities.length} facilities
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="px-5 py-3 bg-stone-50 border-t border-stone-100">
                  <button
                    onClick={() => openProject(project.projectId)}
                    className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-900 transition-colors"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    Open project
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* New project modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-stone-800 mb-5">Create New Project</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  placeholder="e.g. Whole Life Centre Phase 1"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Starting template
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setUseTemplate(true)}
                    className={`p-3 border-2 rounded-lg text-left text-sm transition-all ${
                      useTemplate
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                        : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <div className="text-lg mb-1">🌿</div>
                    WLC Template
                  </button>
                  <button
                    onClick={() => setUseTemplate(false)}
                    className={`p-3 border-2 rounded-lg text-left text-sm transition-all ${
                      !useTemplate
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                        : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <div className="text-lg mb-1">📐</div>
                    Blank Canvas
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewModal(false)}
                className="flex-1 px-4 py-2.5 border border-stone-300 text-stone-600 rounded-lg text-sm hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newProjectName.trim()}
                className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
