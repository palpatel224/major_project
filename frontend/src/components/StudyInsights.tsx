interface StudyInsightsProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

// WHY: StudyInsights displays quantitative volumetric metrics, model confidence,
// and cross-slice trend distributions.
// For responsive laptop compatibility:
// 1. Implements a collapsible tray design: when collapsed, it consumes only ~34px height
//    while displaying a condensed summary, freeing up to 85% of screen height for B-scans.
// 2. Uses a responsive flex/grid structure that seamlessly reorganizes metric cards
//    across single-column (small screens), multi-column (tablets/laptops), and wide layouts.
// 3. Constrains max-height when expanded to prevent pushing the Cornerstone canvases off-screen.
export default function StudyInsights({
  isOpen = true,
  onToggle,
}: StudyInsightsProps) {
  return (
    <section 
      className="bg-[var(--color-panel-bg)] border-t border-[var(--color-border-primary)] shrink-0 transition-all duration-200 select-none z-10"
      aria-label="Quantitative Insights and Model Findings"
    >
      {/* Collapsible Header Strip */}
      <div 
        onClick={() => {
          if (onToggle) {
            console.debug('[StudyInsights] Tray header clicked, toggling open state');
            onToggle();
          }
        }}
        className="h-8 sm:h-9 px-3 sm:px-4 flex items-center justify-between cursor-pointer hover:bg-[var(--color-card-bg)] transition-colors text-xs"
      >
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <svg 
            className={`w-3.5 h-3.5 text-[var(--color-muted-text)] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <h2 className="text-xs font-bold text-[var(--color-bright-text)] tracking-wider uppercase shrink-0">
            Study Insights
          </h2>

          {/* Quick summary strip visible when collapsed or on wide screens */}
          <div className="flex items-center space-x-2 sm:space-x-3 text-[11px] text-[var(--color-muted-text)] truncate">
            <span className="hidden sm:inline">•</span>
            <span className="font-mono">
              Slice: <strong className="text-[var(--color-bright-text)]">0.0</strong> mm²
            </span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline font-mono">
              Vol: <strong className="text-[var(--color-bright-text)]">0.00</strong> mm³
            </span>
            <span className="hidden lg:inline">•</span>
            <span className="hidden lg:inline text-[var(--color-muted-text)]">
              Model: Awaiting inference
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-[10px] text-[var(--color-muted-text)]">
            {isOpen ? 'Click to minimize' : 'Click to expand'}
          </span>
        </div>
      </div>

      {/* Expanded Content Drawer */}
      {isOpen && (
        <div className="p-3 sm:p-5 max-h-[220px] sm:max-h-[260px] lg:max-h-[300px] overflow-y-auto custom-scrollbar border-t border-[var(--color-border-light)]/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Metric 1: Current Slice Area */}
            <div className="bg-[var(--color-card-bg)] border border-[var(--color-border-light)] rounded-lg p-3 sm:p-3.5 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-1.5">
                <h3 className="text-[10px] sm:text-[11px] text-[var(--color-muted-text)] font-semibold uppercase tracking-wider">
                  CURRENT SLICE AREA
                </h3>
                <span className="text-[9px] bg-[var(--color-border-primary)] text-[var(--color-muted-text)] px-1.5 py-0.5 rounded">
                  No model
                </span>
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-xl sm:text-2xl font-bold text-[var(--color-bright-text)]">0.0</span>
                <span className="text-xs text-[var(--color-muted-text)]">mm²</span>
              </div>
              <p className="text-[10px] text-[var(--color-muted-text)]/70 mt-1">Cystic lesion area in active B-scan</p>
            </div>
            
            {/* Metric 2: Estimated Volume */}
            <div className="bg-[var(--color-card-bg)] border border-[var(--color-border-light)] rounded-lg p-3 sm:p-3.5 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-1.5">
                <h3 className="text-[10px] sm:text-[11px] text-[var(--color-muted-text)] font-semibold uppercase tracking-wider">
                  AGGREGATE VOLUME
                </h3>
                <span className="text-[9px] bg-[var(--color-border-primary)] text-[var(--color-muted-text)] px-1.5 py-0.5 rounded">
                  Estimated
                </span>
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-xl sm:text-2xl font-bold text-[var(--color-bright-text)]">0.00</span>
                <span className="text-xs text-[var(--color-muted-text)]">mm³</span>
              </div>
              <p className="text-[10px] text-[var(--color-muted-text)]/70 mt-1">Total volume integrated over slice spacing</p>
            </div>
            
            {/* Metric 3: Model Confidence */}
            <div className="bg-[var(--color-card-bg)] border border-[var(--color-border-light)] rounded-lg p-3 sm:p-3.5 flex flex-col justify-between">
              <h3 className="text-[10px] sm:text-[11px] text-[var(--color-muted-text)] font-semibold uppercase tracking-wider mb-1.5">
                MODEL CONFIDENCE
              </h3>
              <div className="flex items-center space-x-3 my-auto">
                <div className="w-9 h-9 rounded-full border-2 border-[var(--color-border-primary)] border-t-[var(--color-muted-text)] flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-[var(--color-muted-text)]">-%</span>
                </div>
                <div className="text-[11px] text-[var(--color-muted-text)]">
                  <div>Awaiting inference</div>
                  <div className="text-[9px] text-[var(--color-muted-text)]/60">Local PyTorch sidecar</div>
                </div>
              </div>
            </div>

            {/* Metric 4: Distribution Across Slices Chart Placeholder */}
            <div className="bg-[var(--color-card-bg)] border border-[var(--color-border-light)] rounded-lg p-3 sm:p-3.5 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-1.5">
                <h3 className="text-[10px] sm:text-[11px] text-[var(--color-muted-text)] font-semibold uppercase tracking-wider">
                  CYST AREA DISTRIBUTION
                </h3>
                <span className="text-[9px] bg-[var(--color-border-primary)] text-[var(--color-muted-text)] px-1.5 py-0.5 rounded">
                  Plot
                </span>
              </div>
              <div className="h-14 border border-dashed border-[var(--color-border-primary)] rounded flex items-center justify-center text-[var(--color-muted-text)] text-[11px] bg-[var(--color-page-bg)]/30">
                Awaiting Model Output
              </div>
            </div>
          </div>
          
          {/* Clinical Safety Alert Banner */}
          <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-[var(--color-amber-accent)]/10 border border-[var(--color-amber-accent)]/20 rounded flex items-start space-x-2.5">
            <svg className="w-4 h-4 text-[var(--color-amber-accent)] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="min-w-0">
              <h4 className="text-xs font-semibold text-[var(--color-amber-accent)]">Clinical Review Required</h4>
              <p className="text-[10px] sm:text-[11px] text-[var(--color-amber-accent)]/85 mt-0.5 leading-snug">
                This is a clinical review and research viewer. Always verify model-derived boundaries against source DICOM b-scans prior to diagnostic decisions.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
