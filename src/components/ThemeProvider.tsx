import { createContext, useContext, useEffect, useState } from 'react';

export type LayoutMode = 'desktop' | 'phone';
export type ThemeName = 'mainframe' | 'amber' | 'blueprint' | 'deuteranopia' | 'protanopia' | 'tritanopia' | 'high-contrast' | 'mneme';
export type FontFamily = 'vt323' | 'jetbrains' | 'atkinson';
export type RuleSet = 'ce' | 'mneme';

export interface AppSettings {
  scanlines: boolean;
  layoutMode: LayoutMode;
  theme: ThemeName;
  fontScale: number;
  fontFamily: FontFamily;
  ruleSet: RuleSet;
}

interface SettingsContextType extends AppSettings {
  setScanlines: (v: boolean) => void;
  setLayoutMode: (m: LayoutMode) => void;
  setTheme: (t: ThemeName) => void;
  setFontScale: (s: number) => void;
  setFontFamily: (f: FontFamily) => void;
  setRuleSet: (r: RuleSet) => void;
  toggleScanlines: () => void;
  toggleLayout: () => void;
  exportSettings: () => string;
  importSettings: (json: string) => boolean;
  resetSettings: () => void;
}

const SETTINGS_KEY = 'ce_shipgen_settings';

export const defaultSettings: AppSettings = {
  scanlines: true,
  layoutMode: 'desktop',
  theme: 'mainframe',
  fontScale: 1.0,
  fontFamily: 'vt323',
  ruleSet: 'ce',
};

const themeLabels: Record<ThemeName, string> = {
  mainframe: 'Mainframe (Green)',
  amber: 'Amber',
  blueprint: 'Blueprint',
  deuteranopia: 'Deuteranopia (Green-Blind)',
  protanopia: 'Protanopia (Red-Blind)',
  tritanopia: 'Tritanopia (Blue-Blind)',
  'high-contrast': 'High Contrast',
  mneme: 'Mneme (Amber-Cyan)',
};

const fontLabels: Record<FontFamily, string> = {
  vt323: 'VT323 (Retro)',
  jetbrains: 'JetBrains Mono',
  atkinson: 'Atkinson Hyperlegible',
};

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return defaultSettings;
}

function saveSettings(s: AppSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  useEffect(() => {
    saveSettings(settings);
    // Apply theme attribute to document for CSS selectors
    document.documentElement.setAttribute('data-shipgen-theme', settings.theme);
    // Apply font scale
    document.documentElement.style.setProperty('--sh-font-scale', String(settings.fontScale));
    // Apply font family
    const fontMap: Record<FontFamily, string> = {
      vt323: '"VT323", monospace',
      jetbrains: '"JetBrains Mono", monospace',
      atkinson: '"Atkinson Hyperlegible", sans-serif',
    };
    document.documentElement.style.setProperty('--sh-font-body', fontMap[settings.fontFamily]);
  }, [settings]);

  // Initialize theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-shipgen-theme', settings.theme);
    document.documentElement.style.setProperty('--sh-font-scale', String(settings.fontScale));
    const fontMap: Record<FontFamily, string> = {
      vt323: '"VT323", monospace',
      jetbrains: '"JetBrains Mono", monospace',
      atkinson: '"Atkinson Hyperlegible", sans-serif',
    };
    document.documentElement.style.setProperty('--sh-font-body', fontMap[settings.fontFamily]);
  }, []);

  const exportSettings = () => JSON.stringify(settings, null, 2);

  const importSettings = (json: string) => {
    try {
      const parsed = JSON.parse(json);
      const merged = { ...defaultSettings, ...parsed };
      // Validate theme
      if (!themeLabels[(merged.theme as ThemeName)]) merged.theme = defaultSettings.theme;
      if (!fontLabels[(merged.fontFamily as FontFamily)]) merged.fontFamily = defaultSettings.fontFamily;
      if (merged.ruleSet !== 'ce' && merged.ruleSet !== 'mneme') merged.ruleSet = defaultSettings.ruleSet;
      if (typeof merged.fontScale !== 'number' || merged.fontScale < 0.5 || merged.fontScale > 2.0) {
        merged.fontScale = defaultSettings.fontScale;
      }
      setSettings(merged);
      return true;
    } catch {
      return false;
    }
  };

  const resetSettings = () => setSettings(defaultSettings);

  const value: SettingsContextType = {
    ...settings,
    setScanlines: (scanlines) => setSettings(s => ({ ...s, scanlines })),
    setLayoutMode: (layoutMode) => setSettings(s => ({ ...s, layoutMode })),
    setTheme: (theme) => setSettings(s => ({ ...s, theme })),
    setFontScale: (fontScale) => setSettings(s => ({ ...s, fontScale })),
    setFontFamily: (fontFamily) => setSettings(s => ({ ...s, fontFamily })),
    setRuleSet: (ruleSet) => setSettings(s => ({ ...s, ruleSet })),
    toggleScanlines: () => setSettings(s => ({ ...s, scanlines: !s.scanlines })),
    toggleLayout: () => setSettings(s => ({ ...s, layoutMode: s.layoutMode === 'desktop' ? 'phone' : 'desktop' })),
    exportSettings,
    importSettings,
    resetSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
