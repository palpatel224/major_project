import React from 'react';

interface SliceScrubberProps {
  currentSlice: number;
  totalSlices: number;
  onSliceChange: (index: number) => void;
}

export default function SliceScrubber({ currentSlice, totalSlices, onSliceChange }: SliceScrubberProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSliceChange(parseInt(e.target.value, 10));
  };

  return (
    <div className="h-10 bg-[var(--color-panel-bg)] flex items-center px-6 shrink-0 relative">
      <div className="w-full flex items-center">
        <input 
          type="range" 
          className="custom-slider w-full" 
          min="0" 
          max={totalSlices > 0 ? totalSlices - 1 : 0} 
          value={currentSlice} 
          onChange={handleChange}
          disabled={totalSlices === 0}
        />
      </div>
      {/* Optional: Add a small floating tooltip or thumb label if needed, 
          but standard HTML range doesn't support it natively without extra JS logic. */}
    </div>
  );
}
