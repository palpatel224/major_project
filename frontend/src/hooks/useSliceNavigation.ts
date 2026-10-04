import { useState, useCallback, useEffect } from 'react';

// WHY: This hook manages the current slice index and provides methods to navigate
// through the stack. It enforces boundary conditions and supports keyboard navigation.
export function useSliceNavigation(totalSlices: number) {
  const [currentSlice, setCurrentSlice] = useState(0);

  const goToSlice = useCallback((index: number) => {
    if (totalSlices <= 0) return;
    setCurrentSlice(Math.max(0, Math.min(index, totalSlices - 1)));
  }, [totalSlices]);

  const nextSlice = useCallback(() => {
    setCurrentSlice(prev => Math.min(prev + 1, totalSlices - 1));
  }, [totalSlices]);

  const prevSlice = useCallback(() => {
    setCurrentSlice(prev => Math.max(prev - 1, 0));
  }, []);

  const jumpSlices = useCallback((delta: number) => {
    setCurrentSlice(prev => Math.max(0, Math.min(prev + delta, totalSlices - 1)));
  }, [totalSlices]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (totalSlices <= 0) return;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowRight':
          e.preventDefault();
          nextSlice();
          break;
        case 'ArrowDown':
        case 'ArrowLeft':
          e.preventDefault();
          prevSlice();
          break;
        case 'PageUp':
          e.preventDefault();
          jumpSlices(10);
          break;
        case 'PageDown':
          e.preventDefault();
          jumpSlices(-10);
          break;
        case 'Home':
          e.preventDefault();
          goToSlice(0);
          break;
        case 'End':
          e.preventDefault();
          goToSlice(totalSlices - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalSlices, nextSlice, prevSlice, jumpSlices, goToSlice]);

  return {
    currentSlice,
    goToSlice,
    nextSlice,
    prevSlice,
    jumpSlices
  };
}
