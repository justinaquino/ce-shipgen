import { useState, useRef } from 'react';
import { useTableStore } from '../store/tableStore';
import { CollapsibleSection } from './CollapsibleSection';
import { TableEditor } from './TableEditor';
import { exportTablesToJson, downloadJson, importJsonFile, validateTableData, generateSnapshotName } from '../utils/exportImport';
import { Download, Upload, RotateCcw, FileJson } from 'lucide-react';
import type { TableId } from '../types';

const TABLE_ORDER: TableId[] = [
  'ship_hulls',
  'hull_configurations',
  'ship_armor',
  'hull_options',
  'ship_bridge',
  'computer_options',
  'ship_software',
  'ship_weapons',
  'ship_drives',
  'engine_performance',
  'power_plants',
  'ship_sensors',
  'life_support',
  'ship_modules',
  'ship_crew',
  'ship_vehicles',
  'ship_supplies',
  'life_support_expenses',
];

export function TableManager() {
  const tables = useTableStore((s) => s.tables);
  const loading = useTableStore((s) => s.loading);
  const error = useTableStore((s) => s.error);
  const resetAll = useTableStore((s) => s.resetAll);
  const importTables = useTableStore((s) => s.importTables);
  const [importError, setImportError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = exportTablesToJson(tables);
    downloadJson(data, `ce-shipgen-tables-${generateSnapshotName()}.json`);
    setSaveMessage('Tables exported');
    setTimeout(() => setSaveMessage(null), 2000);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await importJsonFile(file);
      if (validateTableData(data)) {
        importTables(data as Record<TableId, typeof tables[TableId]>);
        setSaveMessage('Tables imported');
        setImportError(null);
      } else {
        setImportError('Invalid table data format');
      }
    } catch (err) {
      setImportError((err as Error).message);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading tables...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Data Tables</h1>
          <p className="text-sm text-slate-400 mt-1">Edit, import, export, and share rule tables. All changes auto-save to browser storage.</p>
        </div>
        <div className="flex items-center gap-2">
          {saveMessage && (
            <span className="text-sm text-green-400 bg-green-900/30 px-3 py-1 rounded-md">{saveMessage}</span>
          )}
          <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" /> Export All
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="btn-secondary flex items-center gap-2">
            <Upload className="w-4 h-4" /> Import
          </button>
          <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          <button onClick={resetAll} className="btn-danger flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Reset All
          </button>
        </div>
      </div>

      {importError && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-md text-red-300 text-sm">
          {importError}
        </div>
      )}

      <div className="space-y-2">
        {TABLE_ORDER.map((id) => {
          const table = tables[id];
          if (!table) return null;
          return (
            <CollapsibleSection 
              key={id} 
              title={table.name} 
              badge={table.rows.length}
              actions={
                <button 
                  onClick={() => {
                    const data = JSON.stringify({ [id]: table }, null, 2);
                    downloadJson(data, `ce-shipgen-${id}-${generateSnapshotName()}.json`);
                  }}
                  className="p-1.5 hover:bg-slate-600 rounded text-slate-400 hover:text-slate-200"
                  title="Export this table"
                >
                  <FileJson className="w-4 h-4" />
                </button>
              }
            >
              <TableEditor tableId={id} />
            </CollapsibleSection>
          );
        })}
      </div>
    </div>
  );
}
