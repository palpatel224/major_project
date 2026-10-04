import React from 'react';
import { StudyManifest } from '../hooks/useStudyLoader';

interface StatusBarProps {
  manifest: StudyManifest | null;
  currentSlice: number;
}

export default function StatusBar({ manifest, currentSlice }: StatusBarProps) {
  return (
    <footer className="h-6 bg-[var(--color-status-bar)] flex items-center justify-between px-4 shrink-0 text-xs text-white/90 font-mono">
      <div className="flex space-x-6">
        <span className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-[var(--color-cyan-accent)] mr-2"></span>
          Offline · Local
        </span>
        {manifest && (
          <>
            <span>Study: {manifest.studyId.substring(0, 8)}...</span>
            <span>Lat: {manifest.laterality}</span>
          </>
        )}
      </div>
      
      <div className="flex-1 text-center">
        {manifest ? `Slice ${currentSlice + 1} / ${manifest.sliceCount}` : 'No slices'}
      </div>

      <div className="flex space-x-6">
        <span>Viewer Mode (No Model)</span>
        <span>GPU: Ready</span>
      </div>
    </footer>
  );
}
