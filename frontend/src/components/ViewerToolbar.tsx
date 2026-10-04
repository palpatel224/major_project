import React from 'react';

interface ViewerToolbarProps {
  linkedScroll: boolean;
  onToggleLinkedScroll: () => void;
  currentSlice: number;
  totalSlices: number;
}

export default function ViewerToolbar({ linkedScroll, onToggleLinkedScroll, currentSlice, totalSlices }: ViewerToolbarProps) {
  return (
    <div className="h-[52px] bg-[var(--color-panel-bg)] border-b border-[var(--color-border-primary)] flex items-center justify-between px-4 shrink-0">
      <div className="flex space-x-6 h-full">
        <button className="h-full px-2 border-b-2 border-[var(--color-primary-accent)] text-sm text-[var(--color-primary-accent)] font-medium">Comparison</button>
        <button className="h-full px-2 border-b-2 border-transparent text-sm text-[var(--color-muted-text)] hover:text-[var(--color-bright-text)] font-medium transition-colors">Metadata</button>
        <button className="h-full px-2 border-b-2 border-transparent text-sm text-[var(--color-muted-text)] hover:text-[var(--color-bright-text)] font-medium transition-colors">Measurements</button>
        <button className="h-full px-2 border-b-2 border-transparent text-sm text-[var(--color-muted-text)] hover:text-[var(--color-bright-text)] font-medium transition-colors">Provenance</button>
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2 text-sm text-[var(--color-bright-text)] cursor-pointer">
          <input 
            type="checkbox" 
            checked={linkedScroll} 
            onChange={onToggleLinkedScroll}
            className="rounded border-[var(--color-border-light)] bg-transparent"
          />
          <span>Linked scroll</span>
        </label>
        
        <div className="h-6 w-px bg-[var(--color-border-primary)]"></div>
        
        <div className="flex bg-[var(--color-control-bg)] border border-[var(--color-border-light)] rounded overflow-hidden text-xs">
          <button className="px-3 py-1 text-[var(--color-muted-text)] hover:bg-[var(--color-border-primary)] hover:text-[var(--color-bright-text)] transition-colors border-r border-[var(--color-border-light)]">Fit</button>
          <button className="px-3 py-1 text-[var(--color-muted-text)] hover:bg-[var(--color-border-primary)] hover:text-[var(--color-bright-text)] transition-colors border-r border-[var(--color-border-light)]">1:1</button>
          <button className="px-3 py-1 text-[var(--color-muted-text)] hover:bg-[var(--color-border-primary)] hover:text-[var(--color-bright-text)] transition-colors">100%</button>
        </div>

        <div className="text-xs font-mono text-[var(--color-muted-text)] bg-[var(--color-control-bg)] border border-[var(--color-border-light)] px-3 py-1.5 rounded">
          SLICE {totalSlices > 0 ? currentSlice + 1 : 0} / {totalSlices}
        </div>
      </div>
    </div>
  );
}
