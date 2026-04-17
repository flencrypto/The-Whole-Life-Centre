export type SupportLevel = 'low' | 'medium' | 'high' | 'specialist';
export type FacilityCategory =
  | 'residential'
  | 'adult_care'
  | 'therapy_health'
  | 'community'
  | 'family_respite'
  | 'recreational'
  | 'operations_services'
  | 'commercial_training'
  | 'landscape_sensory';

export interface Facility {
  id: string;
  type: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zone: FacilityCategory;
  capacity: number;
  supportLevel: SupportLevel;
  description: string;
  accessibilityNotes: string[];
  careTags: string[];
  styleTags: string[];
  includeInRender: boolean;
  locked: boolean;
  color?: string;
}

export interface PathObject {
  id: string;
  type: string;
  points: number[];
  width: number;
  surface: string;
  loopType: string;
}

export interface ZoneObject {
  id: string;
  name: string;
  category: FacilityCategory;
  polygon: number[][];
  displayColor: string;
}

export interface RenderSettings {
  stylePreset: string;
  renderMode: string;
  showLabels: boolean;
  showLegend: boolean;
  showNorthArrow: boolean;
  promptOverrides: string;
  negativePrompt: string;
}

export interface Project {
  projectId: string;
  projectName: string;
  siteName: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  siteBoundary: { width: number; height: number; unit: string };
  layers: string[];
  facilities: Facility[];
  paths: PathObject[];
  zones: ZoneObject[];
  renderSettings: RenderSettings;
  exports: string[];
}
