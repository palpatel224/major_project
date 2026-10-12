export type LayoutMode = 'dual' | 'stacked' | 'single';

interface ViewerToolbarProps {
  linkedScroll: boolean;
  onToggleLinkedScroll: () => void;
  currentSlice: number;
  totalSlices: number;
  layoutMode?: LayoutMode;
  onChangeLayoutMode?: (mode: LayoutMode) => void;
  activeSingleView?: 'left' | 'right';
  onToggleSingleView?: (view: 'left' | 'right') => void;
  isInsightsOpen?: boolean;
  onToggleInsights?: () => void;
}

// WHY: The ViewerToolbar manages viewport configuration, display modes, and slice metadata.
// For responsive laptop compatibility:
// 1. Supports dual (side-by-side), stacked (vertical), and single viewport layouts so the
//    imaging workspace adapts seamlessly to any laptop screen aspect ratio (16:9, 16:10, 3:2, vertical).
// 2. Contains responsive controls that wrap gracefully and collapse onto mobile/tablet widths.
// 3. Includes an Insights tray toggle button so clinicians can maximize viewport height on 768p/800p displays.
export default function ViewerToolbar({
  linkedScroll,
  onToggleLinkedScroll,
  currentSlice,
  totalSlices,
  layoutMode = 'dual',
  onChangeLayoutMode,
  activeSingleView = 'left',
  onToggleSingleView,
  isInsightsOpen = true,
  onToggleInsights,
}: ViewerToolbarProps) {
  return (
    <div className="min-h-[44px] sm:h-[48px] bg-[var(--color-panel-bg)] border-b border-[var(--color-border-primary)] flex items-center justify-between px-2 sm:px-4 shrink-0 select-none overflow-x-auto custom-scrollbar gap-2 z-10">
      {/* Left: Workspace Mode Navigation Tabs */}
      <div className="flex space-x-2 sm:space-x-5 h-full shrink-0 overflow-x-auto">
        <button 
          className="h-full px-1.5 sm:px-2 border-b-2 border-[var(--color-primary-accent)] text-xs sm:text-sm text-[var(--color-primary-accent)] font-medium cursor-pointer"
        >
          Comparison
        </button>
        <button 
          className="h-full px-1.5 sm:px-2 border-b-2 border-transparent text-xs sm:text-sm text-[var(--color-muted-text)] hover:text-[var(--color-bright-text)] font-medium transition-colors cursor-pointer"
        >
          Metadata
        </button>
        <button 
          className="h-full px-1.5 sm:px-2 border-b-2 border-transparent text-xs sm:text-sm text-[var(--color-muted-text)] hover:text-[var(--color-bright-text)] font-medium transition-colors cursor-pointer"
        >
          Measurements
        </button>
        <button 
          className="h-full px-1.5 sm:px-2 border-b-2 border-transparent text-xs sm:text-sm text-[var(--color-muted-text)] hover:text-[var(--color-bright-text)] font-medium transition-colors cursor-pointer hidden md:block"
        >
          Provenance
        </button>
      </div>

      {/* Right: Layout Switcher, Linked Scroll, Zoom Presets, and Slice Counter */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0 py-1">
        {/* Layout Switcher (Dual vs Stacked vs Single) */}
        {onChangeLayoutMode && (
          <div 
            className="flex bg-[var(--color-control-bg)] border border-[var(--color-border-light)] rounded p-0.5 text-xs"
            title="Switch viewport layout to adapt to your screen dimensions"
          >
            <button
              onClick={() => {
                console.debug('[ViewerToolbar] Switched layout mode to dual');
                onChangeLayoutMode('dual');
              }}
              title="Dual View (Side-by-Side)"
              className={`px-2 py-1 rounded transition-colors ${
                layoutMode === 'dual'
                  ? 'bg-[var(--color-primary-accent)] text-white font-medium'
                  : 'text-[var(--color-muted-text)] hover:text-[var(--color-bright-text)]'
              }`}
            >
              Side-by-side
            </button>
            <button
              onClick={() => {
                console.debug('[ViewerToolbar] Switched layout mode to stacked');
                onChangeLayoutMode('stacked');
              }}
              title="Stacked View (Top/Bottom)"
              className={`px-2 py-1 rounded transition-colors ${
                layoutMode === 'stacked'
                  ? 'bg-[var(--color-primary-accent)] text-white font-medium'
                  : 'text-[var(--color-muted-text)] hover:text-[var(--color-bright-text)]'
              }`}
            >
              Stacked
            </button>
            <button
              onClick={() => {
                console.debug('[ViewerToolbar] Switched layout mode to single');
                onChangeLayoutMode('single');
              }}
              title="Single View (Maximize active scan)"
              className={`px-2 py-1 rounded transition-colors ${
                layoutMode === 'single'
                  ? 'bg-[var(--color-primary-accent)] text-white font-medium'
                  : 'text-[var(--color-muted-text)] hover:text-[var(--color-bright-text)]'
              }`}
            >
              Single
            </button>
          </div>
        )}

        {/* If in Single Layout mode, show tab to choose between Original and Model Output */}
        {layoutMode === 'single' && onToggleSingleView && (
          <div className="flex bg-[var(--color-control-bg)] border border-[var(--color-border-light)] rounded p-0.5 text-xs">
            <button
              onClick={() => onToggleSingleView('left')}
              className={`px-2 py-1 rounded transition-colors ${
                activeSingleView === 'left'
                  ? 'bg-[var(--color-border-primary)] text-[var(--color-bright-text)] font-semibold'
                  : 'text-[var(--color-muted-text)]'
              }`}
            >
              Source
            </button>
            <button
              onClick={() => onToggleSingleView('right')}
              className={`px-2 py-1 rounded transition-colors ${
                activeSingleView === 'right'
                  ? 'bg-[var(--color-cyan-accent)]/20 text-[var(--color-cyan-accent)] font-semibold'
                  : 'text-[var(--color-muted-text)]'
              }`}
            >
              Model
            </button>
          </div>
        )}

        <div className="h-4 w-px bg-[var(--color-border-primary)] hidden sm:block"></div>

        {/* Linked Scroll Switch */}
        <label 
          className="flex items-center space-x-1.5 text-xs sm:text-sm text-[var(--color-bright-text)] cursor-pointer select-none"
          title="Synchronize slice scrolling across both viewports"
        >
          <input 
            type="checkbox" 
            checked={linkedScroll} 
            onChange={() => {
              console.debug('[ViewerToolbar] Toggled linked scroll:', !linkedScroll);
              onToggleLinkedScroll();
            }}
            className="rounded border-[var(--color-border-light)] bg-transparent text-[var(--color-primary-accent)]"
          />
          <span className="hidden sm:inline">Linked scroll</span>
          <span className="sm:hidden text-xs">Sync</span>
        </label>
        
        {/* Zoom Presets: Hidden on ultra narrow screens */}
        <div className="hidden lg:flex bg-[var(--color-control-bg)] border border-[var(--color-border-light)] rounded overflow-hidden text-xs">
          <button 
            onClick={() => console.debug('[ViewerToolbar] Fit zoom triggered')}
            className="px-2.5 py-1 text-[var(--color-muted-text)] hover:bg-[var(--color-border-primary)] hover:text-[var(--color-bright-text)] transition-colors border-r border-[var(--color-border-light)]"
          >
            Fit
          </button>
          <button 
            onClick={() => console.debug('[ViewerToolbar] 1:1 zoom triggered')}
            className="px-2.5 py-1 text-[var(--color-muted-text)] hover:bg-[var(--color-border-primary)] hover:text-[var(--color-bright-text)] transition-colors border-r border-[var(--color-border-light)]"
          >
            1:1
          </button>
          <button 
            onClick={() => console.debug('[ViewerToolbar] 100% zoom triggered')}
            className="px-2.5 py-1 text-[var(--color-muted-text)] hover:bg-[var(--color-border-primary)] hover:text-[var(--color-bright-text)] transition-colors"
          >
            100%
          </button>
        </div>

        {/* Slice Counter */}
        <div className="text-[11px] sm:text-xs font-mono text-[var(--color-muted-text)] bg-[var(--color-control-bg)] border border-[var(--color-border-light)] px-2 sm:px-2.5 py-1 rounded shrink-0 whitespace-nowrap">
          {totalSlices > 0 ? currentSlice + 1 : 0} / {totalSlices}
        </div>

        {/* Toggle Insights Tray */}
        {onToggleInsights && (
          <button
            onClick={() => {
              console.debug('[ViewerToolbar] Toggle insights tray, next state:', !isInsightsOpen);
              onToggleInsights();
            }}
            title={isInsightsOpen ? "Collapse Insights (maximize viewports)" : "Show Study Insights"}
            className={`p-1.5 rounded border transition-colors text-xs flex items-center space-x-1 ${
              isInsightsOpen 
                ? 'bg-[var(--color-control-bg)] border-[var(--color-border-light)] text-[var(--color-bright-text)]' 
                : 'bg-[var(--color-panel-bg)] border-[var(--color-border-primary)] text-[var(--color-muted-text)] hover:text-[var(--color-bright-text)]'
            }`}
          >
            <span className="hidden md:inline">Insights</span>
            <svg 
              className={`w-3.5 h-3.5 transition-transform ${isInsightsOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
