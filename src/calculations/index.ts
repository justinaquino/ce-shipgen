import type { ShipComponent } from '../types';

// ─── Hull Calculations ───

export function calcHullPoints(dtons: number): number {
  return Math.floor(dtons / 50);
}

export function calcStructurePoints(dtons: number): number {
  return Math.ceil(dtons / 50);
}

export function calcHardpoints(dtons: number): number {
  return Math.floor(dtons / 100);
}

// ─── Armor Calculations ───

export function calcArmorTonnage(
  hullDtons: number,
  armorPercentage: number, // e.g. 0.05 for 5%
  qty: number,
  configModifier: number
): number {
  return hullDtons * armorPercentage * qty * configModifier;
}

export function calcArmorCost(
  hullCost: number,
  armorCostMultiplier: number,
  qty: number
): number {
  return hullCost * armorCostMultiplier * qty;
}

// ─── Drive Calculations ───

export function calcJumpFuel(hullDtons: number, jumpParsecs: number): number {
  return 0.1 * hullDtons * jumpParsecs;
}

export function calcPowerFuel(powerPlantTons: number, weeks: number): number {
  return (powerPlantTons / 3) * weeks;
}

export function getMinPowerPlantLetter(mDriveLetter: string, jDriveLetter: string): string {
  if (!mDriveLetter && !jDriveLetter) return '';
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const mIndex = letters.indexOf(mDriveLetter.toUpperCase());
  const jIndex = letters.indexOf(jDriveLetter.toUpperCase());
  const maxIndex = Math.max(mIndex, jIndex);
  if (maxIndex < 0) return '';
  return letters[maxIndex];
}

// ─── Bridge & Computer Calculations ───

export function calcBridgeCost(hullDtons: number): number {
  // Simplified: bridge cost scales with hull
  return hullDtons * 5000;
}

// ─── Crew Calculations ───

export function calcEngineerCount(driveTons: number, powerPlantTons: number): number {
  const totalDriveTons = driveTons + powerPlantTons;
  if (totalDriveTons <= 0) return 0;
  if (totalDriveTons < 50) return 1;
  if (totalDriveTons < 100) return 2;
  return 3;
}

export function calcMedicCount(passengersAndCrew: number): number {
  if (passengersAndCrew <= 0) return 0;
  if (passengersAndCrew <= 12) return 1;
  return Math.floor(passengersAndCrew / 12);
}

export function calcStewardCount(highPassengers: number, middlePassengers: number): number {
  const totalPassengers = highPassengers + middlePassengers;
  if (totalPassengers <= 0) return 0;
  return Math.max(1, Math.ceil(totalPassengers / 8));
}

// ─── Accommodation Calculations ───

export function calcStateroomTonnage(count: number): number {
  return count * 4;
}

export function calcStateroomCost(count: number): number {
  return count * 500000;
}

export function calcLowBerthTonnage(count: number): number {
  return count * 0.5;
}

export function calcLowBerthCost(count: number): number {
  return count * 50000;
}

// ─── Cost & Tonnage Summaries ───

export function calcTotalCost(components: ShipComponent[]): number {
  return components.reduce((sum, c) => sum + c.cost, 0);
}

export function calcTotalTonnage(components: ShipComponent[]): number {
  return components.reduce((sum, c) => sum + c.dtons, 0);
}

export function calcStandardDesignDiscount(totalCost: number): number {
  return totalCost * 0.1; // 10% discount
}

export function calcNavalArchitectFee(totalCost: number): number {
  return totalCost * 0.01; // 1% fee
}

// ─── Drive Validation ───

export function getValidDriveCodes(
  hullDtons: number,
  performanceTable: { driveCode: string; [hullSize: string]: string | number | null }[]
): string[] {
  const colKey = String(hullDtons);
  const valid: string[] = [];
  for (const row of performanceTable) {
    const val = row[colKey];
    if (val !== null && val !== undefined && val !== '' && val !== '--') {
      const numVal = Number(val);
      if (!isNaN(numVal) && numVal > 0) {
        valid.push(row.driveCode);
      }
    }
  }
  return valid;
}

// ─── Mneme Calculations ───

export interface MacResult {
  attackDm: number;
  extraDamage: string;
}

export function calcMacPotential(weaponCount: number): MacResult {
  // Mneme Space Combat MAC Table
  if (weaponCount >= 10) return { attackDm: 2, extraDamage: '+2D6' };
  if (weaponCount >= 5) return { attackDm: 1, extraDamage: '+1D6' };
  if (weaponCount >= 2) return { attackDm: 1, extraDamage: '+1' };
  return { attackDm: 0, extraDamage: '+0' };
}

export interface MnemeCombatStats {
  weaponCount: number;
  mac: MacResult;
  hullPoints: number;
  structurePoints: number;
  hardpoints: number;
  usedHardpoints: number;
  initiativeMod: number;
  thrustRating: number;
}

export function calcMnemeCombatStats(
  hullDtons: number,
  weaponCount: number,
  thrustRating: number,
): MnemeCombatStats {
  return {
    weaponCount,
    mac: calcMacPotential(weaponCount),
    hullPoints: calcHullPoints(hullDtons),
    structurePoints: calcStructurePoints(hullDtons),
    hardpoints: calcHardpoints(hullDtons),
    usedHardpoints: weaponCount,
    initiativeMod: thrustRating >= 4 ? 1 : 0,
    thrustRating,
  };
}

export function calcMnemeBridgeStations(bridgeTons: number): number {
  return bridgeTons; // 1 station per Dton
}

export function calcMnemeLifePodTonnage(adults: number): number {
  return Math.ceil(adults / 3); // 1 Dton per 3 adults
}

// ─── CE Crew Calculations ───

export interface CrewPosition {
  position: string;
  minimum: number;
  fullComplement: number;
  salary: number;
  shiftPay: number;
  notes?: string;
}

export interface CrewRequirements {
  positions: CrewPosition[];
  totalMinimum: number;
  totalFull: number;
  monthlySalary: number;
  shiftPay: number;
}

export function calcCrewRequirements(
  hullDtons: number,
  hasDrives: boolean,
  hasJump: boolean,
  hasSensors: boolean,
  weaponCount: number,
  stateroomCount: number,
  lowBerthCount: number,
  bridgeCount: number,
): CrewRequirements {
  const positions: CrewPosition[] = [];

  // Pilot: always 1 minimum for any spacecraft
  if (hasDrives) {
    positions.push({
      position: 'Pilot',
      minimum: 1,
      fullComplement: 1,
      salary: 6000,
      shiftPay: 1500,
    });
  }

  // Engineer: 1 minimum, scales with drive tonnage
  if (hasDrives) {
    positions.push({
      position: 'Engineer',
      minimum: 1,
      fullComplement: Math.max(1, Math.ceil(hullDtons / 200)),
      salary: 4000,
      shiftPay: 1000,
    });
  }

  // Navigator: 1 if jump or sensors
  if (hasJump || hasSensors) {
    positions.push({
      position: 'Navigator / Sensor Op',
      minimum: 1,
      fullComplement: 1,
      salary: 5000,
      shiftPay: 1250,
    });
  }

  // Medic: 1 if any accommodations
  const totalPeople = stateroomCount * 2 + lowBerthCount;
  if (totalPeople > 0) {
    positions.push({
      position: 'Medic',
      minimum: 1,
      fullComplement: Math.max(1, Math.ceil(totalPeople / 12)),
      salary: 2000,
      shiftPay: 500,
    });
  }

  // Gunner: 1 per weapon mount/turret
  if (weaponCount > 0) {
    positions.push({
      position: 'Gunner',
      minimum: weaponCount,
      fullComplement: weaponCount,
      salary: 1000,
      shiftPay: 250,
    });
  }

  // Steward: if any staterooms
  if (stateroomCount > 0) {
    positions.push({
      position: 'Steward',
      minimum: 1,
      fullComplement: Math.max(1, Math.ceil(stateroomCount / 8)),
      salary: 3000,
      shiftPay: 750,
    });
  }

  // Ship's Master: 1 per ship (part of full complement)
  positions.push({
    position: "Ship's Master",
    minimum: bridgeCount > 0 ? 1 : 0,
    fullComplement: Math.max(1, bridgeCount),
    salary: 6000,
    shiftPay: 1500,
  });

  // Purser: 1 per 200 dtons (min 1)
  if (hullDtons >= 100) {
    positions.push({
      position: "Ship's Purser",
      minimum: 0,
      fullComplement: Math.max(1, Math.ceil(hullDtons / 200)),
      salary: 3000,
      shiftPay: 750,
    });
  }

  const totalMinimum = positions.reduce((s, p) => s + p.minimum, 0);
  const totalFull = positions.reduce((s, p) => s + p.fullComplement, 0);
  const monthlySalary = positions.reduce((s, p) => s + (p.salary * p.fullComplement), 0);
  const shiftPayTotal = positions.reduce((s, p) => s + (p.shiftPay * p.fullComplement), 0);

  return {
    positions,
    totalMinimum,
    totalFull,
    monthlySalary,
    shiftPay: shiftPayTotal,
  };
}
