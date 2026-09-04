import React from 'react';
import { X } from 'lucide-react';

export function FilterChips({ filters, categories, onRemoveFilter, onClearAll }) {
  const { search, category, minPrice, maxPrice, inStock, sort } = filters;

  // Format category slug into human-readable label
  const getCategoryName = (slug) => {
    if (!slug) return '';
    const match = categories.find(c => (typeof c === 'string' ? c === slug : c.slug === slug));
    return match ? (typeof match === 'string' ? match : match.name) : slug;
  };

  const getSortLabel = (sortValue) => {
    switch (sortValue) {
      case 'price-asc': return 'Price: Low → High';
      case 'price-desc': return 'Price: High → Low';
      case 'rating-asc': return 'Rating: Low → High';
      case 'rating-desc': return 'Rating: High → Low';
      default: return sortValue;
    }
  };

  const activeChips = [];

  if (search) {
    activeChips.push({ key: 'search', label: `Search: "${search}"` });
  }

  if (category) {
    activeChips.push({ key: 'category', label: `Category: ${getCategoryName(category)}` });
  }

  if (minPrice) {
    activeChips.push({ key: 'minPrice', label: `Min: $${minPrice}` });
  }

  if (maxPrice) {
    activeChips.push({ key: 'maxPrice', label: `Max: $${maxPrice}` });
  }

  if (inStock) {
    activeChips.push({ key: 'inStock', label: 'In stock only' });
  }

  if (sort) {
    activeChips.push({ key: 'sort', label: `Sort: ${getSortLabel(sort)}` });
  }

  if (activeChips.length === 0) {
    return null;
  }

  return (
    <div className="chips-container" role="region" aria-label="Active Filter Chips">
      {activeChips.map((chip) => (
        <span key={chip.key} className="chip">
          {chip.label}
          <button
            type="button"
            className="chip-remove-btn"
            onClick={() => onRemoveFilter(chip.key)}
            aria-label={`Remove filter ${chip.label}`}
          >
            <X size={14} />
          </button>
        </span>
      ))}

      <button
        type="button"
        className="clear-all-btn"
        onClick={onClearAll}
        aria-label="Clear all active filters"
      >
        Clear all
      </button>
    </div>
  );
}
