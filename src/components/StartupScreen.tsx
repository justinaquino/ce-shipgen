import { useState, useEffect } from 'react';
import { Rocket, X, BookOpen, CheckCircle } from 'lucide-react';

interface VersionInfo {
  version: string;
  name: string;
  date: string;
  changelog: string[];
}

interface StartupScreenProps {
  onDismiss: () => void;
}

const SEEN_VERSION_KEY = 'ce_shipgen_seen_version';

export function StartupScreen({ onDismiss }: StartupScreenProps) {
  const [version, setVersion] = useState<VersionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [dontShow, setDontShow] = useState(false);

  useEffect(() => {
    fetch('/version.json')
      .then(r => r.json())
      .then((data: VersionInfo) => {
        setVersion(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleDismiss = () => {
    if (dontShow && version) {
      localStorage.setItem(SEEN_VERSION_KEY, version.version);
    }
    onDismiss();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!version) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900/50 to-slate-900 p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{version.name}</h1>
                <p className="text-sm text-blue-400">Version {version.version}</p>
              </div>
            </div>
            <button 
              onClick={handleDismiss}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> What's New
            </h2>
            <ul className="space-y-2">
              {version.changelog.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
              <input 
                type="checkbox" 
                checked={dontShow}
                onChange={(e) => setDontShow(e.target.checked)}
                className="rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500"
              />
              Don't show again until next update
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button 
            onClick={handleDismiss}
            className="btn-primary px-6"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export function shouldShowStartup(): boolean {
  try {
    localStorage.getItem(SEEN_VERSION_KEY);
    // We'll check against the actual version in the component; here just return true to render
    return true;
  } catch {
    return true;
  }
}
