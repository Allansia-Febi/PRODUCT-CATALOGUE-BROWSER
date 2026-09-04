import React from 'react';

export function Filters({ categories, filters, onFilterChange }) {
  const { category, minPrice, maxPrice, inStock, sort } = filters;

  const handleInputChange = (field, value) => {
    onFilterChange({ [field]: value });
  };

  return (
    <div className="filter-bar" role="region" aria-label="Product Filters">
      {/* Category Dropdown */}
      <div className="filter-group">
        <label htmlFor="category-select" className="filter-label">Category</label>
        <select
          id="category-select"
          className="filter-select"
          value={category}
          onChange={(e) => handleInputChange('category', e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => {
            const slug = typeof cat === 'string' ? cat : cat.slug;
            const name = typeof cat === 'string' ? cat : cat.name;
            return (
              <option key={slug} value={slug}>
                {name}
              </option>
            );
          })}
        </select>
      </div>

      {/* Price Range Inputs */}
      <div className="filter-group">
        <label htmlFor="min-price-input" className="filter-label">Price Range ($)</label>
        <div className="price-inputs">
          <input
            id="min-price-input"
            type="number"
            min="0"
            className="filter-input"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => handleInputChange('minPrice', e.target.value)}
            aria-label="Minimum price"
          />
          <span className="price-separator">-</span>
          <input
            id="max-price-input"
            type="number"
            min="0"
            className="filter-input"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => handleInputChange('maxPrice', e.target.value)}
            aria-label="Maximum price"
          />
        </div>
      </div>

      {/* Sorting Dropdown */}
      <div className="filter-group">
        <label htmlFor="sort-select" className="filter-label">Sort By</label>
        <select
          id="sort-select"
          className="filter-select"
          value={sort}
          onChange={(e) => handleInputChange('sort', e.target.value)}
        >
          <option value="">Default Featured</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="rating-asc">Rating: Low → High</option>
          <option value="rating-desc">Rating: High → Low</option>
        </select>
      </div>

      {/* Stock Checkbox */}
      <div className="filter-group">
        <label className="checkbox-wrapper">
          <input
            type="checkbox"
            className="checkbox-input"
            checked={inStock}
            onChange={(e) => handleInputChange('inStock', e.target.checked)}
          />
          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>In stock only</span>
        </label>
      </div>
    </div>
  );
}
