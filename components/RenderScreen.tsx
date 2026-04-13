'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { generatePrompt } from '@/lib/promptGenerator';
import TopBar from './TopBar';
import { Copy, Check, RefreshCw, Wand2 } from 'lucide-react';

const STYLE_PRESETS = [
  { id: 'watercolour', label: 'Warm Watercolour', description: 'Soft washes, hand-drawn, earthy tones' },
  { id: 'presentation_board', label: 'Presentation Board', description: 'Bold outlines, flat colours, professional' },
  { id: 'landscape_plan', label: 'Landscape Plan', description: 'Detailed surfaces, planting, technical' },
  { id: 'technical', label: 'Technical Plan', description: 'Precise line drawing, greyscale' },
];

const RENDER_MODES = [
  { id: 'masterplan', label: 'Masterplan' },
  { id: 'aerial_perspective', label: 'Aerial Perspective' },
  { id: 'street_view', label: 'Street View' },
  { id: 'interior', label: 'Interior Scene' },
];

export default function RenderScreen() {
  const { getCurrentProject, updateProject } = useStore();
  const project = getCurrentProject();
  const [prompt, setPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (project) setPrompt(generatePrompt(project));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.projectId, project?.renderSettings]);

  if (!project) return null;

  const { renderSettings } = project;

  function updateSettings(updates: Partial<typeof renderSettings>) {
    updateProject({ renderSettings: { ...renderSettings, ...updates } });
  }

  function handleCopy() {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleRegenerate() {
    setPrompt(generatePrompt(project!));
  }

  return (
    <div className="flex flex-col h-screen bg-stone-50">
      <TopBar />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-emerald-600" />
              Render Studio
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              Generate an AI image prompt from your masterplan design. Copy it into DALL-E, Midjourney, or Stable Diffusion.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: settings */}
            <div className="space-y-5">
              <div className="bg-white rounded-xl border border-stone-200 p-5">
                <h3 className="text-sm font-semibold text-stone-700 mb-3">Style Preset</h3>
                <div className="space-y-2">
                  {STYLE_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => updateSettings({ stylePreset: preset.id })}
                      className={`w-full text-left p-3 rounded-lg border-2 text-sm transition-all ${
                        renderSettings.stylePreset === preset.id
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-stone-100 hover:border-stone-200'
                      }`}
                    >
                      <div className="font-medium text-stone-800">{preset.label}</div>
                      <div className="text-xs text-stone-500 mt-0.5">{preset.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-stone-200 p-5">
                <h3 className="text-sm font-semibold text-stone-700 mb-3">Render Mode</h3>
                <div className="space-y-1.5">
                  {RENDER_MODES.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => updateSettings({ renderMode: mode.id })}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        renderSettings.renderMode === mode.id
                          ? 'bg-emerald-600 text-white font-medium'
                          : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-3">
                <h3 className="text-sm font-semibold text-stone-700">Display Options</h3>
                {(['showLabels', 'showLegend', 'showNorthArrow'] as const).map((key) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-stone-600 capitalize">
                      {key.replace('show', 'Show ')}
                    </span>
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

            {/* Right: prompt */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
                  <h3 className="text-sm font-semibold text-stone-700">Generated Prompt</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRegenerate}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-600 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Regenerate
                    </button>
                    <button
                      onClick={handleCopy}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all ${
                        copied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-800 text-white hover:bg-stone-900'
                      }`}
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied!' : 'Copy Prompt'}
                    </button>
                  </div>
                </div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={10}
                  className="w-full p-4 text-sm text-stone-700 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono leading-relaxed"
                  placeholder="Prompt will be generated here…"
                />
              </div>

              <div className="bg-white rounded-xl border border-stone-200 p-5">
                <h3 className="text-sm font-semibold text-stone-700 mb-3">Prompt Additions</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-stone-500 mb-1">Extra instructions (appended to prompt)</label>
                    <textarea
                      value={renderSettings.promptOverrides}
                      onChange={(e) => updateSettings({ promptOverrides: e.target.value })}
                      rows={3}
                      placeholder="e.g. in the style of a Japanese scroll painting, autumn colours…"
                      className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-500 mb-1">Negative prompt</label>
                    <textarea
                      value={renderSettings.negativePrompt}
                      onChange={(e) => updateSettings({ negativePrompt: e.target.value })}
                      rows={2}
                      className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                <strong>How to use this prompt:</strong> Copy the prompt above and paste it into an AI image generator such as{' '}
                <a href="https://openai.com/dall-e-3" target="_blank" rel="noopener noreferrer" className="underline">DALL-E 3</a>,{' '}
                <a href="https://www.midjourney.com" target="_blank" rel="noopener noreferrer" className="underline">Midjourney</a>, or{' '}
                <a href="https://stability.ai" target="_blank" rel="noopener noreferrer" className="underline">Stable Diffusion</a>{' '}
                to generate an architectural illustration of your masterplan.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
