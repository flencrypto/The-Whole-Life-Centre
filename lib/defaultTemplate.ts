import { v4 as uuidv4 } from 'uuid';
import { Project, Facility } from './types';
import { FACILITY_TEMPLATES } from './facilityTypes';

function makeFacility(
  type: string,
  x: number,
  y: number,
  overrides: Partial<Facility> = {}
): Facility {
  const template = FACILITY_TEMPLATES.find((t) => t.type === type)!;
  return {
    id: uuidv4(),
    type: template.type,
    name: template.name,
    x,
    y,
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
    ...overrides,
  };
}

export function createDefaultTemplate(): Project {
  const now = new Date().toISOString();

  const facilities: Facility[] = [
    // ── Community heart ──────────────────────────────────────────────────
    makeFacility('community_garden', 540, 340),
    makeFacility('accessible_cafe', 560, 460),
    makeFacility('community_centre', 380, 380),
    makeFacility('everyday_centre', 80, 80),

    // ── Health & Therapy ─────────────────────────────────────────────────
    makeFacility('health_hub', 560, 230),
    makeFacility('therapy_suite', 680, 280),

    // ── Adult care ───────────────────────────────────────────────────────
    makeFacility('adult_care_home', 960, 60),

    // ── Family & Respite ─────────────────────────────────────────────────
    makeFacility('family_hub', 940, 280),
    makeFacility('respite_lodge', 950, 400),
    makeFacility('respite_lodge', 950, 480, { name: 'Respite Lodge B' }),

    // ── Residential arc – left ───────────────────────────────────────────
    makeFacility('supported_cottage', 60, 230),
    makeFacility('supported_cottage', 60, 310, { name: 'Supported Cottage B' }),
    makeFacility('supported_cottage', 60, 390, { name: 'Supported Cottage C' }),
    makeFacility('supported_cottage', 140, 460, { name: 'Supported Cottage D' }),
    makeFacility('shared_home', 200, 280),
    makeFacility('shared_home', 220, 370, { name: 'Shared Home B' }),
    makeFacility('assisted_villa', 200, 460),

    // ── Residential arc – right ──────────────────────────────────────────
    makeFacility('supported_cottage', 780, 80, { name: 'Supported Cottage E' }),
    makeFacility('supported_cottage', 860, 80, { name: 'Supported Cottage F' }),
    makeFacility('supported_cottage', 780, 160, { name: 'Supported Cottage G' }),
    makeFacility('shared_home', 820, 240, { name: 'Shared Home C' }),

    // ── Landscape & Sensory ──────────────────────────────────────────────
    makeFacility('sensory_garden', 400, 500),
    makeFacility('greenhouse', 400, 620),
    makeFacility('community_garden', 540, 580, { name: 'Community Garden B' }),

    // ── Recreational ─────────────────────────────────────────────────────
    makeFacility('inclusive_play', 700, 500),
    makeFacility('adaptive_sports', 700, 600),

    // ── Operations & Services ────────────────────────────────────────────
    makeFacility('transport_hub', 480, 720),
    makeFacility('parking', 660, 720),
    makeFacility('staff_base', 860, 680),
    makeFacility('utility_plant', 1040, 680),
    makeFacility('workshop_maintenance', 1040, 580),

    // ── Commercial & Training ────────────────────────────────────────────
    makeFacility('rental_training', 80, 680),
    makeFacility('rental_training', 200, 680, { name: 'Rental / Training Unit B' }),
  ];

  return {
    projectId: uuidv4(),
    projectName: 'Whole Life Centre – Full Template',
    siteName: 'Whole Life Village',
    version: '1.0.0',
    createdAt: now,
    updatedAt: now,
    siteBoundary: { width: 1200, height: 800, unit: 'px' },
    layers: ['buildings', 'roads', 'paths', 'gardens', 'water', 'services', 'parking', 'labels'],
    facilities,
    paths: [],
    zones: [],
    renderSettings: {
      stylePreset: 'watercolour',
      renderMode: 'masterplan',
      showLabels: true,
      showLegend: true,
      showNorthArrow: true,
      promptOverrides: '',
      negativePrompt: 'photorealistic, photo, ugly, distorted, text, watermark',
    },
    exports: [],
  };
}

export function createBlankProject(name: string): Project {
  const now = new Date().toISOString();
  return {
    projectId: uuidv4(),
    projectName: name || 'New Project',
    siteName: 'New Site',
    version: '1.0.0',
    createdAt: now,
    updatedAt: now,
    siteBoundary: { width: 1200, height: 800, unit: 'px' },
    layers: ['buildings', 'roads', 'paths', 'gardens', 'water', 'services', 'parking', 'labels'],
    facilities: [],
    paths: [],
    zones: [],
    renderSettings: {
      stylePreset: 'watercolour',
      renderMode: 'masterplan',
      showLabels: true,
      showLegend: true,
      showNorthArrow: true,
      promptOverrides: '',
      negativePrompt: 'photorealistic, photo, ugly, distorted, text, watermark',
    },
    exports: [],
  };
}
