import type { ChangeEvent } from 'react';

interface SliceScrubberProps {
  currentSlice: number;
  totalSlices: number;
  onSliceChange: (index: number) => void;
  onPrevSlice?: () => void;
  onNextSlice?: () => void;
}

// WHY: SliceScrubber enables linear navigation through the 3D OCT volume.
// For responsive laptop compatibility:
// 1. Provides prev/next step buttons flanking the slider for precise single-slice stepping on trackpads.
// 2. Uses flex styling with responsive padding so it remains ergonomic across all screen widths.
// 3. Includes keyboard / aria navigation accessibility for clinical efficiency.
export default function SliceScrubber({
  currentSlice,
  totalSlices,
  onSliceChange,
  onPrevSlice,
  onNextSlice,
}: SliceScrubberProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    console.debug(`[SliceScrubber] Slider changed to slice ${val}`);
    onSliceChange(val);
  };

  const isFirst = currentSlice <= 0;
  const isLast = totalSlices <= 0 || currentSlice >= totalSlices - 1;

  return (
    <div className="h-9 sm:h-10 bg-[var(--color-panel-bg)] border-t border-[var(--color-border-primary)] flex items-center px-2.5 sm:px-4 shrink-0 select-none space-x-2 z-10">
      {/* Prev Slice Button */}
      <button
        onClick={() => {
          if (!isFirst && onPrevSlice) {
            console.debug('[SliceScrubber] Prev slice button clicked');
            onPrevSlice();
          } else if (!isFirst) {
            onSliceChange(currentSlice - 1);
          }
        }}
        disabled={isFirst || totalSlices === 0}
        className="p-1 rounded text-[var(--color-muted-text)] hover:text-[var(--color-bright-text)] hover:bg-[var(--color-control-bg)] disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed shrink-0"
        title="Previous slice (Left / Down Arrow)"
        aria-label="Previous slice"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Slider Track */}
      <div className="flex-1 flex items-center min-w-0">
        <input 
          type="range" 
          className="custom-slider w-full cursor-pointer disabled:cursor-not-allowed" 
          min="0" 
          max={totalSlices > 0 ? totalSlices - 1 : 0} 
          value={totalSlices > 0 ? currentSlice : 0} 
          onChange={handleChange}
          disabled={totalSlices === 0}
          aria-label="Volume slice scrubber"
        />
      </div>

      {/* Next Slice Button */}
      <button
        onClick={() => {
          if (!isLast && onNextSlice) {
            console.debug('[SliceScrubber] Next slice button clicked');
            onNextSlice();
          } else if (!isLast) {
            onSliceChange(currentSlice + 1);
          }
        }}
        disabled={isLast || totalSlices === 0}
        className="p-1 rounded text-[var(--color-muted-text)] hover:text-[var(--color-bright-text)] hover:bg-[var(--color-control-bg)] disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed shrink-0"
        title="Next slice (Right / Up Arrow)"
        aria-label="Next slice"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slice readout */}
      <div className="text-[10px] sm:text-xs font-mono text-[var(--color-bright-text)] shrink-0 min-w-[55px] text-right">
        {totalSlices > 0 ? `${currentSlice + 1} / ${totalSlices}` : '0 / 0'}
      </div>
    </div>
  );
}
