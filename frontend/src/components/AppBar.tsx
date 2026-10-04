import React from 'react';

interface AppBarProps {
  onOpenStudy: () => void;
  isLoading: boolean;
  progressText?: string;
  studyId?: string;
}

export default function AppBar({ onOpenStudy, isLoading, progressText, studyId }: AppBarProps) {
  return (
    <header className="h-16 bg-[var(--color-appbar-bg)] border-b border-[var(--color-border-primary)] flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-[var(--color-primary-accent)] rounded flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <div>
          <h1 className="text-sm font-semibold text-[var(--color-bright-text)] leading-tight">OCT Insight</h1>
          <p className="text-[10px] text-[var(--color-muted-text)] tracking-wider">v1.0.0</p>
        </div>
      </div>

      <div className="flex flex-col items-center">
        {studyId ? (
          <>
            <span className="text-[10px] font-bold text-[var(--color-muted-text)] tracking-wider uppercase">Current Case</span>
            <span className="text-sm text-[var(--color-bright-text)]">{studyId}</span>
          </>
        ) : (
          <span className="text-sm text-[var(--color-muted-text)]">No study loaded</span>
        )}
      </div>

      <div className="flex items-center space-x-3">
        {isLoading && (
          <span className="text-xs text-[var(--color-cyan-accent)] mr-4">{progressText}</span>
        )}
        <div className="flex items-center bg-[var(--color-control-bg)] px-2 py-1 rounded border border-[var(--color-border-light)] mr-4">
          <div className="w-2 h-2 rounded-full bg-[var(--color-cyan-accent)] mr-2"></div>
          <span className="text-xs text-[var(--color-cyan-accent)]">Offline · local</span>
        </div>
        <button className="bg-[var(--color-control-bg)] border border-[var(--color-border-light)] hover:bg-[var(--color-border-primary)] text-[var(--color-bright-text)] text-sm px-4 py-1.5 rounded transition-colors" disabled={isLoading}>
          Export
        </button>
        <button 
          onClick={onOpenStudy}
          disabled={isLoading}
          className="bg-[var(--color-primary-accent)] hover:bg-[#006bb3] text-white text-sm px-4 py-1.5 rounded transition-colors disabled:opacity-50"
        >
          Open study
        </button>
      </div>
    </header>
  );
}
