import React from 'react';
import { ProductCard } from './ProductCard';

export function ProductGrid({ products, onSaveScroll }) {
  return (
    <div className="product-grid" role="region" aria-label="Product catalogue items">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onSaveScroll={onSaveScroll}
        />
      ))}
    </div>
  );
}
