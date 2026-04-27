# Agent Context: CE ShipGen

## Project
Cepheus Engine Ship Generator — A PWA for designing starships with Mneme Space Combat integration.

## Tech Stack
- React 18 + TypeScript (strict)
- Vite (build) + vite-plugin-pwa
- Tailwind CSS (utility-first, custom `@layer components`)
- Zustand + Immer + Persist (state management)
- React Router (navigation)
- Lucide React (icons)

## Design System
See `UI_DESIGN_REQUIREMENTS.md` for full spec. Key points:
- Dark mode default; day/night toggle required
- Desktop = multi-column; Phone = single vertical stack
- Version tracked at 0.01 increments
- All data local (localStorage now, IndexedDB future)
- Save/Save As/Import/Export for everything

## Data Architecture
- Source tables in `public/data/*.json` (factory defaults)
- User edits stored in `localStorage` via Zustand persist
- Active table registry (`ce_shipgen_active_tables`) for mixed CE/Mneme/custom rules
- Ships stored in Zustand state, persisted to localStorage

## Code Conventions
- **Strict TypeScript** — no `any`, no unused variables
- **Components max 150 lines** — split if larger
- **Calculations are pure functions** — in `src/calculations/`, no React hooks
- **Table column names normalized** — never reference raw Excel names with `\n` in components
- **Feature flags** — use `const ENABLE_FEATURE = true` for toggles

## Current Phase
Phase 1: Foundation Hardening
- Normalize table schemas
- Extract calculation engine
- Add validation engine
- Fix data quality issues

## Roadmap Phases
1. Foundation Hardening (calc engine, data normalization)
2. M2.7 Tables In Play (mixed rules)
3. M3.1 Hull & Foundation (ship wizard steps 1–3)
4. M3.2 Bridge to Crew (steps 7–12)
5. M3.3 Fittings to BOQ (steps 13–19 + output formats)
6. UI Polish & PWA (startup screen, theme, layout, version)
7. Weapons & Wargaming (Mneme combat stats)
8. Vehicle Combat / Ogre VTT (separate Docker app)
9. Logistics & Advanced (supply, inventory, journey, income)

## Files That Matter
- `src/store/tableStore.ts` — Global state
- `src/types/index.ts` — TypeScript interfaces
- `REPO_ANALYSIS_AND_IMPLEMENTATION_PLAN.md` — Full audit & roadmap
- `UI_DESIGN_REQUIREMENTS.md` — Design system spec
- `PRD.md` — Original product requirements
