import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Project, Facility } from './types';
import { createDefaultTemplate, createBlankProject } from './defaultTemplate';

interface AppState {
  projects: Project[];
  currentProjectId: string | null;
  selectedFacilityId: string | null;
  activeScreen: 'dashboard' | 'planner' | 'render' | 'export';
  showLayers: boolean;
  visibleLayers: string[];
  showGrid: boolean;
  showLabels: boolean;

  createProject: (name: string, useTemplate: boolean) => string;
  openProject: (id: string) => void;
  deleteProject: (id: string) => void;
  importProject: (project: Project) => void;
  updateProject: (updates: Partial<Project>) => void;
  addFacility: (facility: Facility) => void;
  updateFacility: (id: string, updates: Partial<Facility>) => void;
  deleteFacility: (id: string) => void;
  selectFacility: (id: string | null) => void;
  setScreen: (screen: AppState['activeScreen']) => void;
  toggleLayer: (layer: string) => void;
  toggleGrid: () => void;
  toggleLabels: () => void;
  getCurrentProject: () => Project | null;
  getSelectedFacility: () => Facility | null;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProjectId: null,
      selectedFacilityId: null,
      activeScreen: 'dashboard',
      showLayers: false,
      visibleLayers: [
        'buildings',
        'roads',
        'paths',
        'gardens',
        'water',
        'services',
        'parking',
        'labels',
      ],
      showGrid: true,
      showLabels: true,

      createProject: (name: string, useTemplate: boolean) => {
        const project = useTemplate
          ? { ...createDefaultTemplate(), projectName: name || 'Whole Life Centre – Full Template' }
          : createBlankProject(name);
        set((state) => ({
          projects: [...state.projects, project],
          currentProjectId: project.projectId,
          activeScreen: 'planner',
          selectedFacilityId: null,
        }));
        return project.projectId;
      },

      openProject: (id: string) => {
        set({ currentProjectId: id, activeScreen: 'planner', selectedFacilityId: null });
      },

      deleteProject: (id: string) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.projectId !== id),
          currentProjectId: state.currentProjectId === id ? null : state.currentProjectId,
          activeScreen: state.currentProjectId === id ? 'dashboard' : state.activeScreen,
        }));
      },

      importProject: (project: Project) => {
        const imported = { ...project, projectId: uuidv4() };
        set((state) => ({
          projects: [...state.projects, imported],
          currentProjectId: imported.projectId,
          activeScreen: 'planner',
          selectedFacilityId: null,
        }));
      },

      updateProject: (updates: Partial<Project>) => {
        const { currentProjectId } = get();
        if (!currentProjectId) return;
        set((state) => ({
          projects: state.projects.map((p) =>
            p.projectId === currentProjectId
              ? { ...p, ...updates, updatedAt: new Date().toISOString() }
              : p
          ),
        }));
      },

      addFacility: (facility: Facility) => {
        const { currentProjectId } = get();
        if (!currentProjectId) return;
        set((state) => ({
          projects: state.projects.map((p) =>
            p.projectId === currentProjectId
              ? { ...p, facilities: [...p.facilities, facility], updatedAt: new Date().toISOString() }
              : p
          ),
          selectedFacilityId: facility.id,
        }));
      },

      updateFacility: (id: string, updates: Partial<Facility>) => {
        const { currentProjectId } = get();
        if (!currentProjectId) return;
        set((state) => ({
          projects: state.projects.map((p) =>
            p.projectId === currentProjectId
              ? {
                  ...p,
                  facilities: p.facilities.map((f) => (f.id === id ? { ...f, ...updates } : f)),
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      deleteFacility: (id: string) => {
        const { currentProjectId } = get();
        if (!currentProjectId) return;
        set((state) => ({
          projects: state.projects.map((p) =>
            p.projectId === currentProjectId
              ? {
                  ...p,
                  facilities: p.facilities.filter((f) => f.id !== id),
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
          selectedFacilityId: null,
        }));
      },

      selectFacility: (id: string | null) => {
        set({ selectedFacilityId: id });
      },

      setScreen: (screen: AppState['activeScreen']) => {
        set({ activeScreen: screen });
      },

      toggleLayer: (layer: string) => {
        set((state) => ({
          visibleLayers: state.visibleLayers.includes(layer)
            ? state.visibleLayers.filter((l) => l !== layer)
            : [...state.visibleLayers, layer],
        }));
      },

      toggleGrid: () => {
        set((state) => ({ showGrid: !state.showGrid }));
      },

      toggleLabels: () => {
        set((state) => ({ showLabels: !state.showLabels }));
      },

      getCurrentProject: () => {
        const { projects, currentProjectId } = get();
        return projects.find((p) => p.projectId === currentProjectId) ?? null;
      },

      getSelectedFacility: () => {
        const { selectedFacilityId } = get();
        const project = get().getCurrentProject();
        if (!project || !selectedFacilityId) return null;
        return project.facilities.find((f) => f.id === selectedFacilityId) ?? null;
      },
    }),
    {
      name: 'wlc-planner-storage',
      partialize: (state) => ({
        projects: state.projects,
        currentProjectId: state.currentProjectId,
        visibleLayers: state.visibleLayers,
        showGrid: state.showGrid,
        showLabels: state.showLabels,
      }),
    }
  )
);
