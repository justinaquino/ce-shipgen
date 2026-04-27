import { useState } from 'react';
import { useTableStore } from '../store/tableStore';
import { downloadJson, generateSnapshotName } from '../utils/exportImport';
import { ShipDetailModal } from './ShipDetailModal';
import { Download, Trash2, Edit3, FileJson, Eye } from 'lucide-react';
import type { ShipDesign } from '../types';

export function ShipLibrary() {
  const ships = useTableStore((s) => s.ships);
  const deleteShip = useTableStore((s) => s.deleteShip);
  const setCurrentShip = useTableStore((s) => s.setCurrentShip);
  const [detailShip, setDetailShip] = useState<ShipDesign | null>(null);

  const exportAll = () => {
    downloadJson(JSON.stringify(ships, null, 2), `ce-shipgen-library-${generateSnapshotName()}.json`);
  };

  const exportShip = (ship: ShipDesign) => {
    downloadJson(JSON.stringify(ship, null, 2), `ship-${ship.name.replace(/\s+/g, '_')}.json`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Ship Library</h1>
          <p className="text-sm text-slate-400 mt-1">{ships.length} ship{ships.length !== 1 ? 's' : ''} saved</p>
        </div>
        {ships.length > 0 && (
          <button onClick={exportAll} className="btn-secondary flex items-center gap-2">
            <FileJson className="w-4 h-4" /> Export Library
          </button>
        )}
      </div>

      {ships.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p>No ships saved yet.</p>
          <p className="text-sm mt-2">Go to the Design tab to create your first ship.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ships.map((ship) => (
            <div key={ship.id} className="tile">
              <div className="tile-content">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{ship.name}</h3>
                    <p className="text-sm text-slate-400">TL {ship.tl} | {ship.hullDtons} DT</p>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => setDetailShip(ship)}
                      className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-cyan-400"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentShip(ship);
                        window.location.hash = '#/design';
                      }}
                      className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-blue-400"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => exportShip(ship)}
                      className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-green-400"
                      title="Export"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteShip(ship.id)}
                      className="p-1.5 hover:bg-red-900/30 rounded text-slate-400 hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-slate-800 p-2 rounded">
                    <div className="text-xs text-slate-500">Cost</div>
                    <div className="font-medium">{(ship.totalCost / 1e6).toFixed(2)} MCr</div>
                  </div>
                  <div className="bg-slate-800 p-2 rounded">
                    <div className="text-xs text-slate-500">Cargo</div>
                    <div className="font-medium">{ship.cargo} DT</div>
                  </div>
                  <div className="bg-slate-800 p-2 rounded">
                    <div className="text-xs text-slate-500">Config</div>
                    <div className="font-medium">{ship.configuration}</div>
                  </div>
                  <div className="bg-slate-800 p-2 rounded">
                    <div className="text-xs text-slate-500">Drive</div>
                    <div className="font-medium">{ship.mDrive || '—'} / {ship.jDrive || '—'}</div>
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-500">
                  {ship.components.length} components | Created {new Date(ship.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {detailShip && (
        <ShipDetailModal
          ship={detailShip}
          onClose={() => setDetailShip(null)}
          onEdit={(ship) => {
            setCurrentShip(ship);
            setDetailShip(null);
            window.location.hash = '#/design';
          }}
          onDelete={deleteShip}
          onExport={exportShip}
        />
      )}
    </div>
  );
}
