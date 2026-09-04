import { useSearchParams } from 'react-router-dom';
import { useMemo, useCallback } from 'react';

/**
 * Custom hook to manage URL query parameters synchronously with application state.
 */
export function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse current params from URL
  const queryState = useMemo(() => {
    return {
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      inStock: searchParams.get('inStock') === 'true',
      sort: searchParams.get('sort') || '',
      page: parseInt(searchParams.get('page') || '1', 10),
    };
  }, [searchParams]);

  // Set single or multiple filters, automatically resetting page to 1
  const updateFilters = useCallback(
    (updates, options = { replace: true, resetPage: true }) => {
      setSearchParams((prevParams) => {
        const nextParams = new URLSearchParams(prevParams);

        Object.entries(updates).forEach(([key, value]) => {
          if (value === undefined || value === null || value === '' || value === false) {
            nextParams.delete(key);
          } else {
            nextParams.set(key, String(value));
          }
        });

        // Reset page to 1 whenever filters change unless explicitly overriden
        if (options.resetPage && !('page' in updates)) {
          nextParams.delete('page');
        }

        return nextParams;
      }, { replace: options.replace });
    },
    [setSearchParams]
  );

  // Remove a specific filter chip by key
  const removeFilter = useCallback(
    (key) => {
      updateFilters({ [key]: '' }, { replace: true, resetPage: true });
    },
    [updateFilters]
  );

  // Clear all search and filter parameters
  const clearAllFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  // Pagination navigation
  const setPage = useCallback(
    (pageNumber) => {
      setSearchParams((prevParams) => {
        const nextParams = new URLSearchParams(prevParams);
        if (pageNumber > 1) {
          nextParams.set('page', String(pageNumber));
        } else {
          nextParams.delete('page');
        }
        return nextParams;
      }, { replace: false }); // Page navigation creates history entry so browser Back works across pages
    },
    [setSearchParams]
  );

  return {
    queryState,
    updateFilters,
    removeFilter,
    clearAllFilters,
    setPage,
  };
}
