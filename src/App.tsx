import { useEffect, useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { useTableStore } from './store/tableStore';
import { SettingsProvider, useSettings } from './components/ThemeProvider';
import { SettingsPanel } from './components/SettingsPanel';
import { StartupScreen } from './components/StartupScreen';
import { TableManager } from './components/TableManager';
import { ShipDesigner } from './components/ShipDesigner';
import { ShipLibrary } from './components/ShipLibrary';
import { VariantGenerator } from './components/VariantGenerator';
import { Moon, Sun, Smartphone, Monitor } from 'lucide-react';

function AppContent() {
  const loadTables = useTableStore((s) => s.loadTables);
  const loaded = useTableStore((s) => s.loaded);
  const { effectiveTheme, toggleTheme, layoutMode, toggleLayout } = useSettings();

  useEffect(() => {
    if (!loaded) loadTables();
  }, [loaded, loadTables]);

  return (
    <div className={`min-h-screen ${effectiveTheme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <header className={`border-b sticky top-0 z-50 ${effectiveTheme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-blue-500">CE ShipGen</span>
            <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded">PWA</span>
            {layoutMode === 'phone' && (
              <span className="text-xs text-amber-500 bg-amber-900/20 px-2 py-0.5 rounded">Phone</span>
            )}
          </div>
          <nav className="flex items-center gap-1">
            <NavLink to="/" className={({isActive}) => `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-blue-600 text-white' : effectiveTheme === 'dark' ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}>Tables</NavLink>
            <NavLink to="/design" className={({isActive}) => `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-blue-600 text-white' : effectiveTheme === 'dark' ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}>Design</NavLink>
            <NavLink to="/library" className={({isActive}) => `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-blue-600 text-white' : effectiveTheme === 'dark' ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}>Library</NavLink>
            <NavLink to="/variants" className={({isActive}) => `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-blue-600 text-white' : effectiveTheme === 'dark' ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}>Variants</NavLink>
            
            <div className="w-px h-5 mx-1 bg-slate-700" />
            
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-md transition-colors ${effectiveTheme === 'dark' ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}
              title="Toggle Theme"
            >
              {effectiveTheme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleLayout}
              className={`p-2 rounded-md transition-colors ${effectiveTheme === 'dark' ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}
              title="Toggle Layout"
            >
              {layoutMode === 'desktop' ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
            </button>
            <SettingsPanel />
          </nav>
        </div>
      </header>

      <main className={`max-w-7xl mx-auto px-4 py-6 ${layoutMode === 'phone' ? 'max-w-md' : ''}`}>
        <Routes>
          <Route path="/" element={<TableManager />} />
          <Route path="/design" element={<ShipDesigner />} />
          <Route path="/library" element={<ShipLibrary />} />
          <Route path="/variants" element={<VariantGenerator />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const [showStartup, setShowStartup] = useState(false);

  useEffect(() => {
    const seenVersion = localStorage.getItem('ce_shipgen_seen_version');
    fetch(`${import.meta.env.BASE_URL}version.json`)
      .then(r => r.json())
      .then((data: { version: string }) => {
        if (!seenVersion || seenVersion !== data.version) {
          setShowStartup(true);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <SettingsProvider>
      {showStartup && <StartupScreen onDismiss={() => setShowStartup(false)} />}
      <AppContent />
    </SettingsProvider>
  );
}

export default App;
