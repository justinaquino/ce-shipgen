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
  if (mIndex < 0) return jDriveLetter.toUpperCase();
  if (jIndex < 0) return mDriveLetter.toUpperCase();
  return letters[Math.max(mIndex, jIndex)];
}

// ─── Bridge Calculations ───

export function calcBridgeCost(hullDtons: number): number {
  return 0.5 * (hullDtons / 100) * 1000000; // MCr0.5 per 100 tons
}

// ─── Crew Calculations ───

export function calcEngineerCount(driveTons: number, powerPlantTons: number): number {
  return Math.ceil((driveTons + powerPlantTons) / 35);
}

export function calcMedicCount(passengersAndCrew: number): number {
  return Math.ceil(passengersAndCrew / 120);
}

export function calcStewardCount(highPassengers: number, middlePassengers: number): number {
  return Math.ceil(highPassengers / 4) + Math.ceil(middlePassengers / 10);
}

// ─── Life Support Calculations ───

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

// ─── Cost Summary ───

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
  return totalCost * 0.01; // 1% for new designs
}

// ─── Drive Performance Lookup ───

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
