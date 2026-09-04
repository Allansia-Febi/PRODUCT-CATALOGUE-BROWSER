import { useEffect, useCallback } from 'react';

const SCROLL_STORAGE_KEY = 'catalogue_scroll_position';

/**
 * Custom hook to record catalogue scroll position and restore it when returning
 * to the catalogue page from a product detail page.
 */
export function useScrollRestoration(isReadyToRestore = false) {
  // Save current scroll position
  const saveScrollPosition = useCallback(() => {
    sessionStorage.setItem(SCROLL_STORAGE_KEY, window.scrollY.toString());
  }, []);

  // Track window scroll
  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem(SCROLL_STORAGE_KEY, window.scrollY.toString());
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Restore scroll position once data loading completes
  useEffect(() => {
    if (!isReadyToRestore) return;

    const savedPosition = sessionStorage.getItem(SCROLL_STORAGE_KEY);
    if (savedPosition !== null) {
      const scrollY = parseInt(savedPosition, 10);
      if (!isNaN(scrollY) && scrollY > 0) {
        // Use requestAnimationFrame to ensure DOM rendering completes before scrolling
        requestAnimationFrame(() => {
          window.scrollTo({
            top: scrollY,
            behavior: 'instant',
          });
        });
      }
    }
  }, [isReadyToRestore]);

  return { saveScrollPosition };
}
