import { useState } from 'react'
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Check, AlertCircle } from 'lucide-react'

interface ShipDesignViewProps {
  layoutMode: 'desktop' | 'phone'
}

type TileStatus = 'inactive' | 'active' | 'focused' | 'completed' | 'invalid'

interface Tile {
  id: string
  stepNumber: number
  title: string
  status: TileStatus
  content: React.ReactNode
}

// Demo tiles for testing layout
const demoTiles: Tile[] = [
  { id: 'hull', stepNumber: 1, title: 'Step 1: Hull Selection', status: 'active', content: <div className="p-4">Hull selection content goes here</div> },
  { id: 'config', stepNumber: 2, title: 'Step 2: Configuration', status: 'inactive', content: <div className="p-4">Configuration content goes here</div> },
  { id: 'armor', stepNumber: 3, title: 'Step 3: Armor', status: 'inactive', content: <div className="p-4">Armor content goes here</div> },
  { id: 'drives', stepNumber: 4, title: 'Step 4: Drives', status: 'inactive', content: <div className="p-4">Drives content goes here</div> },
  { id: 'fuel', stepNumber: 5, title: 'Step 5: Fuel', status: 'inactive', content: <div className="p-4">Fuel content goes here</div> },
  { id: 'bridge', stepNumber: 6, title: 'Step 6: Bridge', status: 'inactive', content: <div className="p-4">Bridge content goes here</div> },
]

export default function ShipDesignView({ layoutMode }: ShipDesignViewProps) {
  const [tiles, setTiles] = useState<Tile[]>(demoTiles)
  const [focusedTileId, setFocusedTileId] = useState<string | null>(null)

  const handleTileClick = (tileId: string) => {
    if (focusedTileId === tileId) {
      // Already focused, unfocus it
      setFocusedTileId(null)
    } else {
      // Focus this tile
      setFocusedTileId(tileId)
      // Update status
      setTiles(prev => prev.map(t => ({
        ...t,
        status: t.id === tileId ? 'focused' : t.status === 'focused' ? 'active' : t.status
      })))
    }
  }

  const handleExitFocus = () => {
    setFocusedTileId(null)
    setTiles(prev => prev.map(t => ({
      ...t,
      status: t.status === 'focused' ? 'active' : t.status
    })))
  }

  // Handle ESC key to exit focus
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && focusedTileId) {
      handleExitFocus()
    }
  }

  const getStatusIcon = (status: TileStatus) => {
    switch (status) {
      case 'completed':
        return <Check size={16} className="text-accent-green" />
      case 'invalid':
        return <AlertCircle size={16} className="text-accent-red" />
      case 'focused':
        return <Maximize2 size={16} className="text-accent-cyan" />
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-gray-500" />
    }
  }

  const TileComponent = ({ tile, isFocused }: { tile: Tile; isFocused: boolean }) => {
    if (isFocused) {
      // Focused mode - full screen overlay
      return (
        <div className="fixed inset-4 z-50 bg-space-900 border-2 border-accent-cyan rounded-xl shadow-2xl flex flex-col animate-fade-in">
          {/* Focused Header */}
          <div className="flex items-center justify-between p-4 border-b border-space-700 bg-space-800 rounded-t-xl">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-accent-cyan text-space-900 font-bold rounded-full">
                {tile.stepNumber}
              </span>
              <h3 className="text-xl font-semibold text-white">{tile.title}</h3>
            </div>
            <button
              onClick={handleExitFocus}
              className="flex items-center gap-2 px-4 py-2 bg-space-700 hover:bg-space-600 rounded-lg transition-colors"
            >
              <Minimize2 size={18} />
              <span>Exit Focus (ESC)</span>
            </button>
          </div>
          
          {/* Focused Content */}
          <div className="flex-1 overflow-auto p-6">
            {tile.content}
          </div>
          
          {/* Focused Footer */}
          <div className="p-4 border-t border-space-700 flex justify-between items-center">
            <button className="btn-secondary">Previous</button>
            <button className="btn-primary">Mark Complete</button>
            <button className="btn-secondary">Next</button>
          </div>
        </div>
      )
    }

    // Normal tile
    const isCompact = tile.status === 'inactive' && !isFocused
    
    return (
      <div 
        onClick={() => handleTileClick(tile.id)}
        className={`tile cursor-pointer transition-all duration-300 ${
          tile.status === 'active' ? 'border-accent-cyan/50' : ''
        } ${tile.status === 'completed' ? 'border-accent-green/50' : ''} ${
          tile.status === 'invalid' ? 'border-accent-red/50' : ''
        } hover:border-accent-cyan/30`}
      >
        {/* Tile Header */}
        <div className={`flex items-center justify-between p-3 bg-space-700/50 ${
          isCompact ? '' : 'border-b border-space-600'
        }`}>
          <div className="flex items-center gap-3">
            <span className={`flex items-center justify-center w-7 h-7 font-bold rounded-full text-sm ${
              tile.status === 'completed' ? 'bg-accent-green text-space-900' :
              tile.status === 'active' ? 'bg-accent-cyan text-space-900' :
              tile.status === 'invalid' ? 'bg-accent-red text-white' :
              'bg-space-600 text-gray-400'
            }`}>
              {tile.stepNumber}
            </span>
            <span className={`font-medium ${
              tile.status === 'inactive' ? 'text-gray-400' : 'text-white'
            }`}>
              {tile.title}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(tile.status)}
            <Maximize2 size={16} className="text-gray-500" />
          </div>
        </div>

        {/* Tile Content - only show if not compact */}
        {!isCompact && (
          <div className="p-4">
            {tile.content}
          </div>
        )}
      </div>
    )
  }

  return (
    <div 
      className="h-full flex flex-col"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {layoutMode === 'desktop' ? (
        // Desktop Layout - Horizontal tiling
        <div className="h-full flex">
          {/* Left: Step Navigation (15%) */}
          <nav className="w-[15%] min-w-[200px] bg-space-800 border-r border-space-700 flex flex-col">
            <div className="p-4 border-b border-space-700">
              <h2 className="font-semibold text-gray-300">Steps</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {tiles.map(tile => (
                <button
                  key={tile.id}
                  onClick={() => handleTileClick(tile.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                    tile.status === 'focused' ? 'bg-accent-cyan/20 text-accent-cyan' :
                    tile.status === 'active' ? 'bg-space-700 text-white' :
                    tile.status === 'completed' ? 'text-accent-green' :
                    tile.status === 'invalid' ? 'text-accent-red' :
                    'text-gray-500 hover:bg-space-700/50'
                  }`}
                >
                  <span className={`w-5 h-5 flex items-center justify-center rounded text-xs font-bold ${
                    tile.status === 'completed' ? 'bg-accent-green text-space-900' :
                    tile.status === 'active' ? 'bg-accent-cyan text-space-900' :
                    tile.status === 'invalid' ? 'bg-accent-red text-white' :
                    'bg-space-600 text-gray-400'
                  }`}>
                    {tile.stepNumber}
                  </span>
                  <span className="truncate">{tile.title.replace('Step ' + tile.stepNumber + ': ', '')}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Center: Tile Container (55%) */}
          <main className="flex-1 overflow-y-auto p-4 bg-space-900">
            <div className="space-y-4 max-w-4xl mx-auto">
              {tiles.map(tile => (
                <TileComponent 
                  key={tile.id} 
                  tile={tile} 
                  isFocused={focusedTileId === tile.id}
                />
              ))}
            </div>
          </main>

          {/* Right: Summary Panel (30%) */}
          <aside className="w-[30%] min-w-[280px] bg-space-800 border-l border-space-700 p-4">
            <h2 className="font-semibold text-gray-300 mb-4">Ship Summary</h2>
            
            {/* Demo Summary Stats */}
            <div className="space-y-3">
              <div className="bg-space-700/50 rounded-lg p-3">
                <div className="text-sm text-gray-400">Tonnage</div>
                <div className="text-xl font-bold text-white">0 / 200 tons</div>
                <div className="mt-2 h-2 bg-space-600 rounded-full overflow-hidden">
                  <div className="h-full w-0 bg-accent-cyan rounded-full" />
                </div>
              </div>

              <div className="bg-space-700/50 rounded-lg p-3">
                <div className="text-sm text-gray-400">Total Cost</div>
                <div className="text-xl font-bold text-accent-gold">0.0 MCr</div>
              </div>

              <div className="bg-space-700/50 rounded-lg p-3">
                <div className="text-sm text-gray-400">Performance</div>
                <div className="text-lg font-semibold text-white">Jump-0 / Thrust-0</div>
              </div>
            </div>
          </aside>
        </div>
      ) : (
        // Phone Layout - Vertical tiling
        <div className="h-full flex flex-col">
          {/* Top: Sticky Summary Bar */}
          <div className="shrink-0 bg-space-800 border-b border-space-700 p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-400">Tonnage</div>
                <div className="text-sm font-bold text-white">0 / 200 t</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">Cost</div>
                <div className="text-sm font-bold text-accent-gold">0.0 MCr</div>
              </div>
            </div>
          </div>

          {/* Main: Vertical Scrolling Tiles */}
          <main className="flex-1 overflow-y-auto p-3 space-y-3 bg-space-900">
            {tiles.map(tile => (
              <TileComponent 
                key={tile.id} 
                tile={tile} 
                isFocused={focusedTileId === tile.id}
              />
            ))}
          </main>

          {/* Bottom: Compact Navigation */}
          <nav className="shrink-0 h-16 bg-space-800 border-t border-space-700 flex items-center justify-around px-2">
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <ChevronLeft size={24} />
            </button>
            <div className="text-sm text-gray-400">
              Step 1 of 19
            </div>
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <ChevronRight size={24} />
            </button>
          </nav>
        </div>
      )}

      {/* Focus Overlay Backdrop */}
      {focusedTileId && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={handleExitFocus}
        />
      )}
    </div>
  )
}
