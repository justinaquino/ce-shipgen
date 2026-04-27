import { useState, useMemo, useCallback } from 'react';
import { useTableStore } from '../store/tableStore';
import { CollapsibleSection } from './CollapsibleSection';
import { BOQView } from './BOQView';
import { MnemeCombatPanel } from './MnemeCombatPanel';
import { downloadJson, generateSnapshotName } from '../utils/exportImport';
import {
  calcArmorTonnage, calcArmorCost, calcJumpFuel, calcPowerFuel,
  getMinPowerPlantLetter, calcStateroomTonnage, calcStateroomCost,
  calcLowBerthTonnage, calcLowBerthCost,
} from '../calculations';
import { validateShip } from '../validations';
import { Save, Calculator, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import type { ShipComponent, ShipDesign } from '../types';

export function ShipDesigner() {
  const tables = useTableStore((s) => s.tables);
  const addShip = useTableStore((s) => s.addShip);
  const ships = useTableStore((s) => s.ships);
  const updateShip = useTableStore((s) => s.updateShip);
  const deleteShip = useTableStore((s) => s.deleteShip);
  const setCurrentShip = useTableStore((s) => s.setCurrentShip);
  const currentShip = useTableStore((s) => s.currentShip);

  // Form state
  const [name, setName] = useState('');
  const [tl, setTl] = useState(9);
  const [hullCode, setHullCode] = useState('');
  const [config, setConfig] = useState('Standard');
  const [armorType, setArmorType] = useState('');
  const [armorQty, setArmorQty] = useState(1);
  const [mDrive, setMDrive] = useState('');
  const [jDrive, setJDrive] = useState('');
  const [powerPlant, setPowerPlant] = useState('');
  const [bridge, setBridge] = useState('');
  const [computer, setComputer] = useState('');
  const [softwareList, setSoftwareList] = useState<string[]>([]);
  const [sensors, setSensors] = useState('');
  const [staterooms, setStaterooms] = useState(0);
  const [lowBerths, setLowBerths] = useState(0);
  const [selectedModules, setSelectedModules] = useState<{id: string; qty: number}[]>([]);
  const [selectedWeapons, setSelectedWeapons] = useState<{id: string; qty: number}[]>([]);
  const [jumpParsecs, setJumpParsecs] = useState(2);
  const [cargo, setCargo] = useState(0);

  // Get table data
  const hulls = tables.ship_hulls?.rows || [];
  const configs = tables.hull_configurations?.rows || [];
  const armors = tables.ship_armor?.rows || [];
  const drives = tables.ship_drives?.rows || [];
  const bridges = tables.ship_bridge?.rows || [];
  const software = tables.ship_software?.rows || [];
  const sensorList = tables.ship_sensors?.rows || [];
  const modules = tables.ship_modules?.rows || [];
  const weapons = tables.ship_weapons?.rows || [];


  const selectedHull = hulls.find((h: Record<string, unknown>) => String(h['DTONS']) === hullCode || String(h['Performance Column']) === hullCode);
  const hullDtons = selectedHull ? Number(selectedHull['DTONS']) : 0;
  const hullCost = selectedHull ? Number(selectedHull['COST']) : 0;

  const selectedConfig = configs.find((c: Record<string, unknown>) => String(c['Configuration']).includes(config));
  const configMod = selectedConfig ? Number(selectedConfig['Hull Cost Modifier'] || 0) : 0;

  const selectedArmor = armors.find((a: Record<string, unknown>) => String(a['Armor Type']).includes(armorType));
  const armorProtection = selectedArmor ? Number(selectedArmor['Protection'] || 0) : 0;
  const armorCostMod = selectedArmor ? Number(selectedArmor['Cost'] || 0) : 0;
  const armorTons = calcArmorTonnage(hullDtons, 0.05, armorQty, 1.0);
  const armorCost = calcArmorCost(hullCost, armorCostMod, armorQty);

  const selectedMDrive = drives.find((d: Record<string, unknown>) => String(d['Drive Code']) === mDrive);
  const mDriveTons = selectedMDrive ? Number(selectedMDrive['M-Drive\n Tons'] || 0) : 0;
  const mDriveCost = selectedMDrive ? Number(selectedMDrive['M-Drive COST'] || 0) : 0;

  const selectedJDrive = drives.find((d: Record<string, unknown>) => String(d['Drive Code']) === jDrive);
  const jDriveTons = selectedJDrive ? Number(selectedJDrive['J-Drive\n Tons'] || 0) : 0;
  const jDriveCost = selectedJDrive ? Number(selectedJDrive['J-Drive COST'] || 0) : 0;

  const selectedPP = drives.find((d: Record<string, unknown>) => String(d['Drive Code']) === powerPlant);
  const ppTons = selectedPP ? Number(selectedPP['P-Plant\n Tons'] || 0) : 0;
  const ppCost = selectedPP ? Number(selectedPP['PP COST'] || 0) : 0;
  const selectedBridge = bridges.find((b: Record<string, unknown>) => String(b['WEAPONS'] || b['Bridge Size']).includes(bridge));
  const bridgeTons = selectedBridge ? Number(selectedBridge['DTONS'] || selectedBridge['Tons'] || 0) : 0;
  const bridgeCost = selectedBridge ? Number(selectedBridge['COST'] || 0) : 0;

  const jumpFuel = calcJumpFuel(hullDtons, jumpParsecs);
  const powerFuel = calcPowerFuel(ppTons, 2);
  const totalFuel = jumpFuel + powerFuel;

  const stateroomTons = calcStateroomTonnage(staterooms);
  const stateroomCost = calcStateroomCost(staterooms);
  const lowBerthTons = calcLowBerthTonnage(lowBerths);
  const lowBerthCost = calcLowBerthCost(lowBerths);

  const moduleComponents: ShipComponent[] = selectedModules.map((sm) => {
    const mod = modules.find((m: Record<string, unknown>) => String(m['Module'] || m['WEAPONS']).includes(sm.id));
    const tons = mod ? Number(mod['Dtons'] || mod['DTONS'] || 0) : 0;
    const cost = mod ? Number(mod['Cost'] || mod['COST'] || 0) : 0;
    return {
      section: 'Module',
      module: sm.id,
      dtons: tons * sm.qty,
      cost: cost * sm.qty,
      qty: sm.qty,
    };
  });

  const weaponComponents: ShipComponent[] = selectedWeapons.map((sw) => {
    const wpn = weapons.find((w: Record<string, unknown>) => String(w['WEAPONS']).includes(sw.id));
    const tons = wpn ? Number(wpn['DTONS'] || 0) : 0;
    const cost = wpn ? Number(wpn['COST'] || 0) : 0;
    return {
      section: 'Weapon',
      module: sw.id,
      dtons: tons * sw.qty,
      cost: cost * sw.qty,
      qty: sw.qty,
    };
  });

  const usedTons = hullDtons > 0 ? (
    armorTons + mDriveTons + jDriveTons + ppTons + bridgeTons + totalFuel +
    stateroomTons + lowBerthTons + cargo +
    moduleComponents.reduce((s, c) => s + c.dtons, 0) +
    weaponComponents.reduce((s, c) => s + c.dtons, 0)
  ) : 0;

  const availableDtons = hullDtons - usedTons + cargo; // cargo is adjustable

  const totalCost = hullCost + (hullCost * configMod) + armorCost + mDriveCost + jDriveCost + ppCost +
    bridgeCost + stateroomCost + lowBerthCost +
    moduleComponents.reduce((s, c) => s + c.cost, 0) +
    weaponComponents.reduce((s, c) => s + c.cost, 0);

  const components: ShipComponent[] = useMemo(() => {
    const list: ShipComponent[] = [];
    if (hullDtons > 0) {
      list.push({ section: 'Hull', module: `Hull ${hullDtons}DT`, dtons: hullDtons, cost: hullCost });
      list.push({ section: 'Config', module: config, dtons: 0, cost: hullCost * configMod });
    }
    if (armorTons > 0) list.push({ section: 'Armor', module: armorType, dtons: armorTons, cost: armorCost });
    if (mDriveTons > 0) list.push({ section: 'M-Drive', module: mDrive, dtons: mDriveTons, cost: mDriveCost });
    if (jDriveTons > 0) list.push({ section: 'J-Drive', module: jDrive, dtons: jDriveTons, cost: jDriveCost });
    if (ppTons > 0) list.push({ section: 'Power Plant', module: powerPlant, dtons: ppTons, cost: ppCost });
    if (bridgeTons > 0) list.push({ section: 'Bridge', module: bridge, dtons: bridgeTons, cost: bridgeCost });
    if (totalFuel > 0) list.push({ section: 'Fuel', module: 'Jump + Power Plant', dtons: totalFuel, cost: 0 });
    if (stateroomTons > 0) list.push({ section: 'Life Support', module: `${staterooms} Staterooms`, dtons: stateroomTons, cost: stateroomCost });
    if (lowBerthTons > 0) list.push({ section: 'Life Support', module: `${lowBerths} Low Berths`, dtons: lowBerthTons, cost: lowBerthCost });
    list.push(...moduleComponents);
    list.push(...weaponComponents);
    if (cargo > 0) list.push({ section: 'Cargo', module: 'Cargo Hold', dtons: cargo, cost: 0 });
    return list;
  }, [hullDtons, hullCost, config, configMod, armorTons, armorType, armorCost, mDriveTons, mDrive, mDriveCost, jDriveTons, jDrive, jDriveCost, ppTons, powerPlant, ppCost, bridgeTons, bridge, bridgeCost, totalFuel, stateroomTons, staterooms, stateroomCost, lowBerthTons, lowBerths, lowBerthCost, moduleComponents, weaponComponents, cargo]);

  // Validation
  const validation = useMemo(() => {
    if (!hullDtons) return null;
    const design: ShipDesign = {
      id: currentShip?.id || 'temp',
      name, tl, hullCode, hullDtons, configuration: config,
      armor: armorType, mDrive, jDrive, powerPlant,
      bridge, computer, software: softwareList,
      sensors, staterooms, lowBerths,
      crew: [],
      modules: moduleComponents,
      weapons: weaponComponents,
      cargo, components, totalCost, availableDtons,
      createdAt: currentShip?.createdAt || new Date().toISOString(),
    };
    return validateShip(design);
  }, [name, tl, hullCode, hullDtons, config, armorType, mDrive, jDrive, powerPlant, bridge, computer, softwareList, sensors, staterooms, lowBerths, moduleComponents, weaponComponents, cargo, components, totalCost, availableDtons, currentShip]);

  const toggleSoftware = useCallback((sw: string) => {
    setSoftwareList(prev => prev.includes(sw) ? prev.filter(s => s !== sw) : [...prev, sw]);
  }, []);

  const toggleModule = useCallback((mod: string) => {
    setSelectedModules(prev => {
      const exists = prev.find(m => m.id === mod);
      if (exists) return prev.filter(m => m.id !== mod);
      return [...prev, { id: mod, qty: 1 }];
    });
  }, []);

  const updateModuleQty = useCallback((mod: string, qty: number) => {
    setSelectedModules(prev => prev.map(m => m.id === mod ? { ...m, qty: Math.max(1, qty) } : m));
  }, []);

  const toggleWeapon = useCallback((wpn: string) => {
    setSelectedWeapons(prev => {
      const exists = prev.find(w => w.id === wpn);
      if (exists) return prev.filter(w => w.id !== wpn);
      return [...prev, { id: wpn, qty: 1 }];
    });
  }, []);

  const updateWeaponQty = useCallback((wpn: string, qty: number) => {
    setSelectedWeapons(prev => prev.map(w => w.id === wpn ? { ...w, qty: Math.max(1, qty) } : w));
  }, []);

  const saveShip = () => {
    const ship: ShipDesign = {
      id: currentShip?.id || `ship-${Date.now()}`,
      name: name || 'Untitled Ship',
      tl,
      hullCode,
      hullDtons,
      configuration: config,
      armor: armorType,
      mDrive,
      jDrive,
      powerPlant,
      bridge,
      computer,
      software: softwareList,
      sensors,
      staterooms,
      lowBerths,
      crew: [],
      modules: moduleComponents,
      weapons: weaponComponents,
      cargo,
      components,
      totalCost,
      availableDtons,
      createdAt: currentShip?.createdAt || new Date().toISOString(),
    };
    if (currentShip) {
      updateShip(ship);
    } else {
      addShip(ship);
    }
    setCurrentShip(ship);
  };

  const loadShip = (ship: ShipDesign) => {
    setName(ship.name);
    setTl(ship.tl);
    setHullCode(ship.hullCode);
    setConfig(ship.configuration);
    setArmorType(ship.armor);
    setMDrive(ship.mDrive);
    setJDrive(ship.jDrive);
    setPowerPlant(ship.powerPlant);
    setBridge(ship.bridge);
    setComputer(ship.computer);
    setSoftwareList(ship.software);
    setSensors(ship.sensors);
    setStaterooms(ship.staterooms);
    setLowBerths(ship.lowBerths);
    setCargo(ship.cargo);
    setSelectedModules(ship.modules.map(m => ({ id: m.module, qty: m.qty || 1 })));
    setSelectedWeapons(ship.weapons.map(w => ({ id: w.module, qty: w.qty || 1 })));
    setCurrentShip(ship);
  };

  const exportShip = () => {
    if (!currentShip) return;
    downloadJson(JSON.stringify(currentShip, null, 2), `ship-${currentShip.name.replace(/\s+/g, '_')}-${generateSnapshotName()}.json`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Ship Designer</h1>
          <div className="flex gap-2">
            <button onClick={saveShip} className="btn-primary flex items-center gap-2">
              <Save className="w-4 h-4" /> {currentShip ? 'Update' : 'Save'}
            </button>
            {currentShip && (
              <button onClick={exportShip} className="btn-secondary flex items-center gap-2">
                <Calculator className="w-4 h-4" /> Export
              </button>
            )}
          </div>
        </div>

        {validation && (
          <div className={`rounded-lg p-3 text-sm ${validation.valid ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'}`}>
            <div className="flex items-center gap-2 font-semibold mb-1">
              {validation.valid ? <CheckCircle size={16} className="text-green-400"/> : <AlertTriangle size={16} className="text-red-400"/>}
              <span className={validation.valid ? 'text-green-300' : 'text-red-300'}>
                {validation.valid ? 'Design Valid' : `${validation.hardErrors.length} Issue${validation.hardErrors.length > 1 ? 's' : ''}`}
              </span>
            </div>
            {!validation.valid && (
              <ul className="list-disc list-inside text-red-200 space-y-0.5">
                {validation.hardErrors.map((err: {message: string}, i: number) => (
                  <li key={i}>{err.message}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <CollapsibleSection title="1. Basic Info" defaultOpen>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Ship Name</label>
              <input className="input w-full" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Tech Level</label>
              <input className="input w-full" type="number" min={7} max={15} value={tl} onChange={(e) => setTl(Number(e.target.value))} />
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="2. Hull & Configuration" defaultOpen>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Hull Size</label>
              <select className="input w-full" value={hullCode} onChange={(e) => setHullCode(e.target.value)}>
                <option value="">Select Hull...</option>
                {hulls.map((h: Record<string, unknown>, i: number) => (
                  <option key={i} value={String(h['DTONS'])}>
                    {String(h['DTONS'])} DT — {Number(h['COST']).toLocaleString()} Cr
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Configuration</label>
              <select className="input w-full" value={config} onChange={(e) => setConfig(e.target.value)}>
                {configs.map((c: Record<string, unknown>, i: number) => (
                  <option key={i} value={String(c['Configuration']).split(' ')[0]}>
                    {String(c['Configuration'])}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {hullDtons > 0 && (
            <div className="mt-3 text-sm text-slate-400">
              Hull Points: {Math.floor(hullDtons / 50)} | Structure Points: {Math.ceil(hullDtons / 50)} | Hardpoints: {Math.floor(hullDtons / 100)}
            </div>
          )}
        </CollapsibleSection>

        <CollapsibleSection title="3. Armor" defaultOpen>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Armor Type</label>
              <select className="input w-full" value={armorType} onChange={(e) => setArmorType(e.target.value)}>
                <option value="">None</option>
                {armors.map((a: Record<string, unknown>, i: number) => (
                  <option key={i} value={String(a['Armor Type']).split(' ')[0]}>
                    {String(a['Armor Type'])}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Thickness (×5%)</label>
              <input className="input w-full" type="number" min={0} max={10} value={armorQty} onChange={(e) => setArmorQty(Number(e.target.value))} />
            </div>
            <div className="flex items-end">
              <div className="text-sm text-slate-400">
                {armorTons > 0 && <span>{armorTons.toFixed(1)} DT | Protection: {armorProtection * armorQty}</span>}
              </div>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="4. Drives & Power" defaultOpen>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Jump Parsecs</label>
              <select className="input w-full" value={jumpParsecs} onChange={(e) => setJumpParsecs(Number(e.target.value))}>
                {[1,2,3,4,5,6].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">M-Drive</label>
              <select className="input w-full" value={mDrive} onChange={(e) => setMDrive(e.target.value)}>
                <option value="">None</option>
                {drives.filter((d: Record<string, unknown>) => Number(d['M-Drive\n Tons']) > 0).map((d: Record<string, unknown>, i: number) => (
                  <option key={i} value={String(d['Drive Code'])}>
                    {String(d['Drive Code'])} — {String(d['M-Drive\n Tons'])} DT
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">J-Drive</label>
              <select className="input w-full" value={jDrive} onChange={(e) => setJDrive(e.target.value)}>
                <option value="">None</option>
                {drives.filter((d: Record<string, unknown>) => Number(d['J-Drive\n Tons']) > 0).map((d: Record<string, unknown>, i: number) => (
                  <option key={i} value={String(d['Drive Code'])}>
                    {String(d['Drive Code'])} — {String(d['J-Drive\n Tons'])} DT
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Power Plant</label>
              <select className="input w-full" value={powerPlant} onChange={(e) => setPowerPlant(e.target.value)}>
                <option value="">None</option>
                {drives.map((d: Record<string, unknown>, i: number) => (
                  <option key={i} value={String(d['Drive Code'])}>
                    {String(d['Drive Code'])} — {String(d['P-Plant\n Tons'])} DT
                  </option>
                ))}
              </select>
              {mDrive && jDrive && powerPlant && (
                <div className={`text-xs mt-1 flex items-center gap-1 ${
                  getMinPowerPlantLetter(mDrive, jDrive) <= powerPlant ? 'text-green-400' : 'text-red-400'
                }`}>
                  {getMinPowerPlantLetter(mDrive, jDrive) <= powerPlant ? <CheckCircle size={12}/> : <AlertTriangle size={12}/>}
                  PP ≥ {getMinPowerPlantLetter(mDrive, jDrive)} required
                </div>
              )}
            </div>
          </div>
          <div className="mt-3 text-sm text-slate-400">
            Fuel: Jump {jumpFuel.toFixed(1)} DT + Power {powerFuel.toFixed(1)} DT = {totalFuel.toFixed(1)} DT
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="5. Bridge & Computer" defaultOpen>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Bridge / Cockpit</label>
              <select className="input w-full" value={bridge} onChange={(e) => setBridge(e.target.value)}>
                <option value="">None</option>
                {bridges.map((b: Record<string, unknown>, i: number) => (
                  <option key={i} value={String(b['WEAPONS'] || b['Bridge Size'])}>
                    {String(b['WEAPONS'] || b['Bridge Size'])} — {String(b['DTONS'] || b['Tons'])} DT
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Computer</label>
              <input className="input w-full" value={computer} onChange={(e) => setComputer(e.target.value)} placeholder="e.g. Model 2 bis/fib" />
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="6. Software" defaultOpen>
          <div className="grid grid-cols-2 gap-2">
            {software.map((sw: Record<string, unknown>, i: number) => (
              <label key={i} className="flex items-center gap-2 p-2 rounded hover:bg-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={softwareList.includes(String(sw['WEAPONS'] || sw['Program'] || sw['Software']))}
                  onChange={() => toggleSoftware(String(sw['WEAPONS'] || sw['Program'] || sw['Software']))}
                  className="rounded border-slate-600"
                />
                <span className="text-sm">{String(sw['WEAPONS'] || sw['Program'] || sw['Software'])}</span>
                <span className="text-xs text-slate-500 ml-auto">{sw['COST'] ? Number(sw['COST']).toLocaleString() + ' Cr' : ''}</span>
              </label>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="7. Sensors" defaultOpen>
          <select className="input w-full" value={sensors} onChange={(e) => setSensors(e.target.value)}>
            <option value="">None</option>
            {sensorList.map((s: Record<string, unknown>, i: number) => (
              <option key={i} value={String(s['System'] || s['Sensor Type'] || s['WEAPONS'])}>
                {String(s['System'] || s['Sensor Type'] || s['WEAPONS'])} — {String(s['DM'] || s['TL'])}
              </option>
            ))}
          </select>
        </CollapsibleSection>

        <CollapsibleSection title="8. Life Support" defaultOpen>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Staterooms</label>
              <input className="input w-full" type="number" min={0} value={staterooms} onChange={(e) => setStaterooms(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Low Berths</label>
              <input className="input w-full" type="number" min={0} value={lowBerths} onChange={(e) => setLowBerths(Number(e.target.value))} />
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="9. Modules" defaultOpen>
          <div className="grid grid-cols-2 gap-2">
            {modules.map((mod: Record<string, unknown>, i: number) => {
              const modName = String(mod['Module'] || mod['WEAPONS'] || '');
              const selected = selectedModules.find(m => m.id === modName);
              return (
                <div key={i} className="flex items-center gap-2 p-2 rounded hover:bg-slate-800">
                  <input
                    type="checkbox"
                    checked={!!selected}
                    onChange={() => toggleModule(modName)}
                    className="rounded border-slate-600"
                  />
                  <span className="text-sm flex-1">{modName}</span>
                  {selected && (
                    <input
                      type="number"
                      min={1}
                      value={selected.qty}
                      onChange={(e) => updateModuleQty(modName, Number(e.target.value))}
                      className="input w-16 text-sm py-0.5"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="10. Weapons" defaultOpen>
          <div className="grid grid-cols-2 gap-2">
            {weapons.map((wpn: Record<string, unknown>, i: number) => {
              const wpnName = String(wpn['WEAPONS'] || '');
              const selected = selectedWeapons.find(w => w.id === wpnName);
              return (
                <div key={i} className="flex items-center gap-2 p-2 rounded hover:bg-slate-800">
                  <input
                    type="checkbox"
                    checked={!!selected}
                    onChange={() => toggleWeapon(wpnName)}
                    className="rounded border-slate-600"
                  />
                  <span className="text-sm flex-1">{wpnName}</span>
                  {selected && (
                    <input
                      type="number"
                      min={1}
                      value={selected.qty}
                      onChange={(e) => updateWeaponQty(wpnName, Number(e.target.value))}
                      className="input w-16 text-sm py-0.5"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="11. Cargo" defaultOpen>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Cargo (DT)</label>
            <input className="input w-full" type="number" min={0} value={cargo} onChange={(e) => setCargo(Number(e.target.value))} />
          </div>
        </CollapsibleSection>
      </div>

      <div className="space-y-4">
        <BOQView 
          components={components}
          totalCost={totalCost}
          hullDtons={hullDtons}
          usedTons={usedTons}
          availableDtons={availableDtons}
        />

        {hullDtons > 0 && (
          <div className="tile">
            <div className="tile-content">
              <MnemeCombatPanel ship={{
                id: 'preview', name, tl, hullCode, hullDtons, configuration: config,
                armor: armorType, mDrive, jDrive, powerPlant,
                bridge, computer, software: softwareList,
                sensors, staterooms, lowBerths,
                crew: [], modules: moduleComponents, weapons: weaponComponents,
                cargo, components, totalCost, availableDtons,
                createdAt: new Date().toISOString(),
              }} />
            </div>
          </div>
        )}

        {ships.length > 0 && (
          <div className="tile">
            <div className="tile-header">
              <span className="font-semibold">Ship Library</span>
            </div>
            <div className="tile-content space-y-2 max-h-64 overflow-y-auto">
              {ships.map((ship) => (
                <div key={ship.id} className="flex items-center justify-between p-2 bg-slate-800 rounded">
                  <button onClick={() => loadShip(ship)} className="text-left flex-1">
                    <div className="text-sm font-medium">{ship.name}</div>
                    <div className="text-xs text-slate-400">{ship.hullDtons}DT | TL{ship.tl} | {(ship.totalCost / 1e6).toFixed(1)} MCr</div>
                  </button>
                  <button onClick={() => deleteShip(ship.id)} className="p-1 hover:bg-red-900/30 rounded text-slate-500 hover:text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
