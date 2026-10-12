import { StudyManifest } from '../hooks/useStudyLoader';

interface StudySidebarProps {
  manifest: StudyManifest | null;
  onOpenStudy: () => void;
  currentSlice: number;
  isOpen?: boolean;
  onToggle?: () => void;
}

// WHY: The StudySidebar provides DICOM series navigation, image control adjustments,
// and volumetric metadata inspection.
// For responsive laptop compatibility:
// 1. Can be collapsed completely to liberate horizontal width for the dual OCT b-scan viewports.
// 2. Contains an explicit collapse handle so clinicians can toggle it with a single click.
// 3. Implements smooth flex width transitions and custom scrollbars to prevent horizontal clipping.
export default function StudySidebar({
  manifest,
  onOpenStudy,
  currentSlice,
  isOpen = true,
  onToggle,
}: StudySidebarProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <aside 
      className="w-64 sm:w-72 lg:w-[284px] bg-[var(--color-sidebar-bg)] border-r border-[var(--color-border-primary)] flex flex-col shrink-0 overflow-y-auto custom-scrollbar select-none transition-all duration-200 z-10"
      aria-label="Study & Image Controls Panel"
    >
      {/* STUDY Header */}
      <div className="p-3 sm:p-4 border-b border-[var(--color-border-light)]">
        <div className="flex justify-between items-center mb-2.5">
          <div className="flex items-center space-x-2">
            <h2 className="text-[11px] sm:text-xs font-bold text-[var(--color-muted-text)] tracking-wider">
              STUDY NAVIGATOR
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => {
                console.debug('[StudySidebar] Open image triggered');
                onOpenStudy();
              }} 
              className="text-[var(--color-blue-text)] text-xs hover:underline cursor-pointer" 
              title="Open study folder"
            >
              Open...
            </button>
            {onToggle && (
              <button
                onClick={() => {
                  console.debug('[StudySidebar] Sidebar collapse button clicked');
                  onToggle();
                }}
                className="text-[var(--color-muted-text)] hover:text-[var(--color-bright-text)] p-1 rounded hover:bg-[var(--color-control-bg)] transition-colors"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {manifest ? (
          <div className="bg-[var(--color-card-bg)] rounded border border-[var(--color-border-light)] p-2.5 shadow-sm">
            <div className="flex items-center">
              <div className="w-9 h-9 bg-[var(--color-page-bg)] border border-[var(--color-border-primary)] rounded mr-2.5 flex-shrink-0 flex items-center justify-center text-[var(--color-muted-text)]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-[var(--color-bright-text)] font-semibold truncate" title="Series 1: OCT Macula">
                  Series 1: OCT Macula
                </p>
                <p className="text-[10px] text-[var(--color-muted-text)] truncate">
                  {manifest.width} × {manifest.height} • {manifest.sliceCount} slices
                </p>
              </div>
            </div>
            <div className="mt-2">
              <div className="bg-[var(--color-primary-accent)]/15 border border-[var(--color-primary-accent)]/50 rounded px-2 py-1 flex justify-between items-center text-[10px]">
                <span className="text-[var(--color-bright-text)] font-mono truncate">
                  slice_{(currentSlice + 1).toString().padStart(3, '0')}.raw
                </span>
                <span className="text-[var(--color-blue-text)] font-mono font-medium ml-2 shrink-0">
                  {currentSlice + 1} / {manifest.sliceCount}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-[var(--color-muted-text)] text-center py-4 bg-[var(--color-card-bg)]/40 rounded border border-dashed border-[var(--color-border-light)]">
            No study loaded
          </div>
        )}
      </div>

      {/* IMAGE CONTROLS */}
      <div className="p-3 sm:p-4 border-b border-[var(--color-border-light)]">
        <h2 className="text-[11px] sm:text-xs font-bold text-[var(--color-muted-text)] tracking-wider mb-3">
          IMAGE CONTROLS
        </h2>
        
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="block text-[var(--color-muted-text)] mb-1 text-[11px]">Display mode</label>
            <select 
              className="w-full bg-[var(--color-control-bg)] border border-[var(--color-border-light)] rounded px-2 py-1.5 text-[var(--color-bright-text)] text-xs focus:outline-none focus:border-[var(--color-primary-accent)]"
              defaultValue="Grayscale"
            >
              <option value="Grayscale">Grayscale (Standard)</option>
              <option value="Inverted">Inverted</option>
              <option value="FalseColor">False Color (Diagnostic)</option>
            </select>
          </div>

          <div>
            <label className="block text-[var(--color-muted-text)] mb-1 text-[11px]">
              Model (Inference pipeline)
            </label>
            <select 
              disabled 
              className="w-full bg-[var(--color-control-bg)] border border-[var(--color-border-light)] rounded px-2 py-1.5 text-[var(--color-muted-text)] text-xs opacity-60 cursor-not-allowed"
            >
              <option>No model loaded (Viewer Mode)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-[var(--color-muted-text)] mb-1 text-[11px]">
              <label>Window level</label>
              <span className="font-mono">Auto</span>
            </div>
            <input 
              type="range" 
              className="custom-slider" 
              min="0" 
              max="100" 
              defaultValue="50"
              onChange={(e) => console.debug('[StudySidebar] Window level changed:', e.target.value)} 
            />
          </div>

          <div>
            <label className="block text-[var(--color-muted-text)] mb-2 text-[11px]">
              Overlays (Visual preview)
            </label>
            <div className="space-y-1.5 bg-[var(--color-card-bg)] p-2 rounded border border-[var(--color-border-light)]/50">
              <label className="flex items-center space-x-2 cursor-pointer text-[11px]">
                <input type="checkbox" className="rounded border-[var(--color-border-light)] text-[var(--color-primary-accent)]" />
                <span className="text-[var(--color-bright-text)]">Cyst mask</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer text-[11px]">
                <input type="checkbox" className="rounded border-[var(--color-border-light)] text-[var(--color-primary-accent)]" />
                <span className="text-[var(--color-bright-text)]">ILM boundary</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer text-[11px]">
                <input type="checkbox" className="rounded border-[var(--color-border-light)] text-[var(--color-primary-accent)]" />
                <span className="text-[var(--color-bright-text)]">Probability heatmap</span>
              </label>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[var(--color-muted-text)] mb-1 text-[11px]">
              <label>Mask opacity</label>
              <span className="font-mono">50%</span>
            </div>
            <input 
              type="range" 
              className="custom-slider" 
              min="0" 
              max="100" 
              defaultValue="50" 
              onChange={(e) => console.debug('[StudySidebar] Mask opacity changed:', e.target.value)}
            />
          </div>
          
          <div className="pt-1 space-y-2">
            <button 
              onClick={() => console.debug('[StudySidebar] Reset view triggered')}
              className="w-full bg-[var(--color-control-bg)] hover:bg-[var(--color-border-primary)] border border-[var(--color-border-light)] text-[var(--color-bright-text)] py-1.5 rounded transition-colors text-xs font-medium"
            >
              Reset view
            </button>
            <button 
              disabled 
              className="w-full bg-[var(--color-primary-accent)]/40 text-white/40 py-1.5 rounded cursor-not-allowed text-xs font-medium"
              title="Machine learning inference will be enabled when a model is selected"
            >
              Run model
            </button>
          </div>
        </div>
      </div>
      
      {/* METADATA */}
      <div className="p-3 sm:p-4">
        <h2 className="text-[11px] sm:text-xs font-bold text-[var(--color-muted-text)] tracking-wider mb-2.5">
          STUDY METADATA
        </h2>
        <div className="text-[10px] space-y-1.5 font-mono text-[var(--color-muted-text)] bg-[var(--color-card-bg)] p-2.5 rounded border border-[var(--color-border-light)]">
          {manifest ? (
            <>
              <div className="flex justify-between border-b border-[var(--color-border-light)]/40 pb-1">
                <span>Study Date</span>
                <span className="text-[var(--color-bright-text)]">{manifest.studyDate}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--color-border-light)]/40 pb-1">
                <span>Laterality</span>
                <span className="text-[var(--color-bright-text)]">{manifest.laterality || 'Unspecified'}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--color-border-light)]/40 pb-1">
                <span>Pixel Spacing</span>
                <span className="text-[var(--color-bright-text)]">{manifest.pixelSpacing.join(' × ')} mm</span>
              </div>
              <div className="flex justify-between">
                <span>Bit Depth</span>
                <span className="text-[var(--color-bright-text)]">{manifest.bitDepth}-bit</span>
              </div>
            </>
          ) : (
            <div className="text-center py-1">No metadata loaded</div>
          )}
        </div>
      </div>
    </aside>
  );
}
