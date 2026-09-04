import React from 'react';
import { SearchX } from 'lucide-react';

export function EmptyState({ search, onClearFilters }) {
  return (
    <div className="state-container" role="status">
      <SearchX className="state-icon" aria-hidden="true" />
      <h2 className="state-title">
        {search ? `No results for "${search}"` : 'No matching products found'}
      </h2>
      <p className="state-description">
        We couldn't find any products matching your active filters. Try clearing some filters or searching for another keyword.
      </p>
      {onClearFilters && (
        <button
          type="button"
          className="btn-primary"
          onClick={onClearFilters}
          aria-label="Clear all filters"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
