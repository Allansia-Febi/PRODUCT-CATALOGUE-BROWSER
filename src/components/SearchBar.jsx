import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';

/**
 * SearchBar Component
 * Renders an input field that updates parent state via debounced updates (300-500ms).
 */
export function SearchBar({ value, onChange }) {
  const [searchTerm, setSearchTerm] = useState(value || '');
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  // Sync internal state if URL param changes externally (e.g. Back/Forward)
  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  // Trigger parent onChange when debounced search term updates
  useEffect(() => {
    if (debouncedSearchTerm !== value) {
      onChange(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onChange, value]);

  const handleClear = () => {
    setSearchTerm('');
    onChange('');
  };

  return (
    <div className="search-wrapper">
      <Search className="search-icon" aria-hidden="true" />
      <input
        type="text"
        className="search-input"
        placeholder="Search products by title, brand, tag..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search products"
      />
      {searchTerm && (
        <button
          type="button"
          className="search-clear-btn"
          onClick={handleClear}
          aria-label="Clear search input"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
