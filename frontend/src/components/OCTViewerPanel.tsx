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

// WHY: OCTViewerPanel provides an isolated frame for a single medical volume viewport.
// For responsive laptop compatibility:
// 1. Specifies min-w-0 and min-h-0 so CSS Flexbox/Grid algorithms can shrink the panel
//    down without triggering parent container overflow when laptop windows are small.
// 2. Contains adaptive overlays that scale cleanly down to mobile/split-screen dimensions.
// 3. Houses the CornerstoneViewport canvas within an overflow-hidden boundary.
export default function OCTViewerPanel({
  title,
  titleColor,
  badge,
  currentSlice,
  totalSlices,
  manifest,
  viewportId,
}: OCTViewerPanelProps) {
  const isCyan = titleColor === 'cyan';
  
  return (
    <div className="flex flex-col h-full min-h-0 min-w-0 bg-[var(--color-panel-bg)] rounded overflow-hidden border border-[var(--color-border-light)] relative shadow-inner">
      {/* Viewport Header Bar */}
      <div className="h-8 sm:h-9 bg-[var(--color-control-bg)] border-b border-[var(--color-border-light)] flex items-center justify-between px-2.5 sm:px-3.5 shrink-0 select-none">
        <div className="flex items-center space-x-2 text-xs sm:text-sm font-semibold min-w-0">
          <div className={`w-2 h-2 rounded-full shrink-0 ${isCyan ? 'bg-[var(--color-cyan-accent)]' : 'bg-[var(--color-muted-text)]'}`}></div>
          <span className={`truncate ${isCyan ? 'text-[var(--color-cyan-accent)]' : 'text-[var(--color-bright-text)]'}`}>
            {title}
          </span>
          {badge && (
            <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-mono shrink-0 ${
              isCyan 
                ? 'bg-[var(--color-cyan-accent)]/20 text-[var(--color-cyan-accent)]' 
                : 'bg-[var(--color-border-primary)] text-[var(--color-muted-text)]'
            }`}>
              {badge}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3 text-[11px] text-[var(--color-muted-text)] font-mono shrink-0">
          {manifest && (
            <span className="hidden sm:inline bg-[var(--color-card-bg)] px-1.5 py-0.5 rounded border border-[var(--color-border-light)] text-[10px]">
              {manifest.width} × {manifest.height}
            </span>
          )}
          <button 
            className="hover:text-[var(--color-bright-text)] p-0.5 rounded hover:bg-[var(--color-border-primary)] transition-colors"
            title="Viewport settings"
            onClick={() => console.debug(`[OCTViewerPanel] Settings clicked for ${viewportId}`)}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Cornerstone Medical Canvas Viewport Area */}
      <div className="flex-1 min-h-0 min-w-0 relative bg-black/60 overflow-hidden flex items-center justify-center">
        {manifest ? (
          <CornerstoneViewport 
            viewportId={viewportId}
            sliceIndex={currentSlice}
            manifest={manifest}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[var(--color-muted-text)] text-xs sm:text-sm p-4 text-center">
            <svg className="w-8 h-8 mb-2 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Waiting for study...</span>
            <span className="text-[10px] text-[var(--color-muted-text)]/70 mt-1">Open a DICOM study folder to begin</span>
          </div>
        )}
        
        {/* Floating slice HUD overlay */}
        {manifest && (
          <div className="absolute top-2.5 left-2.5 bg-[var(--color-card-bg)]/85 backdrop-blur border border-[var(--color-border-light)]/60 rounded px-2 py-0.5 text-[9px] sm:text-[10px] font-mono text-[var(--color-bright-text)] shadow-sm pointer-events-none select-none">
            B-SCAN {currentSlice + 1} / {totalSlices}
          </div>
        )}
      </div>
      
      {/* Viewport Status Footer */}
      <div className="h-5 sm:h-6 bg-[var(--color-control-bg)] border-t border-[var(--color-border-light)] flex items-center px-2.5 sm:px-3 shrink-0 text-[9px] sm:text-[10px] text-[var(--color-muted-text)] space-x-2 sm:space-x-4 select-none overflow-hidden truncate">
        <span>W: Auto L: Auto</span>
        <span>Zoom: 1.0x</span>
        <span className="hidden sm:inline">Uncalibrated</span>
      </div>
    </div>
  );
}
