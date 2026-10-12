import { useState, useEffect, useCallback } from 'react';
import type { WheelEvent } from 'react';
import AppBar from './components/AppBar';
import StudySidebar from './components/StudySidebar';
import ViewerToolbar, { LayoutMode } from './components/ViewerToolbar';
import OCTViewerPanel from './components/OCTViewerPanel';
import SliceScrubber from './components/SliceScrubber';
import StudyInsights from './components/StudyInsights';
import StatusBar from './components/StatusBar';

import { useStudyLoader } from './hooks/useStudyLoader';
import { useSliceNavigation } from './hooks/useSliceNavigation';
import { registerOCTImageLoader } from './lib/cornerstoneImageLoader';

// WHY: App is the root container of OCT Insight Desktop.
// For responsive laptop compatibility:
// 1. Manages window-adaptive state (sidebar toggling, dual vs stacked vs single viewports,
//    and collapsible insights tray) so the layout cleanly fits any laptop dimensions (13", 14", 16",
//    split-screen, or varied DPI scales).
// 2. Uses min-h-0 and min-w-0 on flex/grid children so nested Cornerstone WebGL canvases
//    never overflow or crush the viewport when screen height is restricted (e.g. 768px/800px).
// 3. Registers global Cornerstone image loaders and synchronizes wheel and scrub navigation.
export default function App() {
  const { manifest, isLoading, error, progressText, loadStudy } = useStudyLoader();
  const [linkedScroll, setLinkedScroll] = useState(true);

  // Responsive state management:
  // Automatically configure defaults based on initial laptop screen dimensions:
  // - On smaller laptop screens (< 1024px width), collapse sidebar to give room to B-scans.
  // - On smaller laptop heights (< 850px height), start insights drawer collapsed so B-scans have full vertical space.
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  const [layoutMode, setLayoutMode] = useState<LayoutMode>('dual');
  const [activeSingleView, setActiveSingleView] = useState<'left' | 'right'>('left');

  const [isInsightsOpen, setIsInsightsOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerHeight >= 850;
    }
    return false;
  });

  const [dismissedError, setDismissedError] = useState<string | null>(null);

  // Initialize slice navigation once manifest is available
  const totalSlices = manifest ? manifest.sliceCount : 0;
  const { currentSlice, goToSlice, nextSlice, prevSlice } = useSliceNavigation(totalSlices);

  useEffect(() => {
    console.debug('Registering custom OCT image loader on startup...');
    registerOCTImageLoader();
  }, []);

  // Listen to window resize events to log telemetry and handle extreme dimension shifts
  useEffect(() => {
    const handleResize = () => {
      console.debug(`[Window Resize] Dimensions: ${window.innerWidth}x${window.innerHeight}`);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (totalSlices <= 0) return;
    if (e.deltaY > 0) {
      nextSlice();
    } else {
      prevSlice();
    }
  }, [nextSlice, prevSlice, totalSlices]);

  return (
    <div className="flex flex-col h-screen w-screen bg-[var(--color-page-bg)] text-[var(--color-default-text)] font-sans overflow-hidden select-none">
      {/* Top Application Bar */}
      <AppBar 
        onOpenStudy={loadStudy} 
        isLoading={isLoading} 
        progressText={progressText}
        studyId={manifest?.studyId}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
      />

      {/* Dismissible Error Notification Banner if loading encountered an error */}
      {error && error !== dismissedError && (
        <div className="bg-red-900/80 border-b border-red-700 text-white px-4 py-2 text-xs flex justify-between items-center z-30 shrink-0">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-red-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-mono truncate">{error}</span>
          </div>
          <button 
            onClick={() => setDismissedError(error)} 
            className="text-white hover:text-red-200 ml-4 font-bold text-sm cursor-pointer"
            title="Dismiss"
          >
            ×
          </button>
        </div>
      )}
      
      {/* Main Content Workspace */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {/* Collapsible Left Navigator & Controls */}
        <StudySidebar 
          manifest={manifest} 
          onOpenStudy={loadStudy}
          currentSlice={currentSlice}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(false)}
        />
        
        {/* Center / Right Viewing Area */}
        <main className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden bg-[var(--color-page-bg)]">
          {/* Secondary Viewport Toolbar */}
          <ViewerToolbar 
            linkedScroll={linkedScroll}
            onToggleLinkedScroll={() => setLinkedScroll(p => !p)}
            currentSlice={currentSlice}
            totalSlices={totalSlices}
            layoutMode={layoutMode}
            onChangeLayoutMode={setLayoutMode}
            activeSingleView={activeSingleView}
            onToggleSingleView={setActiveSingleView}
            isInsightsOpen={isInsightsOpen}
            onToggleInsights={() => setIsInsightsOpen(prev => !prev)}
          />
          
          {/* Diagnostic Viewports Container: Responsive Grid based on Layout Mode */}
          <div 
            className="flex-1 min-h-0 min-w-0 p-2 sm:p-3 lg:p-4 bg-[var(--color-page-bg)] overflow-hidden"
            onWheel={handleWheel}
          >
            {layoutMode === 'dual' && (
              <div className="w-full h-full min-h-0 min-w-0 grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
                <OCTViewerPanel
                  title="Original OCT"
                  titleColor="neutral"
                  badge="SOURCE"
                  currentSlice={currentSlice}
                  totalSlices={totalSlices}
                  manifest={manifest}
                  viewportId="left-viewport"
                />
                <OCTViewerPanel
                  title="Model Output"
                  titleColor="cyan"
                  badge="AI-DERIVED"
                  currentSlice={currentSlice}
                  totalSlices={totalSlices}
                  manifest={manifest}
                  viewportId="right-viewport"
                />
              </div>
            )}

            {layoutMode === 'stacked' && (
              <div className="w-full h-full min-h-0 min-w-0 grid grid-rows-2 gap-2 sm:gap-3">
                <OCTViewerPanel
                  title="Original OCT"
                  titleColor="neutral"
                  badge="SOURCE"
                  currentSlice={currentSlice}
                  totalSlices={totalSlices}
                  manifest={manifest}
                  viewportId="left-viewport"
                />
                <OCTViewerPanel
                  title="Model Output"
                  titleColor="cyan"
                  badge="AI-DERIVED"
                  currentSlice={currentSlice}
                  totalSlices={totalSlices}
                  manifest={manifest}
                  viewportId="right-viewport"
                />
              </div>
            )}

            {layoutMode === 'single' && (
              <div className="w-full h-full min-h-0 min-w-0">
                {activeSingleView === 'left' ? (
                  <OCTViewerPanel
                    title="Original OCT"
                    titleColor="neutral"
                    badge="SOURCE"
                    currentSlice={currentSlice}
                    totalSlices={totalSlices}
                    manifest={manifest}
                    viewportId="left-viewport"
                  />
                ) : (
                  <OCTViewerPanel
                    title="Model Output"
                    titleColor="cyan"
                    badge="AI-DERIVED"
                    currentSlice={currentSlice}
                    totalSlices={totalSlices}
                    manifest={manifest}
                    viewportId="right-viewport"
                  />
                )}
              </div>
            )}
          </div>
          
          {/* Volume Linear Scrubber */}
          <SliceScrubber 
            currentSlice={currentSlice}
            totalSlices={totalSlices}
            onSliceChange={goToSlice}
            onPrevSlice={prevSlice}
            onNextSlice={nextSlice}
          />
          
          {/* Quantitative Study Insights Collapsible Tray */}
          <StudyInsights 
            isOpen={isInsightsOpen}
            onToggle={() => setIsInsightsOpen(prev => !prev)}
          />
        </main>
      </div>

      {/* Bottom Status Telemetry Bar */}
      <StatusBar 
        manifest={manifest} 
        currentSlice={currentSlice} 
      />
    </div>
  );
}
