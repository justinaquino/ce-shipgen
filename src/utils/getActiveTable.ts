import type { DataTable, TableId, ComponentType } from '../types';

const COMPONENT_TO_TABLE: Record<ComponentType, TableId> = {
  hull: 'ship_hulls',
  configuration: 'hull_configurations',
  armor: 'ship_armor',
  m_drive: 'ship_drives',
  j_drive: 'ship_drives',
  power_plant: 'ship_drives',
  bridge: 'ship_bridge',
  computer: 'ship_computers',
  software: 'ship_software',
  sensors: 'ship_sensors',
  accommodations: 'life_support',
  features: 'ship_modules',
  weapons: 'ship_weapons',
  vehicles: 'ship_vehicles',
};

export function getActiveTableKey(type: ComponentType): string {
  const registryRaw = localStorage.getItem('ce_shipgen_active_tables');
  const registry = registryRaw ? JSON.parse(registryRaw) : {};
  return registry[type] || 'default';
}

export function setActiveTableKey(type: ComponentType, tableKey: string): void {
  const registryRaw = localStorage.getItem('ce_shipgen_active_tables');
  const registry = registryRaw ? JSON.parse(registryRaw) : {};
  registry[type] = tableKey;
  localStorage.setItem('ce_shipgen_active_tables', JSON.stringify(registry));
}

export function resetActiveTables(): void {
  localStorage.removeItem('ce_shipgen_active_tables');
}

export function getActiveTable(
  type: ComponentType,
  tables: Record<TableId, DataTable>
): DataTable | null {
  const tableId = COMPONENT_TO_TABLE[type];
  const table = tables[tableId];
  if (!table) return null;

  const activeKey = getActiveTableKey(type);
  if (activeKey === 'default') {
    return table;
  }

  // Look for custom table in localStorage
  const customRaw = localStorage.getItem(`ce_shipgen_table_${activeKey}`);
  if (customRaw) {
    try {
      return JSON.parse(customRaw) as DataTable;
    } catch {
      // fall through to default
    }
  }

  return table;
}

export function listAvailableTables(
  type: ComponentType,
  tables: Record<TableId, DataTable>
): { key: string; name: string; isDefault: boolean }[] {
  const result: { key: string; name: string; isDefault: boolean }[] = [];

  // Add default
  const tableId = COMPONENT_TO_TABLE[type];
  const defaultTable = tables[tableId];
  if (defaultTable) {
    result.push({ key: 'default', name: `${defaultTable.name} (Default)`, isDefault: true });
  }

  // Scan localStorage for custom tables of this type
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('ce_shipgen_table_')) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        if (data.id === tableId || data.type === type) {
          result.push({ key: key.replace('ce_shipgen_table_', ''), name: data.name || 'Untitled', isDefault: false });
        }
      } catch {
        // ignore invalid entries
      }
    }
  }

  return result;
}
