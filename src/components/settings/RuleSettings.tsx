import { useState, useEffect } from 'react'
import { BookOpen, Shield, Zap, Settings2, Check } from 'lucide-react'

interface RuleSettingsProps {
  onRulesChange?: (rules: RuleSet) => void
}

export interface RuleSet {
  ruleSet: 'cepheus' | 'mneme' | 'custom'
  bridgeCalculation: 'ce_fixed' | 'mneme_per_dton'
  lifePods: 'ce_standard' | 'mneme_1t_per_3'
  navCommSkill: 'ce_electronics' | 'mneme_comms'
  useSuperiority: boolean
  onlyPlayersRoll: boolean
  useMAC: boolean
  customRules: string[]
}

const DEFAULT_RULES: RuleSet = {
  ruleSet: 'cepheus',
  bridgeCalculation: 'ce_fixed',
  lifePods: 'ce_standard',
  navCommSkill: 'ce_electronics',
  useSuperiority: false,
  onlyPlayersRoll: false,
  useMAC: false,
  customRules: []
}

const MNEME_RULES: RuleSet = {
  ruleSet: 'mneme',
  bridgeCalculation: 'mneme_per_dton',
  lifePods: 'mneme_1t_per_3',
  navCommSkill: 'mneme_comms',
  useSuperiority: true,
  onlyPlayersRoll: true,
  useMAC: true,
  customRules: []
}

export default function RuleSettings({ onRulesChange }: RuleSettingsProps) {
  const [rules, setRules] = useState<RuleSet>(DEFAULT_RULES)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('ce_shipgen_rules')
    if (saved) {
      try {
        setRules(JSON.parse(saved))
      } catch (e) {
        console.error('Error loading rules:', e)
      }
    }
  }, [])

  const handleRuleSetChange = (ruleSet: 'cepheus' | 'mneme' | 'custom') => {
    let newRules: RuleSet
    
    if (ruleSet === 'cepheus') {
      newRules = DEFAULT_RULES
    } else if (ruleSet === 'mneme') {
      newRules = MNEME_RULES
    } else {
      newRules = { ...rules, ruleSet: 'custom' }
    }
    
    setRules(newRules)
    saveRules(newRules)
  }

  const handleToggleChange = (key: keyof RuleSet) => {
    const newRules: RuleSet = { 
      ...rules, 
      [key]: !rules[key as keyof RuleSet],
      ruleSet: 'custom'
    }
    setRules(newRules)
    saveRules(newRules)
  }

  const handleIndividualChange = (key: keyof RuleSet, value: any) => {
    const newRules: RuleSet = { 
      ...rules, 
      [key]: value,
      ruleSet: 'custom'
    }
    setRules(newRules)
    saveRules(newRules)
  }

  const saveRules = (newRules: RuleSet) => {
    localStorage.setItem('ce_shipgen_rules', JSON.stringify(newRules))
    onRulesChange?.(newRules)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="bg-space-800 rounded-xl border border-space-700 overflow-hidden">
      <div className="p-4 border-b border-space-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white">Rule Set</h3>
            <p className="text-sm text-gray-400">Choose which rule system to use</p>
          </div>
          {saved && (
            <span className="flex items-center gap-1 px-2 py-1 bg-accent-green/20 text-accent-green text-xs rounded-full">
              <Check size={14} />
              Saved
            </span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleRuleSetChange('cepheus')}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              rules.ruleSet === 'cepheus'
                ? 'border-accent-cyan bg-accent-cyan/10'
                : 'border-space-600 hover:border-space-500'
            }`}
          >
            <BookOpen className={`mb-2 ${rules.ruleSet === 'cepheus' ? 'text-accent-cyan' : 'text-gray-400'}`} size={24} />
            <div className={`font-medium ${rules.ruleSet === 'cepheus' ? 'text-accent-cyan' : 'text-gray-300'}`}>
              Cepheus Engine
            </div>
            <div className="text-xs text-gray-500 mt-1">Standard CE SRD rules</div>
          </button>

          <button
            onClick={() => handleRuleSetChange('mneme')}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              rules.ruleSet === 'mneme'
                ? 'border-accent-purple bg-accent-purple/10'
                : 'border-space-600 hover:border-space-500'
            }`}
          >
            <Shield className={`mb-2 ${rules.ruleSet === 'mneme' ? 'text-accent-purple' : 'text-gray-400'}`} size={24} />
            <div className={`font-medium ${rules.ruleSet === 'mneme' ? 'text-accent-purple' : 'text-gray-300'}`}>
              Mneme Space Combat
            </div>
            <div className="text-xs text-gray-500 mt-1">Justin Aquino variant</div>
          </button>

          <button
            onClick={() => handleRuleSetChange('custom')}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              rules.ruleSet === 'custom'
                ? 'border-accent-orange bg-accent-orange/10'
                : 'border-space-600 hover:border-space-500'
            }`}
          >
            <Settings2 className={`mb-2 ${rules.ruleSet === 'custom' ? 'text-accent-orange' : 'text-gray-400'}`} size={24} />
            <div className={`font-medium ${rules.ruleSet === 'custom' ? 'text-accent-orange' : 'text-gray-300'}`}>
              Custom
            </div>
            <div className="text-xs text-gray-500 mt-1">Mix and match rules</div>
          </button>
        </div>

        <div className="space-y-4 border-t border-space-700 pt-4">
          <h4 className="font-medium text-gray-300 flex items-center gap-2">
            <Zap size={18} className="text-accent-cyan" />
            Core Mechanics
          </h4>

          <div className="flex items-center justify-between p-3 bg-space-700/50 rounded-lg">
            <div>
              <div className="font-medium text-gray-200">Bridge Station Calculation</div>
              <div className="text-sm text-gray-500">
                {rules.bridgeCalculation === 'ce_fixed' 
                  ? 'Fixed sizes: 10t, 20t, 40t, 60t (CE)' 
                  : '1 station per Dton of bridge (Mneme)'}
              </div>
            </div>
            <select
              value={rules.bridgeCalculation}
              onChange={(e) => handleIndividualChange('bridgeCalculation', e.target.value)}
              className="dropdown bg-space-700 w-48"
            >
              <option value="ce_fixed">CE Fixed Sizes</option>
              <option value="mneme_per_dton">Mneme Per-Dton</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 bg-space-700/50 rounded-lg">
            <div>
              <div className="font-medium text-gray-200">Life Pod Capacity</div>
              <div className="text-sm text-gray-500">
                {rules.lifePods === 'ce_standard' 
                  ? '0.5 tons per passenger (CE)' 
                  : '1 ton per 3 adults (Mneme)'}
              </div>
            </div>
            <select
              value={rules.lifePods}
              onChange={(e) => handleIndividualChange('lifePods', e.target.value)}
              className="dropdown bg-space-700 w-48"
            >
              <option value="ce_standard">CE Standard (0.5t each)</option>
              <option value="mneme_1t_per_3">Mneme (1t per 3)</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 bg-space-700/50 rounded-lg">
            <div>
              <div className="font-medium text-gray-200">NavComm Operator Skill</div>
              <div className="text-sm text-gray-500">
                {rules.navCommSkill === 'ce_electronics' 
                  ? 'Uses Electronics skill (CE)' 
                  : 'Uses Comms skill (Mneme)'}
              </div>
            </div>
            <select
              value={rules.navCommSkill}
              onChange={(e) => handleIndividualChange('navCommSkill', e.target.value)}
              className="dropdown bg-space-700 w-48"
            >
              <option value="ce_electronics">CE: Electronics</option>
              <option value="mneme_comms">Mneme: Comms</option>
            </select>
          </div>
        </div>

        <div className="space-y-4 border-t border-space-700 pt-4">
          <h4 className="font-medium text-gray-300 flex items-center gap-2">
            <Shield size={18} className="text-accent-purple" />
            Mneme Space Combat (Optional)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="flex items-start gap-3 p-3 bg-space-700/50 rounded-lg cursor-pointer hover:bg-space-700 transition-colors">
              <input
                type="checkbox"
                checked={rules.useSuperiority}
                onChange={() => handleToggleChange('useSuperiority')}
                className="mt-1 w-4 h-4 rounded border-space-600 bg-space-600 text-accent-cyan focus:ring-accent-cyan"
              />
              <div>
                <div className="font-medium text-gray-200">Superiority System</div>
                <div className="text-xs text-gray-500">DM bonus based on relative force strength</div>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-space-700/50 rounded-lg cursor-pointer hover:bg-space-700 transition-colors">
              <input
                type="checkbox"
                checked={rules.onlyPlayersRoll}
                onChange={() => handleToggleChange('onlyPlayersRoll')}
                className="mt-1 w-4 h-4 rounded border-space-600 bg-space-600 text-accent-cyan focus:ring-accent-cyan"
              />
              <div>
                <div className="font-medium text-gray-200">Only Players Roll</div>
                <div className="text-xs text-gray-500">NPCs modify TN, players make all rolls</div>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-space-700/50 rounded-lg cursor-pointer hover:bg-space-700 transition-colors">
              <input
                type="checkbox"
                checked={rules.useMAC}
                onChange={() => handleToggleChange('useMAC')}
                className="mt-1 w-4 h-4 rounded border-space-600 bg-space-600 text-accent-cyan focus:ring-accent-cyan"
              />
              <div>
                <div className="font-medium text-gray-200">MAC System</div>
                <div className="text-xs text-gray-500">Multiple Attack Consolidation for grouped fire</div>
              </div>
            </label>
          </div>
        </div>

        <div className="p-3 bg-space-900/50 rounded-lg border border-space-700">
          <div className="text-sm text-gray-400 mb-2">Current Configuration:</div>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-space-700 rounded text-xs text-gray-300">
              Bridge: {rules.bridgeCalculation === 'ce_fixed' ? 'CE Fixed' : 'Mneme Per-Dton'}
            </span>
            <span className="px-2 py-1 bg-space-700 rounded text-xs text-gray-300">
              Life Pods: {rules.lifePods === 'ce_standard' ? 'CE' : 'Mneme'}
            </span>
            <span className="px-2 py-1 bg-space-700 rounded text-xs text-gray-300">
              NavComm: {rules.navCommSkill === 'ce_electronics' ? 'Electronics' : 'Comms'}
            </span>
            {rules.useSuperiority && (
              <span className="px-2 py-1 bg-accent-purple/20 text-accent-purple rounded text-xs">
                Superiority
              </span>
            )}
            {rules.onlyPlayersRoll && (
              <span className="px-2 py-1 bg-accent-purple/20 text-accent-purple rounded text-xs">
                Players Roll
              </span>
            )}
            {rules.useMAC && (
              <span className="px-2 py-1 bg-accent-purple/20 text-accent-purple rounded text-xs">
                MAC
              </span>
            )}
          </div>
        </div>

        <div className="text-xs text-gray-500 space-y-1 border-t border-space-700 pt-4">
          <p>• Cepheus Engine: Standard rules from the Cepheus Engine SRD</p>
          <p>• Mneme Space Combat: Justin Aquino's variant combat rules</p>
          <p>• Custom: Mix CE and Mneme rules to your preference</p>
          <p>• Settings are saved to browser storage automatically</p>
        </div>
      </div>
    </div>
  )
}
