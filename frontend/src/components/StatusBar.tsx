import { StudyManifest } from '../hooks/useStudyLoader';

interface StatusBarProps {
  manifest: StudyManifest | null;
  currentSlice: number;
}

// WHY: StatusBar displays runtime telemetry, study identifiers, and hardware accelerator states.
// For responsive laptop compatibility:
// 1. Adapts spacing and conditionally displays peripheral metrics on small/split windows.
// 2. Uses single-line non-wrapping flex styling to prevent vertical layout jitter.
export default function StatusBar({ manifest, currentSlice }: StatusBarProps) {
  return (
    <footer 
      className="h-5 sm:h-6 bg-[var(--color-status-bar)] flex items-center justify-between px-2 sm:px-4 shrink-0 text-[10px] sm:text-xs text-white/95 font-mono select-none overflow-hidden z-20"
      aria-label="Application Status Bar"
    >
      {/* Left: Modality / Privacy / Case */}
      <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
        <span className="flex items-center shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-cyan-accent)] mr-1.5"></span>
          Offline · Local
        </span>
        {manifest && (
          <>
            <span className="hidden md:inline truncate max-w-[140px]" title={manifest.studyId}>
              Case: {manifest.studyId.substring(0, 10)}...
            </span>
            <span className="hidden sm:inline">Lat: {manifest.laterality || 'N/A'}</span>
          </>
        )}
      </div>
      
      {/* Center: Slice Progress */}
      <div className="text-center px-2 font-medium shrink-0">
        {manifest ? `Slice ${currentSlice + 1} of ${manifest.sliceCount}` : 'No Study'}
      </div>

      {/* Right: Runtime Hardware & Modality */}
      <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
        <span className="hidden sm:inline">Viewer Mode</span>
        <span className="bg-black/20 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px]">GPU: Ready</span>
      </div>
    </footer>
  );
}
