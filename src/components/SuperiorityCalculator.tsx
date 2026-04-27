import { useState } from 'react';
import { Swords, Plus, Minus, RotateCcw } from 'lucide-react';

interface ForceEntry {
  id: string;
  name: string;
  hullDtons: number;
  weaponCount: number;
  count: number;
}

function calcSuperiorityDm(friendlyForces: number, enemyForces: number): { dm: number; label: string } {
  if (enemyForces === 0) return { dm: 0, label: 'No enemy forces' };
  const ratio = friendlyForces / enemyForces;
  if (ratio >= 3) return { dm: -4, label: 'Overwhelming (3:1+)' };
  if (ratio >= 2) return { dm: -3, label: 'Superior (2:1)' };
  if (ratio >= 1.5) return { dm: -1, label: 'Advantage (3:2)' };
  if (ratio >= 1) return { dm: 0, label: 'Even (1:1)' };
  if (ratio >= 0.5) return { dm: 1, label: 'Disadvantage (1:2)' };
  if (ratio >= 0.33) return { dm: 2, label: 'Inferior (1:3)' };
  if (ratio >= 0.2) return { dm: 3, label: 'Outmatched (1:5)' };
  return { dm: 4, label: 'Doomed (1:7+)' };
}

export function SuperiorityCalculator() {
  const [friendly, setFriendly] = useState<ForceEntry[]>([
    { id: 'f1', name: 'Player Ship', hullDtons: 200, weaponCount: 2, count: 1 },
  ]);
  const [enemy, setEnemy] = useState<ForceEntry[]>([
    { id: 'e1', name: 'Pirate', hullDtons: 100, weaponCount: 1, count: 1 },
  ]);

  const friendlyTotal = friendly.reduce((s, f) => s + (f.hullDtons * f.count), 0);
  const enemyTotal = enemy.reduce((s, e) => s + (e.hullDtons * e.count), 0);
  const superiority = calcSuperiorityDm(friendlyTotal, enemyTotal);

  const addForce = (side: 'friendly' | 'enemy') => {
    const entry: ForceEntry = {
      id: `${side}-${Date.now()}`,
      name: side === 'friendly' ? 'Ally' : 'Hostile',
      hullDtons: 100,
      weaponCount: 1,
      count: 1,
    };
    if (side === 'friendly') setFriendly([...friendly, entry]);
    else setEnemy([...enemy, entry]);
  };

  const updateForce = (side: 'friendly' | 'enemy', id: string, updates: Partial<ForceEntry>) => {
    const list = side === 'friendly' ? friendly : enemy;
    const updated = list.map(f => f.id === id ? { ...f, ...updates } : f);
    if (side === 'friendly') setFriendly(updated);
    else setEnemy(updated);
  };

  const removeForce = (side: 'friendly' | 'enemy', id: string) => {
    if (side === 'friendly') setFriendly(friendly.filter(f => f.id !== id));
    else setEnemy(enemy.filter(e => e.id !== id));
  };

  const ForceList = ({ side, forces }: { side: 'friendly' | 'enemy'; forces: ForceEntry[] }) => (
    <div className="space-y-2">
      {forces.map((force) => (
        <div key={force.id} className="flex items-center gap-2 bg-slate-800/50 p-2 rounded">
          <input
            className="input flex-1 text-sm py-1"
            value={force.name}
            onChange={(e) => updateForce(side, force.id, { name: e.target.value })}
            placeholder="Name"
          />
          <input
            className="input w-16 text-sm py-1 text-center"
            type="number"
            min={1}
            value={force.hullDtons}
            onChange={(e) => updateForce(side, force.id, { hullDtons: Number(e.target.value) })}
            placeholder="DT"
          />
          <input
            className="input w-14 text-sm py-1 text-center"
            type="number"
            min={1}
            value={force.count}
            onChange={(e) => updateForce(side, force.id, { count: Number(e.target.value) })}
            placeholder="#"
          />
          <button
            onClick={() => removeForce(side, force.id)}
            className="p-1 hover:bg-red-900/30 rounded text-slate-400 hover:text-red-400"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button
        onClick={() => addForce(side)}
        className="w-full py-1.5 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded border border-dashed border-slate-700 flex items-center justify-center gap-1"
      >
        <Plus className="w-3.5 h-3.5" /> Add {side === 'friendly' ? 'Friendly' : 'Enemy'}
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wide flex items-center gap-2">
          <Swords className="w-4 h-4" /> Superiority Calculator
        </h3>
        <button
          onClick={() => { setFriendly([]); setEnemy([]); }}
          className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
          title="Reset"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-medium text-green-400 mb-2">Friendly Forces ({friendlyTotal.toLocaleString()} DT)</div>
          <ForceList side="friendly" forces={friendly} />
        </div>
        <div>
          <div className="text-xs font-medium text-red-400 mb-2">Enemy Forces ({enemyTotal.toLocaleString()} DT)</div>
          <ForceList side="enemy" forces={enemy} />
        </div>
      </div>

      {/* Result */}
      <div className={`p-3 rounded-lg border text-center ${
        superiority.dm < 0 ? 'bg-green-900/20 border-green-700' :
        superiority.dm > 0 ? 'bg-red-900/20 border-red-700' :
        'bg-slate-800/50 border-slate-700'
      }`}>
        <div className="text-xs text-slate-500 mb-1">Superiority Result</div>
        <div className={`text-2xl font-bold ${
          superiority.dm < 0 ? 'text-green-400' :
          superiority.dm > 0 ? 'text-red-400' :
          'text-slate-300'
        }`}>
          DM {superiority.dm >= 0 ? `+${superiority.dm}` : superiority.dm}
        </div>
        <div className="text-sm text-slate-400">{superiority.label}</div>
      </div>
    </div>
  );
}
