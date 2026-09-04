import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { SearchBar } from './SearchBar';

export function Header({ searchValue, onSearchChange, totalCount = 194 }) {
  return (
    <header className="app-header">
      <div className="app-container header-content">
        <Link to="/" className="brand-link" aria-label="Product Catalogue Home">
          <div className="brand-icon-wrapper">
            <ShoppingBag size={20} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>
              Product<span className="brand-title-accent">Catalog</span>
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.04em' }}>
              {totalCount} Verified Items
            </span>
          </div>
        </Link>

        <SearchBar value={searchValue} onChange={onSearchChange} />
      </div>
    </header>
  );
}
