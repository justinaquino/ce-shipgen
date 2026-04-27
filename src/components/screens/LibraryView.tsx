import { ArrowLeft, Search, Download, Upload } from 'lucide-react'

interface LibraryViewProps {
  onBack: () => void
  onLoad: () => void
}

export default function LibraryView({ onBack, onLoad }: LibraryViewProps) {
  return (
    <div className="h-full flex flex-col bg-space-900">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-space-700 bg-space-800">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <h2 className="text-xl font-semibold text-white">Ship Library</h2>
      </div>

      {/* Search & Actions */}
      <div className="p-4 border-b border-space-700 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text"
            placeholder="Search ships..."
            className="w-full pl-10 pr-4 py-2 bg-space-700 border border-space-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-cyan"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-space-700 hover:bg-space-600 rounded-lg transition-colors">
          <Upload size={18} />
          <span className="hidden sm:inline">Import</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-accent-cyan hover:bg-cyan-400 text-space-900 font-medium rounded-lg transition-colors">
          <Download size={18} />
          <span className="hidden sm:inline">Export All</span>
        </button>
      </div>

      {/* Ship List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          {/* Empty State */}
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-space-700 rounded-full">
              <Search size={32} className="text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">No ships yet</h3>
            <p className="text-gray-500 mb-4">Create your first ship to see it here</p>
            <button 
              onClick={onLoad}
              className="btn-primary"
            >
              Generate Ship
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
