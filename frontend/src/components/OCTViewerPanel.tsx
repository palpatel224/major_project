import React from 'react';
import CornerstoneViewport from './CornerstoneViewport';
import { StudyManifest } from '../hooks/useStudyLoader';

interface OCTViewerPanelProps {
  title: string;
  titleColor: 'neutral' | 'cyan';
  badge?: string;
  currentSlice: number;
  totalSlices: number;
  manifest: StudyManifest | null;
  viewportId: string;
}

export default function OCTViewerPanel({ title, titleColor, badge, currentSlice, totalSlices, manifest, viewportId }: OCTViewerPanelProps) {
  const isCyan = titleColor === 'cyan';
  
  return (
    <div className="flex flex-col h-full bg-[var(--color-panel-bg)] rounded overflow-hidden border border-[var(--color-border-light)] relative">
      <div className="h-10 bg-[var(--color-control-bg)] border-b border-[var(--color-border-light)] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center space-x-2 text-sm font-semibold">
          <div className={`w-2 h-2 rounded-full ${isCyan ? 'bg-[var(--color-cyan-accent)]' : 'bg-[var(--color-muted-text)]'}`}></div>
          <span className={isCyan ? 'text-[var(--color-cyan-accent)]' : 'text-[var(--color-bright-text)]'}>
            {title}
          </span>
          {badge && (
            <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${isCyan ? 'bg-[var(--color-cyan-accent)]/20 text-[var(--color-cyan-accent)]' : 'bg-[var(--color-border-primary)] text-[var(--color-muted-text)]'}`}>
              {badge}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-4 text-xs text-[var(--color-muted-text)] font-mono">
          {manifest && <span>{manifest.width} × {manifest.height}</span>}
          <button className="hover:text-[var(--color-bright-text)] p-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative bg-black/50 overflow-hidden">
        {manifest ? (
          <CornerstoneViewport 
            viewportId={viewportId}
            sliceIndex={currentSlice}
            manifest={manifest}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--color-muted-text)] text-sm">
            Waiting for study...
          </div>
        )}
        
        {manifest && (
          <div className="absolute top-4 left-4 bg-[var(--color-card-bg)]/80 backdrop-blur border border-[var(--color-border-light)]/50 rounded px-2 py-1 text-[10px] font-mono text-[var(--color-bright-text)] shadow-sm pointer-events-none">
            B-SCAN {currentSlice + 1} / {totalSlices}
          </div>
        )}
      </div>
      
      <div className="h-6 bg-[var(--color-control-bg)] border-t border-[var(--color-border-light)] flex items-center px-4 shrink-0 text-[10px] text-[var(--color-muted-text)] space-x-4">
        <span>W: Auto L: Auto</span>
        <span>Zoom: 1.0x</span>
        <span>Uncalibrated</span>
      </div>
    </div>
  );
}
