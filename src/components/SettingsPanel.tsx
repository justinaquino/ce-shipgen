import { useState } from 'react';
import { useSettings } from './ThemeProvider';
import { Settings, Moon, Sun, Monitor, Smartphone, Monitor as MonitorDesktop, X } from 'lucide-react';

export function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const { theme, effectiveTheme, layoutMode, setTheme, setLayoutMode } = useSettings();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
        title="Settings"
      >
        <Settings className="w-5 h-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h2 className="text-lg font-semibold">Settings</h2>
              <button 
                onClick={() => setOpen(false)}
                className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Theme */}
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-colors ${
                      theme === 'dark' 
                        ? 'border-blue-500 bg-blue-900/20 text-blue-400' 
                        : 'border-slate-700 hover:border-slate-600 text-slate-400'
                    }`}
                  >
                    <Moon className="w-5 h-5" />
                    <span className="text-xs">Dark</span>
                  </button>
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-colors ${
                      theme === 'light' 
                        ? 'border-blue-500 bg-blue-900/20 text-blue-400' 
                        : 'border-slate-700 hover:border-slate-600 text-slate-400'
                    }`}
                  >
                    <Sun className="w-5 h-5" />
                    <span className="text-xs">Light</span>
                  </button>
                  <button
                    onClick={() => setTheme('auto')}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-colors ${
                      theme === 'auto' 
                        ? 'border-blue-500 bg-blue-900/20 text-blue-400' 
                        : 'border-slate-700 hover:border-slate-600 text-slate-400'
                    }`}
                  >
                    <Monitor className="w-5 h-5" />
                    <span className="text-xs">Auto</span>
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Currently: {effectiveTheme === 'dark' ? 'Dark mode' : 'Light mode'}
                </p>
              </div>

              {/* Layout */}
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Layout</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setLayoutMode('desktop')}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-colors ${
                      layoutMode === 'desktop' 
                        ? 'border-blue-500 bg-blue-900/20 text-blue-400' 
                        : 'border-slate-700 hover:border-slate-600 text-slate-400'
                    }`}
                  >
                    <MonitorDesktop className="w-5 h-5" />
                    <span className="text-xs">Desktop</span>
                  </button>
                  <button
                    onClick={() => setLayoutMode('phone')}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-colors ${
                      layoutMode === 'phone' 
                        ? 'border-blue-500 bg-blue-900/20 text-blue-400' 
                        : 'border-slate-700 hover:border-slate-600 text-slate-400'
                    }`}
                  >
                    <Smartphone className="w-5 h-5" />
                    <span className="text-xs">Phone</span>
                  </button>
                </div>
              </div>

              {/* Data Management */}
              <div className="pt-4 border-t border-slate-800">
                <label className="text-sm font-medium text-slate-300 mb-2 block">Data</label>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      if (confirm('Clear all saved ships? This cannot be undone.')) {
                        localStorage.removeItem('ce-shipgen-tables');
                        window.location.reload();
                      }
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-900/20 transition-colors"
                  >
                    Clear All Saved Ships
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Reset all tables to defaults? Custom edits will be lost.')) {
                        const store = JSON.parse(localStorage.getItem('ce-shipgen-tables') || '{}');
                        store.state = { ...store.state, tables: store.state?.defaults || {} };
                        localStorage.setItem('ce-shipgen-tables', JSON.stringify(store));
                        window.location.reload();
                      }
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-amber-400 hover:bg-amber-900/20 transition-colors"
                  >
                    Reset Tables to Defaults
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
