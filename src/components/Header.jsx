import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { SearchBar } from './SearchBar';

export function Header({ searchValue, onSearchChange }) {
  return (
    <header className="app-header">
      <div className="app-container header-content">
        <Link to="/" className="brand-link" aria-label="Product Catalogue Home">
          <div className="brand-icon-wrapper">
            <ShoppingBag size={20} />
          </div>
          <span>
            Product<span className="brand-title-accent">Catalog</span>
          </span>
        </Link>

        <SearchBar value={searchValue} onChange={onSearchChange} />
      </div>
    </header>
  );
}
