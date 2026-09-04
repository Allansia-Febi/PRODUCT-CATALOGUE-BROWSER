import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Header } from '../components/Header';
import { Filters } from '../components/Filters';
import { FilterChips } from '../components/FilterChips';
import { ProductGrid } from '../components/ProductGrid';
import { ProductSkeleton } from '../components/ProductSkeleton';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { Pagination } from '../components/Pagination';
import { fetchCategories, fetchAllProducts } from '../services/productsApi';
import { useQueryParams } from '../hooks/useQueryParams';
import { useScrollRestoration } from '../hooks/useScrollRestoration';

const PAGE_SIZE = 12;

export function ProductListPage() {
  const { queryState, updateFilters, removeFilter, clearAllFilters, setPage } = useQueryParams();
  const { search, category, minPrice, maxPrice, inStock, sort, page } = queryState;

  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stale request protection sequence guard
  const latestSequenceIdRef = useRef(0);

  // Scroll restoration hook
  const { saveScrollPosition } = useScrollRestoration(!isLoading);

  // Fetch categories on mount
  useEffect(() => {
    const controller = new AbortController();
    fetchCategories(controller.signal)
      .then((data) => setCategories(data || []))
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Failed to load categories:', err);
        }
      });
    return () => controller.abort();
  }, []);

  // Fetch all products with AbortController and sequence protection
  const loadProducts = useCallback(() => {
    setIsLoading(true);
    setError(null);

    const controller = new AbortController();

    fetchAllProducts(controller.signal)
      .then((data) => {
        // Race condition / stale request check:
        // Ensure older pending requests cannot overwrite newer ones
        if (data.sequenceId >= latestSequenceIdRef.current) {
          latestSequenceIdRef.current = data.sequenceId;
          setAllProducts(data.products || []);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to fetch product catalog.');
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const cleanup = loadProducts();
    return () => {
      if (cleanup) cleanup();
    };
  }, [loadProducts]);

  // Combined Multi-Condition Filtering (AND logic)
  const filteredProducts = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];

    return allProducts.filter((product) => {
      // 1. Search filter (title, description, brand, category, tags)
      if (search) {
        const query = search.toLowerCase().trim();
        const matchesTitle = product.title?.toLowerCase().includes(query);
        const matchesDesc = product.description?.toLowerCase().includes(query);
        const matchesBrand = product.brand?.toLowerCase().includes(query);
        const matchesCategory = product.category?.toLowerCase().includes(query);
        const matchesTags = Array.isArray(product.tags) && product.tags.some(t => t.toLowerCase().includes(query));

        if (!matchesTitle && !matchesDesc && !matchesBrand && !matchesCategory && !matchesTags) {
          return false;
        }
      }

      // 2. Category filter
      if (category && product.category !== category) {
        return false;
      }

      // 3. Min Price filter
      if (minPrice !== '' && !isNaN(Number(minPrice))) {
        if (product.price < Number(minPrice)) return false;
      }

      // 4. Max Price filter
      if (maxPrice !== '' && !isNaN(Number(maxPrice))) {
        if (product.price > Number(maxPrice)) return false;
      }

      // 5. Stock filter
      if (inStock && product.stock <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // 6. Sorting
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'rating-asc') return a.rating - b.rating;
      if (sort === 'rating-desc') return b.rating - a.rating;
      return 0;
    });
  }, [allProducts, search, category, minPrice, maxPrice, inStock, sort]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE) || 1;
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredProducts, currentPage]);

  const handleSearchChange = useCallback(
    (newSearch) => {
      updateFilters({ search: newSearch });
    },
    [updateFilters]
  );

  return (
    <div>
      <Header searchValue={search} onSearchChange={handleSearchChange} />

      <main className="app-container">
        <Filters
          categories={categories}
          filters={queryState}
          onFilterChange={updateFilters}
        />

        <FilterChips
          filters={queryState}
          categories={categories}
          onRemoveFilter={removeFilter}
          onClearAll={clearAllFilters}
        />

        {/* Content Views */}
        {isLoading ? (
          <ProductSkeleton count={PAGE_SIZE} />
        ) : error ? (
          <ErrorState error={error} onRetry={loadProducts} />
        ) : filteredProducts.length === 0 ? (
          <EmptyState search={search} onClearFilters={clearAllFilters} />
        ) : (
          <>
            <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Showing {paginatedProducts.length} of {filteredProducts.length} products
            </div>
            <ProductGrid products={paginatedProducts} onSaveScroll={saveScrollPosition} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </main>
    </div>
  );
}
