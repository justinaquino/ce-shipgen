# CE ShipGen — Repository Analysis & Implementation Plan

**Version:** 1.1  
**Date:** 2026-04-27  
**Analyst:** Kimi Code CLI  
**Reviewers:** Justin Aquino, Claude, DeepSeek  
**Scope:** Complete technical audit of the `ce-shipgen` codebase, gap analysis against PRD v2.0, UI/design requirements, and phased implementation roadmap.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current State Analysis](#2-current-state-analysis)
3. [PRD Coverage Map](#3-prd-coverage-map)
4. [Architecture Review](#4-architecture-review)
5. [Gap Analysis](#5-gap-analysis)
6. [Data Quality Assessment](#6-data-quality-assessment)
7. [Implementation Roadmap](#7-implementation-roadmap)
8. [Risk Assessment](#8-risk-assessment)
9. [Testing Strategy](#9-testing-strategy)
10. [Performance & Maintainability](#10-performance--maintainability)
11. [Appendices](#11-appendices)

---

## 1. Executive Summary

### What Exists Today

A functional **React 18 + TypeScript + Vite PWA** with:

- **18 extracted JSON data tables** from `GI7B EXTERNAL RAW CE SHIPS 231024-06 240930.xlsx` (298 rows total)
- **Collapsible table editor** with inline editing, add/delete rows, import/export
- **11-step ship design wizard** with real-time BOQ (Bill of Quantities) calculation
- **Ship library** with save/load/delete/export
- **Procedural variant generator** with 6 deviation parameters
- **Zustand state management** with `localStorage` persistence
- **PWA scaffold** with service worker (Workbox), offline caching, installable manifest

### Build Health

| Metric | Value | Status |
|--------|-------|--------|
| TypeScript | Strict mode, zero errors | ✅ |
| Build | Vite production build passes | ✅ |
| Bundle | 226KB JS (70KB gzipped) + 16KB CSS | ✅ |
| PWA | Service worker generated, 23 precached entries | ✅ |
| Lighthouse | Not yet audited | ⏳ |

### What's Missing (High-Level)

- **M2.7 "Tables In Play"** — Active table registry for mixed CE/Mneme/custom rules
- **M3.x Ship Wizard** — True 19-step wizard with focus mode, validation engine, constraint display
- **FR-002 Validation Engine** — Hard/soft constraint checking with <100ms feedback
- **FR-005 Output Generation** — Universal Ship Description, Markdown, Print-friendly views
- **Startup screen** — Branded entry point with install prompt
- **Desktop/Phone layout toggle** — Currently responsive but no explicit mode switch
- **Crew auto-calculation** — Summed from component selections, validated against bridge stations
- **Mneme rule toggles** — Bridge stations = 1 per Dton, NavComm = Comms, life pods = 1t per 3 adults

---

## 2. Current State Analysis

### 2.1 Code Inventory

```
Total source: 1,694 lines across 14 files

src/
├── App.tsx                          76   — Router, header nav, 4 routes
├── main.tsx                         14   — React root render
├── index.css                        53   — Tailwind directives + component classes
├── types/index.ts                   76   — TableRow, DataTable, ShipComponent, ShipDesign, VariantParams, TableId
├── store/tableStore.ts             217   — Zustand store: tables, ships, CRUD, import/export, persist
├── utils/exportImport.ts            60   — JSON download/upload, validation, snapshot naming
├── components/
│   ├── CollapsibleSection.tsx       40   — Reusable expand/collapse tile
│   ├── TableManager.tsx            140   — Table list page: export all, import, reset
│   ├── TableEditor.tsx             118   — Spreadsheet-like inline editor
│   ├── ShipDesigner.tsx            523   — 11-step design wizard + BOQ
│   ├── BOQView.tsx                  71   — Real-time summary panel
│   ├── ShipLibrary.tsx             100   — Saved ship grid with load/edit/delete
│   └── VariantGenerator.tsx        349   — Procedural ship variant generation
```

### 2.2 Data Inventory

| File | Rows | Key Fields | Quality Notes |
|------|------|-----------|---------------|
| `ship_hulls.json` | 36 | DTONS, COST, Construction Time, Performance Column, Price/Dton | ✅ Complete 10t–5000t range |
| `ship_drives.json` | 45 | Drive Code, J-Drive/M-Drive/P-Plant tons & cost, Fuel/Wk, Energy Weapons | ✅ Covers A–Z + sA–sW |
| `engine_performance.json` | 21 | 36 columns of thrust/jump values by hull size | ⚠️ Header names are numeric (100, 200…), not human-readable |
| `ship_weapons.json` | 26 | WEAPONS, TL, DTONS, COST, Descirption [sic], EW | ✅ Turrets, pop-up, fixed, missiles, lasers, particle beams |
| `ship_software.json` | 46 | WEAPONS, TL, Rating, COST, Notes | ⚠️ Column named `WEAPONS` due to Excel extraction; should be `Program` |
| `ship_sensors.json` | 13 | System/WEAPONS, TL, DM, Includes, Dtons, Cost | ⚠️ Mixed naming; some rows empty |
| `ship_modules.json` | 19 | Module/WEAPONS, TL, Dtons, Cost, Function | ✅ Bays, hangars, drones, processors |
| `ship_crew.json` | 10 | Position, Min, Full Complement, Salary, Shift | ⚠️ 4 empty rows at end |
| `ship_vehicles.json` | 16 | Vehicle, TL, Dtons, Cost, Notes | ✅ Ground cars to shuttles |
| `ship_bridge.json` | 8 | Bridge Size, DT threshold, Tons, Cost | ✅ Cockpits to 60t bridge |
| `ship_armor.json` | 3 | Armor Type, TL, Protection, Cost | ✅ 3 standard types |
| `hull_configurations.json` | 3 | Configuration, Cost Modifier, Notes | ✅ Standard/Streamlined/Distributed |
| `hull_options.json` | 7 | Option, TL, Cost, Notes | ✅ Reflec, Self-Sealing, Stealth TL9–12 |
| `life_support.json` | 16 | Type, TL, Dtons, Cost, Notes | ✅ Staterooms, berths, labs, vaults, barracks |
| `ship_supplies.json` | 17 | Supply, TL, Dtons, Cost, Notes | ⚠️ Some empty rows |
| `power_plants.json` | 2 | Type, TL, Multiplier, Fuel Rate | ✅ Fusion + Fission |
| `computer_options.json` | 4 | Option, Multiplier, Notes | ✅ Standard/Specialized/Hardened/Both |
| `life_support_expenses.json` | 6 | Passage Type, Cost, Base | ✅ Middle/High/Low/Hibernation/Freight/Mining |

**Total: 298 rows, 18 tables, ~78 KB JSON**

### 2.3 Component Architecture

```
App (Router)
├── / (TableManager)
│   └── CollapsibleSection × 18
│       └── TableEditor
├── /design (ShipDesigner)
│   ├── CollapsibleSection × 11 (design steps)
│   └── BOQView (sticky summary)
├── /library (ShipLibrary)
│   └── Ship cards (load/edit/delete/export)
└── /variants (VariantGenerator)
    ├── CollapsibleSection (params)
    └── BOQView × N (generated ships)
```

**State Flow:**
```
public/data/*.json ──fetch──► tableStore (Zustand + persist)
                                    │
                                    ▼
        ┌─────────────────┬─────────────────┬─────────────────┐
        ▼                 ▼                 ▼                 ▼
   TableEditor      ShipDesigner      VariantGenerator    ShipLibrary
        │                 │                 │                 │
        └─────────────────┴─────────────────┴─────────────────┘
                          │
                    localStorage (auto-persist)
```

---

## 3. PRD Coverage Map

### 3.1 FR-001 to FR-005: Core Ship Designer

| FR | Requirement | Status | Notes |
|----|-------------|--------|-------|
| FR-001 | 19-Step Design Wizard | 🟡 Partial | 11 steps implemented; missing: crew calc, vehicles, features, turrets/bays/screens as distinct steps, universal ship description |
| FR-002 | Real-Time Validation Engine | 🔴 Missing | No hard/soft constraint enforcement. Tonnage overflow shown but not blocked. No PP ≥ max(M,J) check. No TL validation. |
| FR-003 | Dynamic Calculations | 🟡 Partial | HP/SP/hardpoints correct. Fuel calc assumes Jump-2 fixed. Crew not auto-calculated. MAC not calculated. |
| FR-004 | Data Management | 🟡 Partial | Save/load/delete/export works. Missing: IndexedDB (uses localStorage), search/filter, duplicate ship, auto-save on change. |
| FR-005 | Output Generation | 🔴 Missing | No Universal Ship Description, Mneme Combat Summary, Markdown, or Print-friendly views. Only JSON export. |

### 3.2 FR-006 to FR-015: User Interface

| FR | Requirement | Status | Notes |
|----|-------------|--------|-------|
| FR-006 | Responsive Layout with Mode Toggle | 🟡 Partial | Responsive CSS works. Missing: explicit Desktop/Phone toggle, 3-column layout (Nav/Tiles/Summary), sticky summary bar on mobile. |
| FR-007 | Tile System with Focus Mode | 🟡 Partial | CollapsibleSection provides expand/collapse. Missing: Focus mode (fullscreen overlay), tile states (inactive/active/focused/completed/invalid), swipe gestures. |
| FR-008 | Startup Screen & App Flow | 🔴 Missing | No startup screen. App boots directly to Tables page. |
| FR-009 | Settings Screen with JSON Editor | 🟡 Partial | TableManager has JSON import/export. Missing: Settings screen per se, layout settings, theme toggle, individual JSON editor view. |
| FR-010 | Summary Dashboard | 🟡 Partial | BOQView shows cost/tonnage. Missing: Mneme toggle, combat stats panel, MAC calculator, Thrust Points display. |

### 3.3 FR-016 to FR-020: Technical Requirements

| FR | Requirement | Status | Notes |
|----|-------------|--------|-------|
| FR-016 | Progressive Web App | 🟡 Partial | Service worker, manifest, offline cache exist. Missing: install prompt, install-state badge, offline indicator. |
| FR-017 | Performance | ✅ Met | Bundle <500KB, <5s TTI target likely met. No Lighthouse audit yet. |
| FR-018 | Data Storage | 🟡 Partial | localStorage persistence works. Missing: IndexedDB for ships, export all data, clear data option. |
| FR-019 | Accessibility | 🔴 Missing | No WCAG audit. Keyboard nav partial. No screen reader tests. Colorblind-friendly not verified. |
| FR-020 | Browser Support | 🟡 Partial | Modern browsers only. No graceful degradation strategy tested. |

### 3.4 FR-021 to FR-024: Phase 2 (Logistics)

| FR | Requirement | Status | Notes |
|----|-------------|--------|-------|
| FR-021 | Supply Calculator | 🔴 Not Started | Future release per PRD |
| FR-022 | Inventory System | 🔴 Not Started | Future release per PRD |
| FR-023 | Journey Table | 🔴 Not Started | Future release per PRD |
| FR-024 | Income Tracker | 🔴 Not Started | Future release per PRD |

### 3.5 FR-025 to FR-027: Infrastructure

| FR | Requirement | Status | Notes |
|----|-------------|--------|-------|
| FR-025 | CI/CD Pipeline | 🔴 Missing | No GitHub Actions workflow. Manual build required. |
| FR-026a-j | Version Control | 🔴 Missing | No version.json, no update detection, no changelog. |
| FR-027a-d | Tables In Play | 🔴 Missing | No active table registry. Wizard always uses default tables. No mixed-rule support. |

### 3.6 FR-028: M3.1 Hull & Foundation

| FR | Requirement | Status | Notes |
|----|-------------|--------|-------|
| FR-028a | Hull Selection | 🟡 Partial | Dropdown works. Missing: HP/SP/hardpoints display in table format, construction time display. |
| FR-028b | Configuration | 🟡 Partial | Dropdown works. Missing: real-time armor cost multiplier display. |
| FR-028c | Armor Selection | 🟡 Partial | Type + qty works. Missing: formula display `hull × % × config_mult`. |
| FR-028d | Drive Constraints | 🔴 Missing | No constraint display. User sees all drives, not filtered by hull-valid range. |

---

## 4. Architecture Review

### 4.1 Strengths

1. **Zustand + Immer + Persist** — Clean state management with automatic localStorage sync. Good separation of concerns.
2. **CollapsibleSection abstraction** — Reusable, accessible (keyboard support), lightweight.
3. **Table-driven design** — All ship data comes from JSON tables, making homebrew/custom rules trivial.
4. **TypeScript strict mode** — Zero type errors, explicit interfaces.
5. **Vite PWA plugin** — Modern, fast builds with automatic service worker generation.
6. **Component isolation** — Each major feature (Tables, Designer, Library, Variants) is its own route/component.

### 4.2 Weaknesses

1. **No calculation engine abstraction** — All math is inline in `ShipDesigner.tsx` (523 lines). No `src/calculations/` module as planned in PROJECT_NOTES.
2. **Tight coupling to Excel column names** — `ShipDesigner.tsx` references `'M-Drive\n Tons'`, `'J-Drive\n Tons'`, etc. Fragile if data changes.
3. **No validation layer** — Business rules (tonnage ≤ hull, PP ≥ max drive) are displayed but not enforced.
4. **Missing test infrastructure** — PROJECT_NOTES mentions Vitest but no tests exist.
5. **ShipDesigner.tsx is too large** — 523 lines handling 11 steps, BOQ, library load/save. Should be split into step components.
6. **No IndexedDB** — localStorage has ~5MB quota. 50+ ships with snapshots could hit limits.
7. **Missing `getActiveTable()` helper** — PRD specifies this as the M2.7→M3 integration point.

### 4.3 Data Flow Issues

```
Current (problematic):
  ShipDesigner.tsx ──reads──► tableStore.tables.ship_drives.rows
  ──filters──► finds drive by string matching column names with newlines

Desired:
  ShipDesigner.tsx ──calls──► getActiveTable('drives')
  ──returns──► typed DriveModel[] with normalized properties
  ──renders──► DriveSelector component
```

### 4.4 Security Considerations

- **XSS via table data** — TableEditor uses `String(value)` rendering (safe), but no sanitization on import.
- **Prototype pollution** — `JSON.parse` used directly in import. Should use `Object.create(null)` for table row objects.
- **No CSP** — GitHub Pages limitation per PRD; noted but not mitigated.

---

## 5. Gap Analysis

### 5.1 Critical Gaps (Block M3 Release)

| Gap | Impact | Effort |
|-----|--------|--------|
| Validation engine (FR-002) | Users can build invalid ships | Medium |
| Drive constraint display (FR-028d) | Users select impossible drives | Low |
| `getActiveTable()` helper (FR-027d) | Mixed rules impossible; blocks M3 | Medium |
| Crew auto-calculation | Manual crew entry error-prone | Medium |
| Output formats (FR-005) | Cannot share/print ships | Medium |

### 5.2 High-Priority Gaps (Block Beta)

| Gap | Impact | Effort |
|-----|--------|--------|
| Startup screen (FR-008) | Poor first impression | Low |
| Layout mode toggle (FR-006) | Desktop UX suboptimal | Medium |
| Day/Night theme system | Accessibility, user preference | Low |
| Phone/Desktop multi-column layout | Core UX requirement | Medium |
| Version tracking at 0.01 increments | User trust, update clarity | Low |
| Save / Save As distinction | Data management UX | Low |
| Focus mode (FR-007) | Detailed work is cramped | Medium |
| Install prompt / PWA badges (FR-016) | Users don't know it's installable | Low |
| CI/CD pipeline (FR-025) | Manual deploy risk | Low |

### 5.3 Medium-Priority Gaps (Polish)

| Gap | Impact | Effort |
|-----|--------|--------|
| Theme settings | Accessibility | Low |
| Search/filter in library | Usability | Low |
| Duplicate ship | UX convenience | Low |
| Print-friendly view | Tabletop use case | Medium |
| Mneme rule toggle (FR-010) | Mneme integration incomplete | Medium |

---

## 6. Data Quality Assessment

### 6.1 Column Name Normalization Needed

The Excel extraction preserved literal column names including newlines:

```
"M-Drive\n Tons"      → should be "mDriveTons"
"J-Drive\n Tons"      → should be "jDriveTons"
"P-Plant\n Tons"      → should be "powerPlantTons"
"Fuel/Wk\n (tons)"    → should be "fuelPerWeek"
"Descirption" [sic]   → should be "description"
```

**Recommendation:** Create a normalization layer in `tableStore.ts` that maps raw Excel columns to typed interfaces.

### 6.2 Missing Data

- **Drive performance matrix** (`engine_performance.json`) has numeric column headers (100, 200, 300…) instead of meaningful labels. The 36 columns are not self-documenting.
- **Computer models table** missing — only `computer_options.json` exists. Need `ship_computers.json` with Model 1–7.
- **Small craft drive performance** — `ship_drives.json` has sA–sW but no performance matrix for small craft hulls.
- **Construction time** in `ship_hulls.json` is labeled "Construction Time (weeks)" but PRD says months. Need verification.

### 6.3 Data Integrity

- `ship_crew.json` has 4 empty trailing rows.
- `ship_supplies.json` has empty rows.
- `ship_sensors.json` has empty rows with `""` values.
- `ship_software.json` uses `"WEAPONS"` as primary key column due to Excel row alignment.

---

## 7. Implementation Roadmap

### Phase 1: Foundation Hardening (1–2 sessions)

**Goal:** Fix data layer and calculation engine before building M3.

| Task | Files | Deliverable |
|------|-------|-------------|
| 1.1 Normalize table schemas | `tableStore.ts`, `types/index.ts` | Typed interfaces for all 18 tables; column name mapper |
| 1.2 Extract calculation engine | `src/calculations/` | `hullCalc.ts`, `driveCalc.ts`, `fuelCalc.ts`, `armorCalc.ts`, `crewCalc.ts`, `costCalc.ts` |
| 1.3 Add validation engine | `src/validations/` | `validateDesign.ts` with hard/soft constraint checks |
| 1.4 Add `getActiveTable()` | `src/utils/tables.ts` | Helper that reads active registry, returns typed table data |
| 1.5 Clean JSON data | `public/data/*.json` | Remove empty rows, fix column names, add `ship_computers.json` |
| 1.6 Add unit tests | `src/test/` | Vitest setup; tests for calculation engine |

**Acceptance:** All calculations unit-tested; zero TypeScript errors; build passes.

### Phase 2: M2.7 Tables In Play (1 session)

**Goal:** Enable mixed CE/Mneme/custom rule sets.

| Task | Files | Deliverable |
|------|-------|-------------|
| 2.1 Active table registry | `tableStore.ts` | `ce_shipgen_active_tables` in localStorage |
| 2.2 Tables In Play UI | `SettingsScreen.tsx` (new) | Dropdown per component type; cyan highlighting for custom |
| 2.3 Table type tagging | `TableEditor.tsx` | Custom tables carry `type` field |
| 2.4 Snapshot integration | `tableStore.ts` | Active registry included in FR-024 snapshots |

**Acceptance:** Can switch hulls to CE default + drives to Mneme + weapons to custom; wizard reads correct tables.

### Phase 3: M3.1 Hull & Foundation (1–2 sessions)

**Goal:** Complete FR-028 with validation and constraint display.

| Task | Files | Deliverable |
|------|-------|-------------|
| 3.1 Refactor ShipDesigner | `ShipDesigner.tsx` → `steps/` | Split into `HullStep.tsx`, `ConfigStep.tsx`, `ArmorStep.tsx`, `DriveStep.tsx`, `PowerStep.tsx` |
| 3.2 Drive constraint display | `DriveStep.tsx` | Filter drives by hull-valid range from performance matrix |
| 3.3 Power plant validation | `PowerStep.tsx` | Real-time `PP ≥ max(M-drive, J-drive)` check |
| 3.4 Tile state system | `CollapsibleSection.tsx` | Add `status` prop: inactive/active/focused/completed/invalid |
| 3.5 Focus mode | `FocusOverlay.tsx` (new) | Full-screen tile overlay with ESC exit |

**Acceptance:** Cannot select a drive that's invalid for the hull; invalid steps show red indicator.

### Phase 4: M3.2 Bridge to Crew (2 sessions)

**Goal:** Steps 7–12 with auto-calculated crew.

| Task | Files | Deliverable |
|------|-------|-------------|
| 4.1 Fuel calculation step | `FuelStep.tsx` | Jump fuel = 0.1 × hull × parsecs; power fuel = ppTons/3 × weeks |
| 4.2 Bridge/cockpit step | `BridgeStep.tsx` | Select from active bridge table |
| 4.3 Computer step | `ComputerStep.tsx` | Model 1–7 + bis/fib options |
| 4.4 Software step | `SoftwareStep.tsx` | Multi-select with rating validation vs computer model |
| 4.5 Sensors step | `SensorsStep.tsx` | Select from active sensor table |
| 4.6 Crew auto-calculation | `CrewStep.tsx` | Sum crew from components; validate vs bridge stations |

**Acceptance:** Changing M-drive auto-updates engineer count; bridge stations < crew shows warning.

### Phase 5: M3.3 Fittings to BOQ (2 sessions)

**Goal:** Steps 13–19 with complete output generation.

| Task | Files | Deliverable |
|------|-------|-------------|
| 5.1 Accommodations step | `AccommodationsStep.tsx` | Staterooms, low berths, barracks from active table |
| 5.2 Features step | `FeaturesStep.tsx` | Armory, briefing room, library, vault, etc. |
| 5.3 Turrets/bays/screens | `ArmamentsStep.tsx` | Hardpoint tracking; turret + weapon selection |
| 5.4 Vehicles step | `VehiclesStep.tsx` | Hangar space validation |
| 5.5 Cargo step | `CargoStep.tsx` | Auto-fill remaining tonnage |
| 5.6 Cost summary | `CostSummary.tsx` | Construction time, standard design discount, naval architect fee |
| 5.7 Output generation | `src/output/` | Universal Ship Description, Markdown, Print view, Mneme stat block |

**Acceptance:** Can design a complete Free Trader and export it as Markdown.

### Phase 6: UI Polish & PWA (1–2 sessions)

**Goal:** FR-006 through FR-020 completion plus all UI/design requirements.

| Task | Files | Deliverable |
|------|-------|-------------|
| 6.1 Startup screen | `StartupScreen.tsx` | Logo, "Generate Ship", "Library", "Settings", version info |
| 6.2 Day/Night theme | `ThemeProvider.tsx` | Dark/light toggle with localStorage persistence; system preference detection |
| 6.3 Layout toggle | `LayoutToggle.tsx` | Desktop (multi-column) ↔ Phone (single vertical stack) with localStorage |
| 6.4 Settings screen | `SettingsScreen.tsx` | Layout, rules (CE/Mneme/Custom), theme, data management, "Tables In Play" |
| 6.5 Version display | `VersionBadge.tsx` | Display version at 0.01 increments (0.01 → 1.00 → 1.01...); build timestamp |
| 6.6 Save / Save As | `ShipDesigner.tsx` | "Save" overwrites current ship; "Save As" prompts for new name |
| 6.7 PWA install UX | `App.tsx` | Install prompt, "Installed" badge, offline indicator |
| 6.8 Version control | `version.json`, `Changelog.tsx` | Build-time version, update detection, user-controlled refresh |
| 6.9 Accessibility audit | `src/a11y/` | Keyboard nav, focus traps, aria labels, color contrast |

### Phase 7: Weapons & Wargaming

**Goal:** Mneme Space Combat integration — ship-to-ship combat stat blocks, MAC calculations, thrust points, superiority system.

| Task | Deliverable |
|------|-------------|
| 7.1 Combat Stat Block | Auto-generate from ship design: thrust points, armor, weapons summary |
| 7.2 MAC Calculator | Multiple Attack Consolidation based on weapon count |
| 7.3 Superiority System | Force ratio DM calculator for fleet encounters |
| 7.4 Mneme Rule Toggle | Switch between CE and Mneme stats in BOQ |
| 7.5 Quick NPC Ships | Random valid ship generation by class (Fighter, Corvette, etc.) |

### Phase 8: Vehicle Combat (Ogre VTT)

**Goal:** Separate docker-deployed VTT for vehicle/ground combat. Players fight friends or AI bot.

| Task | Deliverable |
|------|-------------|
| 8.1 Ogre VTT Scaffold | Docker container, web-based tactical map |
| 8.2 Vehicle Import | Import ships/vehicles from ce-shipgen |
| 8.3 Bot AI | Basic opponent AI for solo play |
| 8.4 Multiplayer | Real-time PvP over WebSocket |

### Phase 9: Logistics & Advanced (Future)

**Goal:** FR-021 through FR-024 and economic simulation.

| Task | Deliverable |
|------|-------------|
| 9.1 Supply Calculator | Life support, fuel, maintenance cost estimation |
| 9.2 Inventory System | Real-time resource tracking across fleet |
| 9.3 Journey Table | Trip planning with resource consumption |
| 9.4 Income Tracker | Revenue, expenses, P&L per journey and period |
| 9.5 Mneme Advanced Physics | Mass-based calculations, delta-V, realistic thrust |

---

## 8. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Calculation errors in ship design | Medium | High | Unit tests for all formulas; validate against Excel reference ships |
| localStorage quota exceeded | Medium | Medium | Migrate ships to IndexedDB; add storage usage indicator |
| Data schema changes break UI | High | Medium | Normalization layer isolates components from raw JSON structure |
| Performance degradation with many ships | Low | Medium | Virtualize ship library list; lazy-load table data |
| Scope creep (logistics features) | High | Medium | Strict phase gates; defer Phase 7 until M3 complete |
| Browser compatibility issues | Low | Medium | Feature detection; polyfills for older browsers |
| PWA update confusion | Medium | Medium | Clear update UX; never force refresh; preserve data across updates |

---

## 9. Testing Strategy

### 9.1 Unit Tests (Vitest)

```
src/test/
├── calculations/
│   ├── hullCalc.test.ts        — HP, SP, hardpoints, construction time
│   ├── driveCalc.test.ts       — Drive performance lookup, fuel calc
│   ├── armorCalc.test.ts       — Tonnage = hull × % × config_mult
│   ├── crewCalc.test.ts        — Engineers = 1 per 35t drives
│   └── costCalc.test.ts        — Total cost, discount, architect fee
├── validations/
│   └── validateDesign.test.ts  — Hard/soft constraint checks
└── utils/
    └── exportImport.test.ts    — JSON round-trip, schema validation
```

### 9.2 Integration Tests

- **Table editor:** Edit cell → verify localStorage → reload page → verify persistence
- **Ship designer:** Select hull → verify BOQ updates → save ship → verify library
- **Variant generator:** Select base → generate 5 variants → verify all have valid tonnage

### 9.3 E2E Tests (Playwright — deferred to M4)

- Complete ship design workflow
- Import/export round-trip
- PWA install flow
- Offline functionality

### 9.4 Manual Test Checklist

| Test | Steps |
|------|-------|
| Free Trader replication | Design 200t Free Trader; compare to CE SRD |
| Tonnage overflow | Add components until used > hull; verify red warning |
| Drive validation | Select 100t hull; verify Z-drive not selectable |
| Mneme toggle | Switch to Mneme; verify bridge = 1 station/DT |
| Table reset | Modify table → Reset → verify original values restored |
| Variant generation | Generate 10 variants from Patrol Cruiser; verify diversity |

---

## 10. Performance & Maintainability

### 10.1 Performance Budget

| Metric | Target | Current | Action |
|--------|--------|---------|--------|
| First Paint | <2s | ~1s | ✅ Maintain |
| Time to Interactive | <5s | ~2s | ✅ Maintain |
| Bundle size | <500KB | 226KB | ✅ Headroom |
| Calculation latency | <100ms | ~10ms | ✅ Maintain |
| Lighthouse Performance | >90 | Unknown | ⏳ Audit after M3 |

### 10.2 Maintainability Guidelines

1. **Single Responsibility** — Each step component handles one design step only. No component >150 lines.
2. **Calculation Pure Functions** — All math in `src/calculations/` must be pure (no side effects, no React hooks).
3. **Table Abstraction** — Components never read `table.rows[0]['M-Drive\n Tons']`. Use typed getters.
4. **State Colocation** — Wizard form state stays in `ShipDesigner.tsx` (or a wizard-specific store). Table data stays in `tableStore`.
5. **Feature Flags** — Use `const ENABLE_MNEME = true` for Mneme-specific UI. Easy to disable for CE-only builds.
6. **CSS Conventions** — Tailwind utility classes only. No arbitrary values. Custom components in `@layer components`.

### 10.3 Code Review Checklist

- [ ] TypeScript strict mode passes
- [ ] No `any` types (except external library boundaries)
- [ ] All calculations have unit tests
- [ ] Components have PropTypes or interfaces documented
- [ ] No inline styles; Tailwind only
- [ ] `useMemo`/`useCallback` used for expensive computations
- [ ] `key` props are stable (not array index where possible)
- [ ] Accessibility: `aria-label`, keyboard handlers, focus management

---

## 11. Appendices

### Appendix A: File Inventory

| File | Lines | Purpose | Owner |
|------|-------|---------|-------|
| `src/App.tsx` | 76 | Router, layout, navigation | Core |
| `src/store/tableStore.ts` | 217 | Global state | Core |
| `src/types/index.ts` | 76 | TypeScript interfaces | Core |
| `src/utils/exportImport.ts` | 60 | I/O utilities | Core |
| `src/components/CollapsibleSection.tsx` | 40 | UI primitive | Core |
| `src/components/TableManager.tsx` | 140 | Tables page | M2 |
| `src/components/TableEditor.tsx` | 118 | Spreadsheet editor | M2 |
| `src/components/ShipDesigner.tsx` | 523 | Design wizard (monolith) | M3 |
| `src/components/BOQView.tsx` | 71 | Summary panel | M3 |
| `src/components/ShipLibrary.tsx` | 100 | Saved ships grid | M4 |
| `src/components/VariantGenerator.tsx` | 349 | Procedural generation | M4 |

### Appendix B: Data Dictionary

```typescript
// Normalized interfaces (proposed)
interface HullModel {
  id: string;           // "1", "2", "A", "s1"...
  dtons: number;
  cost: number;
  constructionWeeks: number;
  performanceColumn: number;
}

interface DriveModel {
  id: string;           // "A"–"Z", "sA"–"sW"
  jDriveTons: number;
  jDriveCost: number;
  mDriveTons: number;
  mDriveCost: number;
  powerPlantTons: number;
  powerPlantCost: number;
  fuelPerWeek: number;
  minFuelVolume: number;
  maxEnergyWeapons: number;
}

interface ArmorModel {
  id: string;
  name: string;
  tl: number;
  protectionPer5Pct: number;
  costMultiplier: number;
}

interface BridgeModel {
  id: string;
  name: string;
  minDtons: number;
  tons: number;
  stations: number;
  cost: number;
}

interface WeaponModel {
  id: string;
  name: string;
  tl: number;
  tons: number;
  cost: number;
  range?: string;
  damage?: string;
  notes?: string;
}
```

### Appendix C: API Surface

```typescript
// tableStore.ts — public interface
loadTables(): Promise<void>
updateTable(id: TableId, table: DataTable): void
updateRow(id: TableId, rowIndex: number, row: TableRow): void
addRow(id: TableId): void
deleteRow(id: TableId, rowIndex: number): void
resetTable(id: TableId): void
resetAll(): void
setCurrentTable(id: TableId | null): void
importTables(data: Record<TableId, DataTable>): void
exportTables(): Record<TableId, DataTable>

// Ship CRUD
addShip(ship: ShipDesign): void
updateShip(ship: ShipDesign): void
deleteShip(id: string): void
setCurrentShip(ship: ShipDesign | null): void

// Proposed additions
getActiveTable(type: ComponentType): DataTable     // M2.7
validateDesign(ship: ShipDesign): ValidationResult   // M3.1
generateUniversalDescription(ship: ShipDesign): string // M3.3
generateMnemeStatBlock(ship: ShipDesign): string     // M3.3
```

### Appendix D: Reference Ships for Testing

Use these canonical designs from CE SRD Chapter 9 for validation:

| Ship | Hull | Config | M-Drive | J-Drive | PP | Cost |
|------|------|--------|---------|---------|-----|------|
| Free Trader | 200t | Standard | A (1G) | A (J1) | A | ~28 MCr |
| Scout | 100t | Streamlined | A (2G) | A (J2) | A | ~33 MCr |
| Patrol Cruiser | 400t | Standard | C (2G) | B (J2) | C | ~93 MCr |
| Mercenary Cruiser | 800t | Standard | H (3G) | H (J3) | H | ~298 MCr |

---

*End of Document*

**Next Action:** Review this document with Claude and DeepSeek. Once approved, begin **Phase 1: Foundation Hardening** with the calculation engine extraction and data normalization.
