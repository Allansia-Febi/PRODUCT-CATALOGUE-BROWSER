import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { SearchBar } from './SearchBar';

export function Header({ searchValue, onSearchChange }) {
  return (
    <header className="app-header">
      <div className="app-container header-content">
        <Link to="/" className="brand-link" aria-label="Product Catalogue Home">
          <ShoppingBag className="brand-icon" />
          <span>ProductCatalog</span>
        </Link>

        <SearchBar value={searchValue} onChange={onSearchChange} />
      </div>
    </header>
  );
}
