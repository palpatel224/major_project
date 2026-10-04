import React, { useState, useEffect } from 'react';
import AppBar from './components/AppBar';
import StudySidebar from './components/StudySidebar';
import ViewerToolbar from './components/ViewerToolbar';
import OCTViewerPanel from './components/OCTViewerPanel';
import SliceScrubber from './components/SliceScrubber';
import StudyInsights from './components/StudyInsights';
import StatusBar from './components/StatusBar';

import { useStudyLoader } from './hooks/useStudyLoader';
import { useSliceNavigation } from './hooks/useSliceNavigation';
import { registerOCTImageLoader } from './lib/cornerstoneImageLoader';

export default function App() {
  const { manifest, isLoading, error, progressText, loadStudy } = useStudyLoader();
  const [linkedScroll, setLinkedScroll] = useState(true);

  // Initialize slice navigation once manifest is available
  const totalSlices = manifest ? manifest.sliceCount : 0;
  const { currentSlice, goToSlice, nextSlice, prevSlice } = useSliceNavigation(totalSlices);

  useEffect(() => {
    // Register custom image loader on app startup
    registerOCTImageLoader();
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0) {
      nextSlice();
    } else {
      prevSlice();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--color-page-bg)] text-[var(--color-default-text)] font-sans overflow-hidden">
      <AppBar 
        onOpenStudy={loadStudy} 
        isLoading={isLoading} 
        progressText={progressText}
        studyId={manifest?.studyId}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <StudySidebar 
          manifest={manifest} 
          onOpenStudy={loadStudy}
          currentSlice={currentSlice}
        />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          <ViewerToolbar 
            linkedScroll={linkedScroll}
            onToggleLinkedScroll={() => setLinkedScroll(p => !p)}
            currentSlice={currentSlice}
            totalSlices={totalSlices}
          />
          
          <div 
            className="flex-1 p-4 grid grid-cols-2 gap-4 bg-[var(--color-page-bg)]"
            onWheel={handleWheel}
          >
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
              badge="DERIVED"
              currentSlice={currentSlice}
              totalSlices={totalSlices}
              manifest={manifest}
              viewportId="right-viewport"
            />
          </div>
          
          <SliceScrubber 
            currentSlice={currentSlice}
            totalSlices={totalSlices}
            onSliceChange={goToSlice}
          />
          
          <StudyInsights />
        </main>
      </div>

      <StatusBar 
        manifest={manifest} 
        currentSlice={currentSlice} 
      />
    </div>
  );
}
