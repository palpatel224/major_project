import React from 'react';

export default function StudyInsights() {
  return (
    <div className="h-auto min-h-[200px] flex-1 bg-[var(--color-panel-bg)] p-6 overflow-y-auto custom-scrollbar">
      <h2 className="text-sm font-bold text-[var(--color-bright-text)] tracking-wider mb-6">Study insights</h2>
      
      <div className="flex space-x-6">
        <div className="w-64 shrink-0 space-y-4">
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border-light)] rounded-lg p-4">
            <h3 className="text-xs text-[var(--color-muted-text)] font-semibold uppercase tracking-wider mb-2">CURRENT SLICE</h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-[var(--color-bright-text)]">0.0</span>
              <span className="text-sm text-[var(--color-muted-text)]">mm²</span>
              <span className="text-[10px] bg-[var(--color-border-primary)] text-[var(--color-muted-text)] px-1.5 py-0.5 rounded ml-auto">No model</span>
            </div>
          </div>
          
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border-light)] rounded-lg p-4">
            <h3 className="text-xs text-[var(--color-muted-text)] font-semibold uppercase tracking-wider mb-2">VOLUME</h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-[var(--color-bright-text)]">0.00</span>
              <span className="text-sm text-[var(--color-muted-text)]">mm³</span>
            </div>
          </div>
          
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border-light)] rounded-lg p-4">
            <h3 className="text-xs text-[var(--color-muted-text)] font-semibold uppercase tracking-wider mb-2">MODEL CONFIDENCE</h3>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full border-4 border-[var(--color-border-primary)] border-t-[var(--color-muted-text)] flex items-center justify-center">
                <span className="text-xs font-bold text-[var(--color-muted-text)]">-%</span>
              </div>
              <span className="text-xs text-[var(--color-muted-text)]">Awaiting inference</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 bg-[var(--color-card-bg)] border border-[var(--color-border-light)] rounded-lg p-4 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs text-[var(--color-muted-text)] font-semibold uppercase tracking-wider">CYST AREA ACROSS SLICES</h3>
            <span className="text-[10px] bg-[var(--color-border-primary)] text-[var(--color-muted-text)] px-2 py-1 rounded">Placeholder</span>
          </div>
          <div className="flex-1 border border-dashed border-[var(--color-border-primary)] rounded flex items-center justify-center text-[var(--color-muted-text)] text-sm">
            Model output required for chart
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-3 bg-[var(--color-amber-accent)]/10 border border-[var(--color-amber-accent)]/20 rounded flex items-start space-x-3">
        <svg className="w-5 h-5 text-[var(--color-amber-accent)] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <h4 className="text-sm font-semibold text-[var(--color-amber-accent)]">Clinical review required</h4>
          <p className="text-xs text-[var(--color-amber-accent)]/80 mt-1">This is a viewer-only mode. Verify model output against the source OCT once a model is integrated.</p>
        </div>
      </div>
    </div>
  );
}
