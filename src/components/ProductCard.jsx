import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';

export const ProductCard = React.memo(function ProductCard({ product, onSaveScroll }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (onSaveScroll) onSaveScroll();
    navigate(`/products/${product.id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNavigate();
    }
  };

  const isInStock = product.stock > 0;
  const originalPrice = product.discountPercentage 
    ? (product.price / (1 - product.discountPercentage / 100))
    : null;
  const dollarSavings = originalPrice ? (originalPrice - product.price).toFixed(2) : null;

  // Visual stock bar percentage (capped at 100%)
  const stockPercentage = Math.min(100, Math.max(10, (product.stock / 100) * 100));

  return (
    <article
      className="product-card"
      tabIndex={0}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      aria-label={`${product.title}, price $${product.price}`}
    >
      <div className="card-image-wrapper">
        <img
          src={product.thumbnail || (product.images && product.images[0])}
          alt={product.title}
          className="card-image"
          loading="lazy"
        />
        {product.discountPercentage > 5 && (
          <span className="discount-badge">
            -{Math.round(product.discountPercentage)}% OFF
          </span>
        )}
      </div>

      <div className="card-body">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
          <span className="card-category">{product.category}</span>
          {dollarSavings && Number(dollarSavings) > 3 && (
            <span style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 700, backgroundColor: 'rgba(52, 211, 153, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
              Save ${dollarSavings}
            </span>
          )}
        </div>

        <h3 className="card-title">{product.title}</h3>

        <div className="card-meta">
          <div className="rating-star">
            <Star size={13} fill="#fbbf24" color="#fbbf24" />
            <span>{product.rating?.toFixed(1) || '4.0'}</span>
          </div>

          <span className={`stock-status ${isInStock ? 'stock-in' : 'stock-out'}`}>
            {isInStock && <span className="pulse-dot" />}
            {isInStock ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>

        {/* Visual Stock Level Meter */}
        {isInStock && (
          <div className="stock-meter-bg">
            <div className="stock-meter-fill" style={{ width: `${stockPercentage}%` }} />
          </div>
        )}

        <div className="card-footer">
          <div>
            <span className="card-price">${product.price.toFixed(2)}</span>
            {originalPrice && (
              <span className="original-price">${originalPrice.toFixed(2)}</span>
            )}
          </div>

          <span className="card-action-link">
            Details
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </article>
  );
});
