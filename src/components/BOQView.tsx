import type { ShipComponent } from '../types';

interface Props {
  components: ShipComponent[];
  totalCost: number;
  hullDtons: number;
  usedTons: number;
  availableDtons: number;
}

export function BOQView({ components, totalCost, hullDtons, usedTons, availableDtons }: Props) {
  const bySection: Record<string, ShipComponent[]> = {};
  components.forEach((c) => {
    if (!bySection[c.section]) bySection[c.section] = [];
    bySection[c.section].push(c);
  });

  const totalTons = components.reduce((s, c) => s + c.dtons, 0);
  const isValid = hullDtons > 0 && usedTons <= hullDtons;

  return (
    <div className="tile sticky top-20">
      <div className="tile-header">
        <span className="font-semibold">Bill of Quantities</span>
      </div>
      <div className="tile-content space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-slate-800 p-3 rounded">
            <div className="text-slate-400 text-xs">Hull Size</div>
            <div className="text-lg font-bold">{hullDtons > 0 ? `${hullDtons} DT` : '—'}</div>
          </div>
          <div className={`p-3 rounded ${isValid ? 'bg-green-900/30' : hullDtons > 0 ? 'bg-red-900/30' : 'bg-slate-800'}`}>
            <div className="text-slate-400 text-xs">Available</div>
            <div className="text-lg font-bold">{availableDtons.toFixed(1)} DT</div>
          </div>
          <div className="bg-slate-800 p-3 rounded">
            <div className="text-slate-400 text-xs">Total Tonnage</div>
            <div className="text-lg font-bold">{totalTons.toFixed(1)} DT</div>
          </div>
          <div className="bg-slate-800 p-3 rounded">
            <div className="text-slate-400 text-xs">Total Cost</div>
            <div className="text-lg font-bold">{(totalCost / 1e6).toFixed(2)} MCr</div>
          </div>
        </div>

        {Object.entries(bySection).map(([section, items]) => (
          <div key={section}>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{section}</div>
            <div className="space-y-1">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm py-1 border-b border-slate-700/50">
                  <span className="text-slate-300">{item.qty && item.qty > 1 ? `${item.qty}× ` : ''}{item.module}</span>
                  <div className="flex gap-4">
                    <span className="text-slate-400 w-16 text-right">{item.dtons > 0 ? `${item.dtons.toFixed(1)} DT` : ''}</span>
                    <span className="text-slate-400 w-24 text-right">{item.cost > 0 ? `${(item.cost / 1e6).toFixed(2)} M` : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {components.length === 0 && (
          <div className="text-center text-slate-500 py-4 text-sm">
            Select a hull to begin designing
          </div>
        )}
      </div>
    </div>
  );
}
