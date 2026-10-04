import React, { useEffect, useRef } from 'react';
import * as cornerstone from '@cornerstonejs/core';
import { StudyManifest } from '../hooks/useStudyLoader';

interface CornerstoneViewportProps {
  viewportId: string;
  sliceIndex: number;
  manifest: StudyManifest;
}

export default function CornerstoneViewport({ viewportId, sliceIndex, manifest }: CornerstoneViewportProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const renderingEngineId = `engine_${viewportId}`;
  
  useEffect(() => {
    let renderingEngine: cornerstone.RenderingEngine;
    
    const setup = async () => {
      try {
        if (!cornerstone.isInitialized()) {
          console.debug("Initializing Cornerstone core...");
          await cornerstone.init();
        }

        if (!elementRef.current) return;

        renderingEngine = new cornerstone.RenderingEngine(renderingEngineId);
        
        const viewportInput = {
          viewportId,
          type: cornerstone.Enums.ViewportType.STACK,
          element: elementRef.current,
          defaultOptions: {
            background: [0, 0, 0] as cornerstone.Types.Point3,
          },
        };

        renderingEngine.enableElement(viewportInput);
        
        console.debug(`Viewport ${viewportId} initialized.`);
      } catch (e) {
        console.error("Cornerstone setup failed", e);
      }
    };
    
    setup();
    
    return () => {
      if (renderingEngine) {
        renderingEngine.disableElement(viewportId);
        renderingEngine.destroy();
      }
    };
  }, [viewportId, renderingEngineId]);

  useEffect(() => {
    const updateImage = async () => {
      if (!cornerstone.isInitialized() || !manifest || !manifest.sliceFiles[sliceIndex]) return;

      const engine = cornerstone.getRenderingEngine(renderingEngineId);
      if (!engine) return;

      const viewport = engine.getViewport(viewportId) as cornerstone.Types.IStackViewport;
      if (!viewport) return;

      // Ensure the loader manifest is updated
      // We assume setLoaderManifest has been called or we can just pass the manifest to it.
      // But we can also just set it here to be safe.
      const { setLoaderManifest } = await import('../lib/cornerstoneImageLoader');
      setLoaderManifest(manifest);

      const imageId = `octAsset://${manifest.sliceFiles[sliceIndex]}`;
      
      try {
        console.debug(`Setting stack for viewport ${viewportId}, slice ${sliceIndex}`);
        await viewport.setStack([imageId]);
        viewport.render();
      } catch (err) {
        console.error(`Error rendering slice ${sliceIndex} on viewport ${viewportId}:`, err);
      }
    };
    
    updateImage();
  }, [sliceIndex, manifest, viewportId, renderingEngineId]);

  return (
    <div 
      ref={elementRef}
      className="w-full h-full bg-black relative"
      onContextMenu={(e) => e.preventDefault()}
    />
  );
}
