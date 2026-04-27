import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface Props {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  badge?: string | number;
  actions?: ReactNode;
}

export function CollapsibleSection({ title, children, defaultOpen = false, badge, actions }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="tile mb-3">
      <div 
        className="tile-header"
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen(!open); }}
        role="button"
        tabIndex={0}
      >
        <div className="flex items-center gap-2">
          {open ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          <span className="font-semibold text-slate-200">{title}</span>
          {badge !== undefined && (
            <span className="text-xs bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded-full">{badge}</span>
          )}
        </div>
        {actions && <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>{actions}</div>}
      </div>
      {open && (
        <div className="tile-content">
          {children}
        </div>
      )}
    </div>
  );
}
