import React from 'react';
import { StudyManifest } from '../hooks/useStudyLoader';

interface StudySidebarProps {
  manifest: StudyManifest | null;
  onOpenStudy: () => void;
  currentSlice: number;
}

export default function StudySidebar({ manifest, onOpenStudy, currentSlice }: StudySidebarProps) {
  return (
    <aside className="w-[284px] bg-[var(--color-sidebar-bg)] border-r border-[var(--color-border-primary)] flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
      {/* STUDY Header */}
      <div className="p-4 border-b border-[var(--color-border-light)]">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xs font-bold text-[var(--color-muted-text)] tracking-wider">STUDY</h2>
          <button onClick={onOpenStudy} className="text-[var(--color-blue-text)] text-xs hover:underline" title="⌘O">
            Open image...
          </button>
        </div>
        
        {manifest ? (
          <div className="bg-[var(--color-card-bg)] rounded border border-[var(--color-border-light)] p-2">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-[var(--color-page-bg)] border border-[var(--color-border-primary)] rounded mr-2 flex-shrink-0"></div>
              <div>
                <p className="text-xs text-[var(--color-bright-text)] font-semibold truncate">Series 1: OCT Macula</p>
                <p className="text-[10px] text-[var(--color-muted-text)]">{manifest.width} × {manifest.height} • {manifest.sliceCount} slices</p>
              </div>
            </div>
            <div className="mt-2 pl-12">
              <div className="bg-[var(--color-primary-accent)]/20 border border-[var(--color-primary-accent)] rounded px-2 py-1 flex justify-between items-center">
                <span className="text-[10px] text-[var(--color-bright-text)] truncate w-32">slice_{currentSlice.toString().padStart(3, '0')}.raw</span>
                <span className="text-[10px] text-[var(--color-primary-accent)] font-mono">{currentSlice + 1} / {manifest.sliceCount}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-[var(--color-muted-text)] text-center py-4">No study loaded</div>
        )}
      </div>

      {/* IMAGE CONTROLS */}
      <div className="p-4 border-b border-[var(--color-border-light)]">
        <h2 className="text-xs font-bold text-[var(--color-muted-text)] tracking-wider mb-4">IMAGE CONTROLS</h2>
        
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-[var(--color-muted-text)] mb-1">Display mode</label>
            <select className="w-full bg-[var(--color-control-bg)] border border-[var(--color-border-light)] rounded px-2 py-1.5 text-[var(--color-bright-text)]">
              <option>Grayscale</option>
            </select>
          </div>

          <div>
            <label className="block text-[var(--color-muted-text)] mb-1">Model (Disabled in viewer)</label>
            <select disabled className="w-full bg-[var(--color-control-bg)] border border-[var(--color-border-light)] rounded px-2 py-1.5 text-[var(--color-muted-text)] opacity-50 cursor-not-allowed">
              <option>None</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-[var(--color-muted-text)] mb-1">
              <label>Window level</label>
              <span>Auto</span>
            </div>
            <input type="range" className="custom-slider" min="0" max="100" defaultValue="50" />
          </div>

          <div>
            <label className="block text-[var(--color-muted-text)] mb-2">Overlays (Visual only)</label>
            <div className="space-y-1.5">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded border-[var(--color-border-light)] bg-transparent" />
                <span className="text-[var(--color-bright-text)]">Cyst mask</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded border-[var(--color-border-light)] bg-transparent" />
                <span className="text-[var(--color-bright-text)]">ILM boundary</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded border-[var(--color-border-light)] bg-transparent" />
                <span className="text-[var(--color-bright-text)]">Probability map</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[var(--color-muted-text)] mb-1">Mask opacity</label>
            <input type="range" className="custom-slider" min="0" max="100" defaultValue="50" />
          </div>
          
          <div className="pt-2">
            <button className="w-full bg-[var(--color-control-bg)] hover:bg-[var(--color-border-primary)] border border-[var(--color-border-light)] text-[var(--color-bright-text)] py-1.5 rounded transition-colors mb-2">
              Reset view
            </button>
            <button disabled className="w-full bg-[var(--color-primary-accent)]/50 text-white/50 py-1.5 rounded cursor-not-allowed">
              Run model
            </button>
          </div>
        </div>
      </div>
      
      {/* METADATA */}
      <div className="p-4">
        <h2 className="text-xs font-bold text-[var(--color-muted-text)] tracking-wider mb-2">METADATA</h2>
        <div className="text-[10px] space-y-1 font-mono text-[var(--color-muted-text)]">
          {manifest ? (
            <>
              <div className="flex justify-between"><span>Study Date</span><span>{manifest.studyDate}</span></div>
              <div className="flex justify-between"><span>Laterality</span><span>{manifest.laterality}</span></div>
              <div className="flex justify-between"><span>Spacing</span><span>{manifest.pixelSpacing.join(' x ')}</span></div>
              <div className="flex justify-between"><span>Bit Depth</span><span>{manifest.bitDepth}-bit</span></div>
            </>
          ) : (
            <div>No metadata available</div>
          )}
        </div>
      </div>
    </aside>
  );
}
