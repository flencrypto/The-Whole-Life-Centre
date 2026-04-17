import { Project } from './types';
import { ZONE_LABELS } from './facilityTypes';

export function generatePrompt(project: Project): string {
  const { facilities, renderSettings, projectName, siteName } = project;

  // Count facilities per zone
  const zoneCounts: Record<string, number> = {};
  facilities.forEach((f) => {
    zoneCounts[f.zone] = (zoneCounts[f.zone] ?? 0) + 1;
  });

  const zoneSummary = Object.entries(zoneCounts)
    .map(([zone, count]) => `${count} ${ZONE_LABELS[zone] ?? zone}`)
    .join(', ');

  const renderFacilities = facilities
    .filter((f) => f.includeInRender)
    .map((f) => f.name)
    .join(', ');

  const totalCapacity = facilities.reduce((sum, f) => sum + (f.capacity ?? 0), 0);

  const styleDescriptions: Record<string, string> = {
    watercolour:
      'warm watercolour architectural illustration, soft washes, hand-drawn quality, earthy tones',
    presentation_board:
      'clean architectural presentation board style, bold outlines, flat colour fills, professional',
    landscape_plan:
      'detailed landscape masterplan, coloured surfaces, planting indicated, technical drawing style',
    technical: 'precise technical architectural plan, line drawing, greyscale, annotated',
  };

  const styleDesc =
    styleDescriptions[renderSettings.stylePreset] ?? styleDescriptions['watercolour'];

  let prompt = `Architectural masterplan illustration of "${siteName}", a Whole Life Centre village for adults with learning disabilities and complex needs. ${styleDesc}. Bird's-eye view, looking directly down.`;

  prompt += ` The village is called "${projectName}". It contains approximately ${facilities.length} buildings with a total capacity of ${totalCapacity} people.`;

  prompt += ` Zone breakdown: ${zoneSummary}.`;

  if (renderFacilities) {
    prompt += ` Key buildings include: ${renderFacilities}.`;
  }

  prompt += ` The design is warm, human-scaled, and community-focused. Lush green landscaping with sensory gardens, community growing areas, and therapeutic outdoor spaces. Winding accessible pathways connect all buildings. The village has a welcoming, non-institutional character with timber-clad residential cottages, community halls, café spaces, and health facilities.`;

  prompt += ` Atmosphere: calm, safe, purposeful, joyful community. Inclusive design throughout. Natural materials. Warm afternoon light.`;

  if (renderSettings.showLegend) {
    prompt += ` Include a subtle colour-coded legend in the corner.`;
  }
  if (renderSettings.showNorthArrow) {
    prompt += ` Include a north arrow indicator.`;
  }
  if (renderSettings.showLabels) {
    prompt += ` Label each major building clearly.`;
  }

  if (renderSettings.promptOverrides) {
    prompt += ` ${renderSettings.promptOverrides}`;
  }

  return prompt.trim();
}
