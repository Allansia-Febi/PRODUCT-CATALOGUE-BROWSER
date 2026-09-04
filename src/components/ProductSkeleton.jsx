import React from 'react';

export function ProductSkeleton({ count = 8 }) {
  return (
    <div className="product-grid" aria-busy="true" aria-label="Loading products">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-card">
          <div className="skeleton skeleton-img" />
          <div className="skeleton-content">
            <div className="skeleton" style={{ width: '40%', height: '14px' }} />
            <div className="skeleton" style={{ width: '85%', height: '20px' }} />
            <div className="skeleton" style={{ width: '60%', height: '16px' }} />
            <div className="skeleton" style={{ width: '30%', height: '24px', marginTop: 'auto' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
