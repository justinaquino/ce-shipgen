# CE ShipGen PRD v2.0
## Product Requirements Document

**Version:** 2.0  
**Date:** 2026-03-02  
**Status:** Ready for Implementation  
**Based On:** 
- Cepheus Engine Chapter 8
- Mneme Space Combat v2.41-v2.45
- GI7B Raw Excel Tables

---

## 1. EXECUTIVE SUMMARY

### 1.1 Vision Statement
Create a Progressive Web App (PWA) that implements the complete Cepheus Engine ship design system with Mneme Space Combat integration, allowing players to design, validate, and export starship specifications on any device with a modern browser.

### 1.2 Success Criteria
- [ ] 100% coverage of CE Chapter 8 ship design rules
- [ ] 100% coverage of Mneme Space Combat additions
- [ ] Offline-first PWA functionality
- [ ] Real-time validation with zero calculation errors
- [ ] Universal Ship Description Format export
- [ ] Mobile-responsive design (320px-2560px)

---

## 2. FUNCTIONAL REQUIREMENTS

### 2.1 Core Ship Designer (FR-001 to FR-020)

#### FR-001: 19-Step Design Wizard
**Priority:** Critical
**Description:** Implement the complete ship design checklist

**Steps:**
1. Hull Selection (18 sizes)
2. Configuration (3 types)
3. Armor (3 types + options)
4. M-Drive (optional)
5. J-Drive (optional)
6. Power Plant (validated)
7. Fuel Calculation (auto)
8. Bridge/Cockpit
9. Computer (7 models + options)
10. Software (5+ programs)
11. Sensors (5 types)
12. Crew Calculation (auto)
13. Accommodations (18 types)
14. Features (optional)
15. Turrets/Bays/Screens
16. Weapons (8 types)
17. Vehicles (11 types)
18. Cargo (remainder)
19. Cost Summary

**Acceptance:** User can complete all steps, data persists between steps

---

#### FR-002: Real-Time Validation Engine
**Priority:** Critical
**Description:** Instant validation of all design choices

**Hard Constraints (Block if violated):**
- Tonnage used ≤ Hull Dtons
- Power Plant ≥ max(M-Drive, J-Drive) letter
- Hardpoints ≤ floor(Hull/100)
- Bridge stations ≥ Required crew positions
- Tech Level ≥ Component requirements

**Soft Warnings (Warn but allow):**
- Fuel < 2 weeks operation
- Weapons without fire control
- Jump drive without navigation software
- Crew > life support capacity

**Acceptance:** Zero calculation errors, instant feedback <100ms

---

#### FR-003: Dynamic Calculations
**Priority:** Critical
**Description:** Auto-calculate all derived values

**Calculations:**
- Hull Points = floor(Dtons/50)
- Structure Points = ceil(Dtons/50)
- Jump Fuel = 0.1 × Dtons × Jump Range
- Weekly Fuel = PowerPlantTons/3
- Total Cost (sum of all components)
- Construction Time (from hull)
- Crew Requirements (by component)
- Passenger Capacity (by staterooms)
- MAC Potential (by weapon count)

**Acceptance:** All calculations match reference tables

---

#### FR-004: Data Management
**Priority:** High
**Description:** Save, load, export ship designs

**Features:**
- Local storage (IndexedDB)
- JSON export/import
- Ship library with search/filter
- Duplicate ship
- Delete with confirmation
- Auto-save on change

**Acceptance:** Data persists across sessions, export/import works

---

#### FR-005: Output Generation
**Priority:** High
**Description:** Generate ship documentation

**Formats:**
1. Universal Ship Description (text)
2. Mneme Combat Summary
3. JSON (full data)
4. Markdown
5. Print-friendly view

**Acceptance:** All formats contain complete ship data

---

### 2.2 User Interface (FR-006 to FR-015)

#### FR-006: Responsive Layout with Mode Toggle
**Priority:** Critical
**Description:** Two distinct layout modes with manual toggle

**Desktop/Tablet Mode (Landscape):**
- Horizontal tiling (left-to-right)
- Three columns: Navigation (15%), Tiles (55%), Summary (30%)
- All 19 tiles visible side-by-side or in grid

**Phone/Mobile Mode (Portrait):**
- Vertical tiling (top-to-bottom)
- Sticky summary bar at top
- Scrollable tiles stack
- Bottom navigation or swipe gestures

**Layout Toggle:**
- Manual button in header
- Auto-detect viewport size
- Store preference in localStorage

**Acceptance:** No horizontal scroll on mobile, all features accessible, toggle works instantly

---

#### FR-007: Tile System with Focus Mode
**Priority:** Critical
**Description:** Each step is a tile with expandable focus mode

**Tile States:**
- **Inactive:** Collapsed, shows only header
- **Active:** Expanded, shows content
- **Focused:** Full-screen overlay, maximum space
- **Completed:** Checkmark indicator
- **Invalid:** Error indicator

**Focus Mode:**
- Click tile header or "Focus" button
- Tile expands to fill container
- Other tiles collapse to minimal headers
- Press ESC or "Exit Focus" to return
- Mobile: Swipe between tiles in focus mode

**Acceptance:** All 19 tiles render, focus mode works on all screen sizes, can exit easily

---

#### FR-008: Startup Screen & App Flow
**Priority:** High
**Description:** Entry point with navigation to settings and design

**Layout:**
- Centered card on branded background
- Logo at top
- Primary: "Generate Ship" large button
- Secondary: "Load Ship", "Settings", "Help"
- Version info at bottom

**Flow:**
```
Startup → [Generate Ship] → Design Workflow
     ↓
   [Settings] → Edit JSON / Edit Rules / Preferences
     ↓
   [Load Ship] → Library
```

**Acceptance:** All buttons work, smooth transitions, mobile-friendly, back returns to startup

---

#### FR-009: Settings Screen with JSON Editor
**Priority:** High
**Description:** Pre-design configuration with editable data tables

**Sections:**
1. **Layout Settings:** Desktop/Phone mode, focus behavior, animations
2. **Rule Settings:** Cepheus/Mneme/Custom, individual rule toggles
3. **JSON Table Editor:**
   - Select table from dropdown
   - Inline JSON editor with syntax highlighting
   - Real-time schema validation
   - Preview, Save, Export, Reset, Import
4. **Theme Settings:** Dark/Light/Auto, colors, fonts
5. **Data Management:** Export/Import/Clear all ships

**Acceptance:** JSON editor validates schema, changes apply immediately, import/export works, settings persist

---

#### FR-010: Summary Dashboard
**Priority:** Medium
**Description:** Switch between CE and Mneme rules

**Toggle:** Standard CE / Mneme Space Combat

**Changes when Mneme:**
- Bridge: 1 station per Dton (not fixed sizes)
- NavComm: Uses Comms skill
- Life pods: 1t per 3 adults
- Add combat stats panel
- Add MAC calculator
- Show Thrust Points

**Acceptance:** Toggle switches all relevant displays

---

### 2.3 Technical Requirements (FR-016 to FR-025)

#### FR-016: Progressive Web App
**Priority:** Critical
**Requirements:**
- Service worker for offline use
- Web App Manifest
- Install prompt
- Works offline after first load
- Background sync (optional)

**Acceptance:** Passes Lighthouse PWA audit

---

#### FR-017: Performance
**Priority:** Critical
**Targets:**
- First paint: <2s on 4G
- Time to interactive: <5s
- Calculation updates: <100ms
- Animations: 60fps
- Bundle size: <500KB (gzipped, excluding data)

**Acceptance:** Lighthouse Performance score >90

---

#### FR-018: Data Storage
**Priority:** High
**Requirements:**
- IndexedDB for ship designs
- LocalStorage for preferences
- Data never sent to server (privacy)
- Export all data function
- Import with validation

**Acceptance:** 100+ ships can be stored locally

---

#### FR-019: Accessibility
**Priority:** High
**Requirements:**
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader compatible
- Color-blind friendly (not just color)
- Focus indicators
- Alt text for icons

**Acceptance:** Passes axe-core audit

---

#### FR-020: Browser Support
**Priority:** High
**Requirements:**
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

**Graceful Degradation:** Core functions work on older browsers

---

## 3. DATA REQUIREMENTS

### 3.1 Embedded Data

The app must include all data from:

**13 JSON Files:**
1. ship_hulls.json (18 entries)
2. ship_drives.json (26 drive codes)
3. hull_configurations.json (3 types)
4. ship_armor.json (3 types + options)
5. ship_bridge_computer.json (4 bridge sizes, 7 computer models)
6. ship_software.json (5 programs)
7. ship_sensors.json (5 types)
8. ship_crew.json (14 positions)
9. life_support.json (18 components)
10. ship_weapons.json (8 weapons)
11. ship_missiles.json (3 types)
12. ship_vehicles.json (11 vehicles)
13. smallcraft_drives.json (21 small craft codes)

**Total:** 137+ data entries

### 3.2 Data Schema

See MASTER_RULES_CONSOLIDATION.md for complete schemas

Key entities:
- ShipDesign (main object)
- Hull, Drives, Armor, Bridge, Computer
- Software[], Sensors, Crew, Accommodations
- Weapons[], Vehicles[], Cargo

### 3.3 Calculation Engine

**Must implement:**
- Hull Points calculation
- Drive performance lookup (by hull size)
- Power plant validation
- Fuel calculations
- Armor cost/tonnage
- Weapon MAC calculation
- Crew requirements
- Total cost with discounts

---

## 4. USER STORIES

### 4.1 Primary Use Cases

**US-001: New Player Designs First Ship**
1. Opens app on phone
2. Clicks "New Ship"
3. Follows wizard through 19 steps
4. Sees real-time cost/tonnage updates
5. Saves ship to library
6. Exports to JSON for game

**US-002: Referee Creates NPC Ships**
1. Opens app on laptop
2. Switches to "Quick NPC" mode (Mneme)
3. Selects ship class (Fighter, Corvette, etc.)
4. App generates random valid ship
5. Referee adjusts weapons
6. Prints combat stat block

**US-003: Player Modifies Existing Ship**
1. Opens library
2. Searches for "Free Trader"
3. Duplicates existing design
4. Upgrades J-Drive
5. Adjusts fuel accordingly
6. Saves as new variant

**US-004: Group Shares Designs**
1. Player exports ship as JSON
2. Shares file via messaging
3. Referee imports to library
4. All ships available offline

---

## 5. NON-FUNCTIONAL REQUIREMENTS

### 5.1 Security
- No server-side processing (pure client-side)
- No personal data collection
- No cookies for tracking
- All calculations local

### 5.2 Privacy
- Ships stored locally only
- No cloud sync required
- Export/import under user control
- Clear data deletion option

### 5.3 Maintainability
- Component-based architecture
- TypeScript for type safety
- Unit tests for calculations
- E2E tests for critical paths

---

## 6. OUT OF SCOPE (Future Releases)

### Version 2.x (Future)
- PDF export with ship diagrams
- 3D ship viewer (basic)
- Ship comparison tool
- Cost optimization suggestions
- Campaign management integration

### Version 3.x (Future)
- Cloud sync (optional)
- Ship sharing marketplace
- Deck plan generator
- Trade route calculator
- Combat simulator

---

## 7. ACCEPTANCE CRITERIA

### 7.1 MVP Complete When:
- [ ] All 19 design steps functional
- [ ] 137+ data entries correctly loaded
- [ ] Real-time calculations accurate
- [ ] Validation works (hard/soft constraints)
- [ ] Ship library functional
- [ ] Export to JSON and text
- [ ] PWA installable
- [ ] Works offline
- [ ] Mobile responsive
- [ ] Zero calculation errors

### 7.2 Quality Gates:
- [ ] Unit tests: >80% coverage
- [ ] E2E tests: All critical paths
- [ ] Performance: Lighthouse >90
- [ ] Accessibility: WCAG AA
- [ ] Browser testing: All supported

---

## 8. RISKS AND MITIGATION

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Complex calculation errors | Medium | High | Extensive unit tests, reference validation |
| Performance on low-end devices | Medium | Medium | Optimize bundle, lazy loading |
| Browser compatibility issues | Low | Medium | Feature detection, graceful degradation |
| Data migration complexity | Low | Medium | Version tagging, migration scripts |
| Scope creep | High | Medium | Strict MVP definition, future versions list |

---

## 9. GLOSSARY

- **CE:** Cepheus Engine
- **Mneme:** Mneme Space Combat (variant rules)
- **PWA:** Progressive Web App
- **Dton:** Displacement ton (1 ton = 14 cubic meters)
- **MCr:** MegaCredit (1 MCr = 1,000,000 Cr)
- **TL:** Tech Level
- **MAC:** Multiple Attack Consolidation
- **TP:** Thrust Points
- **HP:** Hit Points
- **DM:** Dice Modifier
- **TN:** Target Number

---

## 10. REFERENCES

1. Cepheus Engine SRD Chapter 8
2. Mneme Space Combat v2.41-v2.45 (Justin Aquino)
3. GI7B EXTERNAL RAW CE SHIPS 231024-06 240930.xlsx
4. MASTER_RULES_CONSOLIDATION.md
5. RAW_TABLES_EXTRACTED.md
6. MNEME_SPACE_COMBAT_SUMMARY.md

---

---

## 11. ADDENDUM — March 2, 2026 (Session 3 Requirements)

### 11.1 PWA Install Prompt & Install-State Indicator (FR-021)

**Priority:** High
**Trigger:** User confirmed all 13 data tables are now editable and functional. Next priority is guiding users to install the app locally so they have a personal working copy.

**Problem Statement:**
Users visiting the web version have no clear signal that the app can be saved to their desktop/home screen, nor any indication of which mode they are currently running in (web vs. installed PWA). Without this, users may not realise they can work offline with their own customised tables.

**Requirements:**

**FR-021a: Install Prompt**
- Detect PWA installability via the `beforeinstallprompt` event (Chrome/Edge/Android)
- On the Startup screen, show a prominent "Install App" button or banner when the app is installable
- On iOS (Safari), show a manual instruction overlay: "Tap Share → Add to Home Screen"
- After install, suppress the prompt (do not show again)
- Store `install_prompted` flag in localStorage

**FR-021b: Running-Mode Indicator**
- Detect installed/standalone mode via:
  - `window.matchMedia('(display-mode: standalone)').matches`
  - `window.navigator.standalone === true` (iOS fallback)
- When running in **standalone (installed) mode**: show a persistent badge in the app header — e.g., a green dot or "Installed" chip — so users know they are on their local copy
- When running in **web/browser mode**: show a subtle "Install for offline use" link in the header or footer
- The indicator must be visible from all screens (Design, Library, Settings)

**FR-021c: Offline Status**
- Display a status indicator when the device is offline (use `navigator.onLine` + `online`/`offline` events)
- Offline: amber indicator "Offline — using local data"
- Online: no indicator (default state)

**Acceptance Criteria:**
- [ ] Install button appears on Startup screen when browser supports install
- [ ] iOS users see manual install instructions
- [ ] Header shows "Installed" badge when in standalone mode
- [ ] Offline indicator appears/disappears correctly
- [ ] No install prompt shown if already installed

---

### 11.2 Local vs. Web Version Workflow (FR-022)

**Priority:** High
**Problem Statement:**
The user needs to test the experience of "saving" a personal version (with custom tables/rules) vs. reverting back to the canonical web defaults. The app already separates defaults (JSON files in `public/data/`) from user customisations (localStorage), but there is no UX to make this explicit or manageable.

**Data Architecture (existing, correct):**

| Layer | Storage | Contains | Resettable? |
|-------|---------|----------|-------------|
| Canonical defaults | `public/data/*.json` (shipped files) | Rule tables as authored | No (read-only) |
| User customisations | `localStorage` (`ce_shipgen_table_*`) | Edited table data | Yes — "Reset to Default" |
| Rule preferences | `localStorage` (`ce_shipgen_rules`) | CE/Mneme/Custom toggles | Yes |
| Ship library | `localStorage` / IndexedDB | Saved ship designs | No — user data, never auto-reset |

**Requirements:**

**FR-022a: "My Version" vs "Web Version" concept**
- Treat "web version" as the canonical default state (all localStorage customisations absent)
- Treat "installed/my version" as the user's working copy with their customisations
- These are not separate codebases — same PWA, different localStorage state

**FR-022b: Reset Settings to Web Defaults**
- In Settings → Data Management section, add a "Reset All Tables to Defaults" button
- This clears all `ce_shipgen_table_*` keys and `ce_shipgen_rules` from localStorage
- **Does NOT touch ship library data** (IndexedDB / ship design keys)
- Shows confirmation dialog: "This will reset all custom tables and rules. Your saved ships are not affected."
- After reset, all tables reload from `public/data/*.json` (the web defaults)

**FR-022c: Export My Version**
- Add "Export My Settings" in Settings → Data Management
- Exports all current localStorage table customisations as a single JSON bundle
- Format: `{ "version": "1.0", "exported": "<timestamp>", "tables": { "ship_hulls": [...], ... }, "rules": {...} }`
- User can share this file to replicate their setup on another device

**FR-022d: Import Settings Bundle**
- Add "Import Settings" button accepting the export format above
- Validates schema before applying
- Does not overwrite ship library

**Acceptance Criteria:**
- [ ] "Reset All Tables to Defaults" works without touching ship library
- [ ] "Export My Settings" produces valid importable JSON
- [ ] "Import Settings" validates and applies cleanly
- [ ] Installed-mode users can distinguish their customised state from defaults

---

### 11.3 Input Security — Editable Tables (FR-023)

**Priority:** High
**Trigger:** When the app is made public, malicious actors may attempt to inject harmful content via the editable table fields. The following requirements govern how user-supplied data is handled.

**Threat Model:**

| Threat | Vector | Risk Level | Notes |
|--------|--------|------------|-------|
| Stored XSS | Inject `<script>` or event handlers into table string fields | Low (mitigated by React) | React renders text nodes, not HTML, so `String(value)` in JSX is safe |
| HTML injection via `dangerouslySetInnerHTML` | Any future use of `innerHTML` with table data | **High if introduced** | Currently not used — must never be introduced with table data |
| Prototype pollution via JSON.parse | `{"__proto__": {"isAdmin": true}}` in imported JSON | Low (modern JS engines block this) | Use `Object.create(null)` pattern for sensitive parsing |
| Schema confusion / type mismatch | String in numeric field causes NaN in calculations | Medium | Currently no schema validation — calculation engine will inherit garbage |
| Malicious JSON import shared between users | User A crafts a JSON file, shares with User B who imports it | Medium | Content is rendered safely by React, but could break calculations |
| localStorage tampering (browser console) | User directly edits localStorage keys | Low (self-inflicted) | Out of scope — local storage is the user's own environment |

**Current Safety Status:**
- ✅ React JSX text rendering is XSS-safe by default — `{String(value)}` produces text nodes
- ✅ `title={String(value)}` attribute values are escaped by React
- ✅ No `eval()`, `Function()`, or `dangerouslySetInnerHTML` used with table data
- ⚠️ No schema validation on import — invalid types reach the calculation engine
- ⚠️ No string sanitization — HTML tags in fields are harmless now but risky if future code ever uses innerHTML
- ⚠️ No max-length enforcement on string fields

**Requirements:**

**FR-023a: Schema Validation on Import**
- When importing a JSON table, validate each row against the expected schema for that table
- Check: required fields present, numeric fields are numbers, string fields are strings
- Reject import if >10% of rows fail validation
- Show specific validation errors to the user before accepting

**FR-023b: String Sanitization on Save**
- Before saving to localStorage, strip HTML tags from all string fields
- Simple implementation: `value.replace(/<[^>]*>/g, '')` is sufficient given React's rendering model
- This prevents any future code from accidentally rendering injected HTML

**FR-023c: Type Coercion on Load**
- When reading table data from localStorage, coerce values to expected types
- Numeric fields: `Number(value)` with NaN fallback to 0
- String fields: `String(value).slice(0, 500)` (max 500 chars)
- Boolean fields: explicit true/false check

**FR-023d: No `dangerouslySetInnerHTML` with Table Data (Architectural Rule)**
- Document as a hard architectural constraint: table field values must NEVER be passed to `dangerouslySetInnerHTML`
- Any future markdown rendering in ship output must use a sanitized renderer (e.g., DOMPurify + marked)

**FR-023e: Content Security Policy (Future)**
- GitHub Pages does not support custom HTTP headers, so CSP cannot be set via headers
- When migrating off GitHub Pages (Netlify/Vercel/self-hosted), add:
  ```
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'
  ```
- `unsafe-inline` needed only for Tailwind's inline styles — can be removed with stricter setup

**Acceptance Criteria:**
- [ ] Import rejects JSON with invalid schema and shows clear error
- [ ] String fields are stripped of HTML tags before save
- [ ] Numeric fields are coerced with NaN fallback on load
- [ ] No `dangerouslySetInnerHTML` introduced in any table-data code path

---

### 11.4 Updated Risk Register

| Risk | Likelihood | Impact | Mitigation | Status |
|------|------------|--------|------------|--------|
| Complex calculation errors | Medium | High | Extensive unit tests | ⏳ Pending |
| Performance on low-end devices | Medium | Medium | Optimize bundle, lazy loading | ⏳ Pending |
| Browser compatibility issues | Low | Medium | Feature detection, graceful degradation | ⏳ Pending |
| Data migration complexity | Low | Medium | Version tagging, migration scripts | ⏳ Pending |
| Scope creep | High | Medium | Strict MVP definition | ⏳ Ongoing |
| XSS via table fields | Low | High | React text rendering + sanitization on save | ⏳ FR-023 |
| Schema corruption breaking calculations | Medium | High | Schema validation on import + type coercion on load | ⏳ FR-023 |
| Users unaware app is installable | High | Medium | Install prompt + install-state indicator | ⏳ FR-021 |
| Users lose customisations on device switch | Medium | Medium | Export/Import settings bundle | ⏳ FR-022 |

---

### 11.5 Updated Milestone Plan

| Milestone | Scope | Status |
|-----------|-------|--------|
| M1: UI Layout & Tiling | Layout, tiles, focus mode, PWA | ✅ Complete |
| M2: Settings & Data Tables | JSON + table editors, all 13 tables, rule toggles | ✅ Complete |
| M2.5: Install UX & Security | FR-021, FR-022, FR-023 | 🎯 Next |
| M3: Ship Generation | 19-step wizard, BOQ, real-time calculations | ⏳ Pending |
| M4: Persistence & Export | Ship library, JSON/CSV/text/print export | ⏳ Pending |

---

**PRD Status:** LIVING DOCUMENT — updated per session
**Last updated:** March 2, 2026 (Session 3)
**Next implementation target:** M2.5 — Install UX & Security hardening
