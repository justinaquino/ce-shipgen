import type {
  TableRow,
  HullModel, DriveModel, ArmorModel, HullConfigModel, HullOptionModel,
  BridgeModel, ComputerModel, ComputerOptionModel,
  SoftwareModel, SensorModel, WeaponModel, ModuleModel,
  VehicleModel, SupplyModel, CrewPositionModel,
  LifeSupportModel, PowerPlantModel, LifeSupportExpenseModel,
  EnginePerformanceModel,
} from '../types';

function num(v: unknown): number {
  if (v === null || v === undefined) return 0;
  const n = Number(v);
  return isNaN(n) ? 0 : n;
}

function str(v: unknown): string {
  if (v === null || v === undefined) return '';
  return String(v).trim();
}

export function mapHull(row: TableRow): HullModel {
  return {
    id: str(row['DTONS'] ?? row['dtons'] ?? row['Hull Code']),
    dtons: num(row['DTONS'] ?? row['dtons']),
    cost: num(row['COST'] ?? row['cost']),
    constructionWeeks: num(row['Construction Time (weeks)'] ?? row['constructionWeeks']),
    performanceColumn: num(row['Performance Column'] ?? row['performanceColumn']),
    pricePerDton: num(row['Price/Dton'] ?? row['pricePerDton']),
  };
}

export function mapDrive(row: TableRow): DriveModel {
  return {
    id: str(row['Drive Code'] ?? row['driveCode'] ?? row['id']),
    jDriveTons: num(row['J-Drive\n Tons'] ?? row['J-Drive Tons'] ?? row['jDriveTons']),
    jDriveCost: num(row['J-Drive COST'] ?? row['J-Drive Cost'] ?? row['jDriveCost']),
    mDriveTons: num(row['M-Drive\n Tons'] ?? row['M-Drive Tons'] ?? row['mDriveTons']),
    mDriveCost: num(row['M-Drive COST'] ?? row['M-Drive Cost'] ?? row['mDriveCost']),
    powerPlantTons: num(row['P-Plant\n Tons'] ?? row['P-Plant Tons'] ?? row['powerPlantTons']),
    powerPlantCost: num(row['PP COST'] ?? row['PP Cost'] ?? row['powerPlantCost']),
    fuelPerWeek: num(row['Fuel/Wk\n (tons)'] ?? row['Fuel/Wk (tons)'] ?? row['fuelPerWeek']),
    minFuelVolume: num(row['Min. Fuel\n Volume'] ?? row['Min. Fuel Volume'] ?? row['minFuelVolume']),
    maxEnergyWeapons: num(row['Energy Weapons'] ?? row['maxEnergyWeapons']),
  };
}

export function mapArmor(row: TableRow): ArmorModel {
  const name = str(row['Armor Type'] ?? row['armorType']);
  return {
    id: name.split(' ')[0].toLowerCase(),
    name,
    tl: num(row['TL'] ?? row['tl']),
    protectionPer5Pct: num(row['Protection'] ?? row['protection'] ?? row['protectionPer5Pct']),
    costMultiplier: num(row['Cost'] ?? row['cost'] ?? row['costMultiplier']),
  };
}

export function mapHullConfig(row: TableRow): HullConfigModel {
  const name = str(row['Configuration'] ?? row['configuration'] ?? row['name']);
  const mod = num(row['Hull Cost Modifier'] ?? row['costModifier'] ?? row['Hull Cost Modifier']);
  return {
    id: name.toLowerCase(),
    name,
    costModifier: mod,
    atmosphericDm: name.toLowerCase() === 'distributed' ? -4 : name.toLowerCase() === 'standard' ? -2 : 0,
    fuelScoops: name.toLowerCase() !== 'distributed',
    notes: str(row['Notes'] ?? row['notes']),
  };
}

export function mapHullOption(row: TableRow): HullOptionModel {
  const name = str(row['Option'] ?? row['option'] ?? row['WEAPONS'] ?? row['name']);
  return {
    id: name.toLowerCase().replace(/\s+/g, '_'),
    name,
    tl: num(row['TL'] ?? row['tl']),
    costPerTon: num(row['Cost'] ?? row['cost'] ?? row['costPerTon']),
    notes: str(row['Notes'] ?? row['notes']),
  };
}

export function mapBridge(row: TableRow): BridgeModel {
  const name = str(row['WEAPONS'] ?? row['Bridge Size'] ?? row['name']);
  const rawTons = num(row['DTONS'] ?? row['Tons'] ?? row['tons']);
  return {
    id: name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
    name,
    minDtons: num(row['DT threshold'] ?? row['minDtons']),
    tons: rawTons,
    stations: num(row['Stations'] ?? row['stations'] ?? (rawTons === 10 ? 5 : rawTons === 20 ? 10 : rawTons === 40 ? 20 : rawTons === 60 ? 30 : 0)),
    cost: num(row['COST'] ?? row['Cost'] ?? row['cost']),
    notes: str(row['Notes'] ?? row['notes']),
  };
}

export function mapComputer(row: TableRow): ComputerModel {
  return {
    id: str(row['Model'] ?? row['model']),
    name: str(row['Model'] ?? row['model']),
    tl: num(row['TL'] ?? row['tl']),
    rating: num(row['Rating'] ?? row['rating']),
    cost: num(row['Cost'] ?? row['cost']),
  };
}

export function mapComputerOption(row: TableRow): ComputerOptionModel {
  return {
    id: str(row['Option'] ?? row['option'] ?? row['name']).toLowerCase().replace(/\s+/g, '_'),
    name: str(row['Option'] ?? row['option'] ?? row['name']),
    costMultiplier: num(row['Multiplier'] ?? row['costMultiplier']),
    notes: str(row['Notes'] ?? row['notes']),
  };
}

export function mapSoftware(row: TableRow): SoftwareModel {
  return {
    id: str(row['Program'] ?? row['program'] ?? row['WEAPONS'] ?? row['name']),
    name: str(row['Program'] ?? row['program'] ?? row['WEAPONS'] ?? row['name']),
    tl: num(row['TL'] ?? row['tl']),
    rating: num(row['Rating'] ?? row['rating']),
    cost: num(row['COST'] ?? row['Cost'] ?? row['cost']),
    notes: str(row['Notes'] ?? row['notes']),
  };
}

export function mapSensor(row: TableRow): SensorModel {
  return {
    id: str(row['Sensors'] ?? row['Sensor Type'] ?? row['System (Included in bridge)'] ?? row['name']),
    name: str(row['Sensors'] ?? row['Sensor Type'] ?? row['System (Included in bridge)'] ?? row['name']),
    tl: num(row['TL'] ?? row['tl']),
    dm: num(row['DM'] ?? row['dm']),
    includes: str(row['Includes'] ?? row['includes']),
    tons: num(row['Tons'] ?? row['tons']),
    cost: num(row['Cost'] ?? row['cost']),
  };
}

export function mapWeapon(row: TableRow): WeaponModel {
  return {
    id: str(row['WEAPONS'] ?? row['Weapon'] ?? row['name']),
    name: str(row['WEAPONS'] ?? row['Weapon'] ?? row['name']),
    tl: num(row['TL'] ?? row['tl']),
    tons: num(row['DTONS'] ?? row['Tons'] ?? row['tons']),
    cost: num(row['COST'] ?? row['Cost'] ?? row['cost']),
    range: str(row['Range'] ?? row['Optimum Range'] ?? row['range']),
    damage: str(row['Damage'] ?? row['damage']),
    notes: str(row['Notes'] ?? row['Descirption'] ?? row['Description'] ?? row['notes']),
  };
}

export function mapModule(row: TableRow): ModuleModel {
  return {
    id: str(row['Module'] ?? row['module'] ?? row['WEAPONS'] ?? row['name']),
    name: str(row['Module'] ?? row['module'] ?? row['WEAPONS'] ?? row['name']),
    tl: num(row['TL'] ?? row['tl']),
    dtons: num(row['Dtons'] ?? row['DTONS'] ?? row['dtons']),
    cost: num(row['Cost'] ?? row['COST'] ?? row['cost']),
    notes: str(row['Function'] ?? row['Notes'] ?? row['notes']),
  };
}

export function mapVehicle(row: TableRow): VehicleModel {
  return {
    id: str(row['Vehicle'] ?? row['vehicle'] ?? row['WEAPONS'] ?? row['name']),
    name: str(row['Vehicle'] ?? row['vehicle'] ?? row['WEAPONS'] ?? row['name']),
    tl: num(row['TL'] ?? row['tl']),
    dtons: num(row['Dtons'] ?? row['DTONS'] ?? row['dtons']),
    cost: num(row['Cost'] ?? row['COST'] ?? row['cost']),
    notes: str(row['Notes'] ?? row['notes']),
  };
}

export function mapSupply(row: TableRow): SupplyModel {
  return {
    id: str(row['Supply'] ?? row['supply'] ?? row['SUPPLIES'] ?? row['name']),
    name: str(row['Supply'] ?? row['supply'] ?? row['SUPPLIES'] ?? row['name']),
    tl: row['TL'] !== undefined ? num(row['TL']) : null,
    dtons: row['Dtons'] !== undefined ? num(row['Dtons']) : null,
    cost: row['Cost'] !== undefined ? num(row['Cost']) : null,
    notes: str(row['Notes'] ?? row['notes']),
  };
}

export function mapCrew(row: TableRow): CrewPositionModel {
  return {
    id: str(row['Position'] ?? row['position']).toLowerCase().replace(/[^a-z0-9]/g, '_'),
    position: str(row['Position'] ?? row['position']),
    minimum: str(row['Minimum'] ?? row['minimum']),
    fullComplement: str(row['Full Complement'] ?? row['fullComplement']),
    salary: num(row['Salary'] ?? row['salary']),
    shift: num(row['Shift'] ?? row['shift']),
  };
}

export function mapLifeSupport(row: TableRow): LifeSupportModel {
  return {
    id: str(row['Type'] ?? row['type'] ?? row['WEAPONS'] ?? row['name']).toLowerCase().replace(/\s+/g, '_'),
    name: str(row['Type'] ?? row['type'] ?? row['WEAPONS'] ?? row['name']),
    tl: num(row['TL'] ?? row['tl']),
    dtons: num(row['Dtons'] ?? row['DTONS'] ?? row['dtons']),
    cost: num(row['Cost'] ?? row['COST'] ?? row['cost']),
    notes: str(row['Notes'] ?? row['notes']),
  };
}

export function mapPowerPlant(row: TableRow): PowerPlantModel {
  return {
    id: str(row['Type'] ?? row['type'] ?? row['name']).toLowerCase().replace(/[^a-z0-9]/g, '_'),
    name: str(row['Type'] ?? row['type'] ?? row['name']),
    tl: num(row['TL'] ?? row['tl']),
    multiplier: num(row['Multiplier'] ?? row['multiplier']),
    fuelRate: num(row['Fuel Rate'] ?? row['fuelRate']),
  };
}

export function mapLifeSupportExpense(row: TableRow): LifeSupportExpenseModel {
  return {
    id: str(row['Passage Type'] ?? row['passageType']).toLowerCase().replace(/\s+/g, '_'),
    passageType: str(row['Passage Type'] ?? row['passageType']),
    cost: num(row['Cost'] ?? row['cost']),
    base: num(row['Base'] ?? row['base']),
  };
}

export function mapEnginePerformance(row: TableRow): EnginePerformanceModel {
  const driveCode = str(row['Drive Code'] ?? Object.values(row)[0]);
  const result: EnginePerformanceModel = { id: driveCode, driveCode };
  for (const [key, val] of Object.entries(row)) {
    if (key !== 'Drive Code' && key !== 'id' && key !== 'driveCode') {
      result[key] = val;
    }
  }
  return result;
}
