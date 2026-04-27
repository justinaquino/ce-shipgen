# CE ShipGen — UI & Design Requirements

**Version:** 1.0  
**Date:** 2026-04-27  
**Status:** Active — incorporated into implementation plan

This document captures UI, UX, and design system requirements that supplement PRD v2.0. These requirements come from direct user (Justin Aquino) specification and must be honored in all implementations.

---

## 1. Theme System

### Day / Night Toggle
- **Default:** Dark mode (space theme)
- **Options:** Dark | Light | Auto (system preference)
- **Storage:** `ce_shipgen_theme` in localStorage
- **Implementation:** CSS custom properties or Tailwind `dark:` variants with class-based toggling
- **Scope:** All components, all routes, all tables

### Color Palette (Dark — Default)
```
Background:    #0f172a (slate-950)
Surface:       #1e293b (slate-800)
Border:        #334155 (slate-700)
Text Primary:  #f1f5f9 (slate-100)
Text Secondary:#94a3b8 (slate-400)
Accent:        #3b82f6 (blue-500)
Success:       #22c55e (green-500)
Warning:       #f59e0b (amber-500)
Danger:        #ef4444 (red-500)
Cyan (Mneme):  #06b6d4 (cyan-500)
```

### Color Palette (Light)
```
Background:    #f8fafc (slate-50)
Surface:       #ffffff (white)
Border:        #e2e8f0 (slate-200)
Text Primary:  #0f172a (slate-950)
Text Secondary:#64748b (slate-500)
Accent:        #2563eb (blue-600)
```

---

## 2. Layout System

### Phone ↔ Desktop Toggle
- **Desktop Mode:** Multi-column layout
  - 3-column ship designer: Steps (left) | Detail (center) | BOQ (right)
  - Table manager: Table list (left) | Editor (right)
  - Grid gaps: 24px
  - Max content width: 1400px, centered
- **Phone Mode:** Single vertical stack
  - All tiles stack top-to-bottom
  - BOQ is sticky summary bar at top (collapsible)
  - Bottom navigation or hamburger menu
  - Touch targets: minimum 44×44px
- **Toggle:** Button in header, persisted to localStorage
- **Auto-detect:** Default based on viewport width (<768px = Phone)

### Responsive Breakpoints
```
Mobile:     < 640px  (sm)
Tablet:     640–1024px (md/lg)
Desktop:    > 1024px  (xl)
Wide:       > 1400px  (2xl)
```

---

## 3. Version Tracking

### Version Display
- **Format:** Semantic-like with 0.01 increments
  - Current baseline: `0.01`
  - Increments: `0.01`, `0.02` … `0.99`, `1.00`, `1.01` …
- **Location:** Startup screen (prominent), Settings screen (detailed), header (subtle)
- **Build Info:** Version number + build timestamp + git short hash (if available)
- **Update Model:**
  - User-controlled (never force refresh)
  - "Update Available" indicator when new version detected
  - Changelog viewable before applying update
  - `registerType: 'prompt'` in Vite PWA config (already set)

### Version File
- `public/version.json` generated at build time
- Schema: `{ "version": "0.01", "buildDate": "2026-04-27T09:00:00Z", "commit": "abc1234" }`

---

## 4. Data Management UX

### Save / Save As / Import / Export

**Save (Ctrl+S):**
- If ship has an ID in library → overwrite silently with toast confirmation
- If ship is new → prompt for name, then save

**Save As:**
- Always prompt for name
- Create new entry even if editing existing ship
- Pre-fill with current name + " Copy"

**Import:**
- Accept `.json` files (ship or table snapshot)
- Validate schema before import
- Show preview/count of items to be imported
- On conflict: prompt "Overwrite existing 'Ship Name'?"

**Export:**
- Ship: `ship-{name}-{YYMMDD}.json`
- Table snapshot: `ce-shipgen-{name}-{YYMMDD}.json`
- Library: `ce-shipgen-library-{YYMMDD}.json`
- All exports are self-contained JSON, human-readable

### Storage Architecture
```
localStorage:
  ce-shipgen-storage      → Zustand persist (tables, ships, currentShip)
  ce_shipgen_theme        → "dark" | "light" | "auto"
  ce_shipgen_layout       → "desktop" | "phone"
  ce_shipgen_active_tables→ Active table registry (M2.7)
  ce_shipgen_presets      → Settings snapshots (FR-024)
  install_prompted        → PWA install flag

IndexedDB (future, M4):
  ship_library            → Large ship collections
  table_history           → Table edit history for undo
```

---

## 5. Navigation & App Flow

### Startup Screen (First Load)
```
┌─────────────────────────────┐
│      [Logo/Icon]            │
│      CE ShipGen             │
│      v0.01                  │
│                             │
│  [🚀 Generate Ship]         │  ← Primary action
│  [📚 Ship Library]          │
│  [⚙️ Settings]              │
│  [❓ Help / About]          │
│                             │
│  [Install App]  (if avail)  │
└─────────────────────────────┘
```

### Header (Persistent)
```
┌─────────────────────────────────────────────────────────┐
│  CE ShipGen  [📊 Tables] [🚀 Design] [📚 Library] [⚙️]  │
│                                    [🌙☀️] [💻📱]        │
└─────────────────────────────────────────────────────────┘
```
- Theme toggle: moon/sun icon
- Layout toggle: monitor/phone icon
- Settings gear: dropdown with quick actions

---

## 6. PWA Requirements

### Install Experience
- **Install Prompt:** Prominent button on startup screen when `beforeinstallprompt` fires
- **iOS:** Show "Add to Home Screen" instructions (Share → Add to Home Screen)
- **Post-Install:** Suppress prompt; store `install_prompted` flag

### Running Mode Indicators
- **Installed:** Green "Installed" badge in header
- **Browser:** Subtle "Install for offline use" link in footer
- **Offline:** Amber "Offline — using local data" indicator

### Update Behavior
- Never auto-refresh
- Service worker uses `registerType: 'prompt'`
- New version detected → orange dot on Settings icon + "Update Available" banner
- User clicks "Update Now" → applies waiting SW
- Offline: show "Connect to internet to update" instead of button

---

## 7. Accessibility Baseline

- **Keyboard:** All interactive elements focusable; Enter/Space activates; ESC exits modals/focus mode
- **Screen Reader:** All tables have `<caption>`; all inputs have `<label>`; icons have `aria-label`
- **Color:** Never rely on color alone — use icons + text for status
- **Motion:** Respect `prefers-reduced-motion`
- **Focus:** Visible focus rings on all interactive elements

---

## 8. Component Design Language

### Tile (Card)
```
Border:     1px solid slate-700
Background: slate-800
Radius:     8px
Shadow:     none (flat design)
Hover:      border-color lightens
```

### Button Hierarchy
```
Primary:   bg-blue-600, white text, hover:bg-blue-500
Secondary: bg-slate-700, slate-100 text, hover:bg-slate-600
Danger:    bg-red-700, white text, hover:bg-red-600
Ghost:     transparent, slate-300 text, hover:bg-slate-800
```

### Input Fields
```
Background: slate-800 (dark) / white (light)
Border:     1px solid slate-600
Focus:      2px ring blue-500
Radius:     6px
Height:     40px (touch-friendly)
```

### Tables
```
Header:     slate-800 background, slate-400 text, uppercase, 11px
Row hover:  slate-800/50
Border:     1px solid slate-700
Cell padding: 12px 16px
```

---

*End of Document*
