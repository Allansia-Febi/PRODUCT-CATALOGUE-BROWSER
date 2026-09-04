import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Sparkles, ShieldCheck, Zap, Star } from 'lucide-react';
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

      if (category && product.category !== category) {
        return false;
      }

      if (minPrice !== '' && !isNaN(Number(minPrice))) {
        if (product.price < Number(minPrice)) return false;
      }

      if (maxPrice !== '' && !isNaN(Number(maxPrice))) {
        if (product.price > Number(maxPrice)) return false;
      }

      if (inStock && product.stock <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'rating-asc') return a.rating - b.rating;
      if (sort === 'rating-desc') return b.rating - a.rating;
      return 0;
    });
  }, [allProducts, search, category, minPrice, maxPrice, inStock, sort]);

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
        {/* Catalogue Hero Section */}
        <section className="catalogue-hero">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>2026 Collection • 100% Authentic Items</span>
          </div>
          <h1 className="hero-title">
            Discover <span className="brand-title-accent">World-Class</span> Products
          </h1>
          <p className="hero-subtitle">
            Browse our curated catalog with real-time debounced search, combined multi-filters, and instant URL synchronization.
          </p>

          <div className="hero-stats">
            <div className="hero-stat-item">
              <Zap size={14} color="#818cf8" />
              <span>Real-Time Filtering</span>
            </div>
            <div className="hero-stat-item">
              <ShieldCheck size={14} color="#34d399" />
              <span>Verified API Data</span>
            </div>
            <div className="hero-stat-item">
              <Star size={14} color="#fbbf24" />
              <span>4.8 Avg Rating</span>
            </div>
          </div>
        </section>

        {/* Filter Toolbar */}
        <Filters
          categories={categories}
          filters={queryState}
          onFilterChange={updateFilters}
        />

        {/* Active Filter Chips */}
        <FilterChips
          filters={queryState}
          categories={categories}
          onRemoveFilter={removeFilter}
          onClearAll={clearAllFilters}
        />

        {/* Dynamic View States */}
        {isLoading ? (
          <ProductSkeleton count={PAGE_SIZE} />
        ) : error ? (
          <ErrorState error={error} onRetry={loadProducts} />
        ) : filteredProducts.length === 0 ? (
          <EmptyState search={search} onClearFilters={clearAllFilters} />
        ) : (
          <>
            <div style={{ marginBottom: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Showing <strong style={{ color: 'var(--text-primary)' }}>{paginatedProducts.length}</strong> of <strong style={{ color: 'var(--text-primary)' }}>{filteredProducts.length}</strong> matching products
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
