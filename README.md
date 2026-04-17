# Whole Life Centre Planner

A web-based planning and visualisation platform for designing the **Whole Life Centre** — a self-sufficient, clinically informed village for people with PACS1 and associated complex lifelong care needs.

## Features

- **Project Dashboard** — create projects from the pre-built WLC template (33 facilities) or a blank canvas; import/export JSON; delete and manage saved projects.
- **Interactive Planner** — drag, resize, rotate and classify facilities on a 1 200 × 800 canvas (react-konva). Zoom with scroll or the ± controls. Toggle grid and facility labels. Layer visibility panel hides/shows buildings, paths, gardens, water, services, parking, labels, and the site boundary independently.
- **Facility Palette** — 23 facility types across 9 zone categories (Residential, Adult Care, Therapy & Health, Community, Family & Respite, Recreational, Landscape & Sensory, Operations & Services, Commercial & Training). Each type ships with default metadata: care tags, accessibility notes, support level, and capacity.
- **Facility Inspector** — select any facility to live-edit its name, zone, description, capacity, support level, care tags, accessibility notes, dimensions, rotation, render-inclusion toggle, and lock toggle.
- **Render Studio** — generates a structured AI image prompt from the live plan state (facility list, zone breakdown, capacity, atmosphere). Choose a style preset (Warm Watercolour, Presentation Board, Landscape Plan, Technical Plan) and render mode, then copy the prompt into DALL-E 3, Midjourney, or Stable Diffusion.
- **Export** — download the full project as JSON (re-importable), or export a facility schedule as CSV.
- **Auto-save** — the project state is persisted to `localStorage` automatically via Zustand.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to launch the app.

```bash
npm run build   # production build
npm run lint    # ESLint
```

## Project Structure

```
app/            Next.js App Router shell (layout, page, globals.css)
components/     UI components (Dashboard, PlannerScreen, PlannerCanvas,
                FacilityPalette, FacilityInspector, RenderScreen,
                ExportScreen, TopBar, LayerControls)
lib/            Domain logic
  types.ts          TypeScript types (Project, Facility, Zone, Path, RenderSettings)
  facilityTypes.ts  23 facility templates with metadata and zone colours
  defaultTemplate.ts  Pre-positioned WLC template + blank project factory
  store.ts          Zustand store with localStorage persistence
  promptGenerator.ts  AI render prompt builder
```

## Data Model

Projects are stored as JSON and can be exported/imported via the Export screen or the Import JSON button on the Dashboard. The schema matches the `Project` type in `lib/types.ts`.

## Known Limitations

- Canvas PNG export requires a browser screenshot; a native download is planned for a future release.
- The Render Studio generates prompts only — it does not call an image API directly. Copy the prompt into your preferred AI image tool.
- No multi-user collaboration or server-side persistence in this release.
