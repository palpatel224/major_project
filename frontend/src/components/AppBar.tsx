interface AppBarProps {
  onOpenStudy: () => void;
  isLoading: boolean;
  progressText?: string;
  studyId?: string;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

// WHY: The AppBar serves as the primary top-level control bar.
// On laptop screens and varying window sizes, this bar must remain responsive:
// 1. Provides a sidebar toggle button so clinicians can maximize viewport width on 13" laptops.
// 2. Uses flexible truncation and hidden-on-mobile metadata to avoid horizontal overflow.
// 3. Adapts button padding dynamically so essential actions are always within reach.
export default function AppBar({
  onOpenStudy,
  isLoading,
  progressText,
  studyId,
  isSidebarOpen = true,
  onToggleSidebar,
}: AppBarProps) {
  const handleOpenClick = () => {
    console.debug('[AppBar] User clicked Open Study');
    onOpenStudy();
  };

  const handleToggleSidebar = () => {
    console.debug('[AppBar] User clicked Toggle Sidebar, next state:', !isSidebarOpen);
    if (onToggleSidebar) onToggleSidebar();
  };

  return (
    <header className="h-14 sm:h-16 bg-[var(--color-appbar-bg)] border-b border-[var(--color-border-primary)] flex items-center justify-between px-2 sm:px-4 shrink-0 select-none z-20">
      {/* Left: Sidebar Toggle & Product Brand */}
      <div className="flex items-center min-w-0 space-x-2 sm:space-x-3">
        {onToggleSidebar && (
          <button
            onClick={handleToggleSidebar}
            title={isSidebarOpen ? "Collapse sidebar (maximize viewer)" : "Expand sidebar"}
            className="p-1.5 rounded text-[var(--color-muted-text)] hover:text-[var(--color-bright-text)] hover:bg-[var(--color-control-bg)] transition-colors focus:outline-none"
            aria-label="Toggle Sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isSidebarOpen ? (
                // Sidebar open icon (left panel visible)
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              ) : (
                // Sidebar closed icon (expand)
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        )}

        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[var(--color-primary-accent)] rounded flex items-center justify-center shrink-0 shadow-sm">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <div className="min-w-0">
          <h1 className="text-xs sm:text-sm font-semibold text-[var(--color-bright-text)] leading-tight truncate">
            OCT Insight
          </h1>
          <p className="text-[9px] sm:text-[10px] text-[var(--color-muted-text)] tracking-wider hidden xs:block">
            DESKTOP WORKSTATION
          </p>
        </div>
      </div>

      {/* Middle: Active Case / Study Identification (Gracefully truncated) */}
      <div className="hidden md:flex flex-col items-center px-2 max-w-[280px] lg:max-w-md min-w-0">
        {studyId ? (
          <>
            <span className="text-[9px] lg:text-[10px] font-bold text-[var(--color-muted-text)] tracking-wider uppercase">
              Current Case
            </span>
            <span className="text-xs lg:text-sm text-[var(--color-bright-text)] font-mono truncate max-w-full" title={studyId}>
              {studyId}
            </span>
          </>
        ) : (
          <span className="text-xs text-[var(--color-muted-text)]">No study loaded</span>
        )}
      </div>

      {/* Right: Status badge & Actions */}
      <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
        {isLoading && (
          <span className="text-[11px] sm:text-xs text-[var(--color-cyan-accent)] animate-pulse truncate max-w-[120px] sm:max-w-[200px]">
            {progressText}
          </span>
        )}

        {/* Offline Badge: Compact dot on small laptops, full text on larger */}
        <div 
          className="flex items-center bg-[var(--color-control-bg)] px-2 py-1 rounded border border-[var(--color-border-light)]"
          title="Running in 100% offline local privacy mode"
        >
          <div className="w-2 h-2 rounded-full bg-[var(--color-cyan-accent)] mr-1 sm:mr-1.5 shrink-0"></div>
          <span className="text-[10px] sm:text-xs text-[var(--color-cyan-accent)] hidden sm:inline whitespace-nowrap">
            Offline · local
          </span>
        </div>

        <button 
          className="bg-[var(--color-control-bg)] border border-[var(--color-border-light)] hover:bg-[var(--color-border-primary)] text-[var(--color-bright-text)] text-xs sm:text-sm px-2.5 sm:px-4 py-1 sm:py-1.5 rounded transition-colors disabled:opacity-40" 
          disabled={isLoading || !studyId}
          onClick={() => console.debug('[AppBar] User clicked Export')}
        >
          Export
        </button>

        <button 
          onClick={handleOpenClick}
          disabled={isLoading}
          className="bg-[var(--color-primary-accent)] hover:bg-[#006bb3] active:bg-[#00558f] text-white text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-1.5 rounded font-medium transition-colors disabled:opacity-50 whitespace-nowrap shadow-sm"
        >
          Open study
        </button>
      </div>
    </header>
  );
}
