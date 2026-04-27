import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'auto';
type LayoutMode = 'desktop' | 'phone';

interface Settings {
  theme: Theme;
  layoutMode: LayoutMode;
}

interface SettingsContextType {
  theme: Theme;
  effectiveTheme: 'dark' | 'light';
  layoutMode: LayoutMode;
  setTheme: (t: Theme) => void;
  setLayoutMode: (m: LayoutMode) => void;
  toggleTheme: () => void;
  toggleLayout: () => void;
}

const SETTINGS_KEY = 'ce_shipgen_settings';

const defaultSettings: Settings = {
  theme: 'dark',
  layoutMode: 'desktop',
};

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return defaultSettings;
}

function saveSettings(s: Settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

function getSystemTheme(): 'dark' | 'light' {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(loadSettings);

  const effectiveTheme: 'dark' | 'light' =
    settings.theme === 'auto' ? getSystemTheme() : settings.theme;

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    const root = document.documentElement;
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [effectiveTheme]);

  // Listen for system theme changes when in auto mode
  useEffect(() => {
    if (settings.theme !== 'auto') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      // Force re-render by updating settings with same value
      setSettings(s => ({ ...s }));
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [settings.theme]);

  const value: SettingsContextType = {
    theme: settings.theme,
    effectiveTheme,
    layoutMode: settings.layoutMode,
    setTheme: (theme) => setSettings(s => ({ ...s, theme })),
    setLayoutMode: (layoutMode) => setSettings(s => ({ ...s, layoutMode })),
    toggleTheme: () => setSettings(s => ({
      ...s,
      theme: s.theme === 'dark' ? 'light' : s.theme === 'light' ? 'auto' : 'dark',
    })),
    toggleLayout: () => setSettings(s => ({
      ...s,
      layoutMode: s.layoutMode === 'desktop' ? 'phone' : 'desktop',
    })),
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
