import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, ShieldCheck, Truck, Tag, MessageSquare, ChevronRight } from 'lucide-react';
import { fetchProductById } from '../services/productsApi';
import { ImageGallery } from '../components/ImageGallery';
import { ErrorState } from '../components/ErrorState';

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProduct = useCallback(() => {
    setIsLoading(true);
    setError(null);
    const controller = new AbortController();

    fetchProductById(id, controller.signal)
      .then((data) => {
        setProduct(data);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load product details.');
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    const cleanup = loadProduct();
    return () => {
      if (cleanup) cleanup();
    };
  }, [loadProduct]);

  // Pressing Escape key navigates back to catalogue
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        navigate(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="app-container" style={{ padding: '2rem 1.5rem' }}>
        <div className="skeleton" style={{ width: '140px', height: '30px', marginBottom: '2rem' }} />
        <div className="detail-grid">
          <div className="skeleton" style={{ height: '420px', borderRadius: '16px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div className="skeleton" style={{ width: '40%', height: '24px' }} />
            <div className="skeleton" style={{ width: '80%', height: '40px' }} />
            <div className="skeleton" style={{ width: '30%', height: '44px' }} />
            <div className="skeleton" style={{ width: '100%', height: '120px' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="app-container" style={{ paddingTop: '2rem' }}>
        <button type="button" className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Back to Catalogue
        </button>
        <ErrorState error={error} onRetry={loadProduct} />
      </div>
    );
  }

  const originalPrice = product.discountPercentage 
    ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
    : null;

  return (
    <div className="app-container" style={{ paddingTop: '1.5rem' }}>
      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
        <Link to="/products" style={{ color: 'inherit', textDecoration: 'none' }}>Catalogue</Link>
        <ChevronRight size={14} />
        <span style={{ textTransform: 'capitalize' }}>{product.category}</span>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text-primary)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>
          {product.title}
        </span>
      </div>

      <button
        type="button"
        className="back-btn"
        onClick={() => navigate(-1)}
        aria-label="Back to product catalogue (or press Escape)"
      >
        <ArrowLeft size={18} />
        Back to Catalogue <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>(Esc)</span>
      </button>

      <div className="detail-grid" role="main" aria-label={`Details for ${product.title}`}>
        {/* Left Column: Image Gallery */}
        <ImageGallery images={product.images || [product.thumbnail]} title={product.title} />

        {/* Right Column: Product Details */}
        <div className="detail-info">
          <span className="card-category">{product.category}</span>
          <h1 className="detail-title">{product.title}</h1>

          <div className="card-meta" style={{ justifyContent: 'flex-start', gap: '1rem' }}>
            <div className="rating-star">
              <Star size={15} fill="#fbbf24" color="#fbbf24" />
              <span>{product.rating?.toFixed(1)}</span>
            </div>

            <span className={`stock-status ${product.stock > 0 ? 'stock-in' : 'stock-out'}`}>
              {product.stock > 0 && <span className="pulse-dot" />}
              {product.stock > 0 ? `${product.stock} items in stock (${product.availabilityStatus || 'Available'})` : 'Out of stock'}
            </span>
          </div>

          <div className="detail-price-row">
            <span className="detail-price">${product.price.toFixed(2)}</span>
            {originalPrice && (
              <span className="original-price" style={{ fontSize: '1.2rem' }}>
                ${originalPrice}
              </span>
            )}
            {product.discountPercentage > 0 && (
              <span className="discount-badge" style={{ position: 'static' }}>
                Save {Math.round(product.discountPercentage)}%
              </span>
            )}
          </div>

          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '1rem' }}>
            {product.description}
          </p>

          {/* Specs List */}
          <div className="detail-meta-list">
            {product.brand && (
              <div>
                <span className="meta-item-label">Brand</span>
                <div className="meta-item-value">{product.brand}</div>
              </div>
            )}
            {product.sku && (
              <div>
                <span className="meta-item-label">SKU</span>
                <div className="meta-item-value">{product.sku}</div>
              </div>
            )}
            {product.warrantyInformation && (
              <div>
                <span className="meta-item-label">Warranty</span>
                <div className="meta-item-value" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ShieldCheck size={15} color="#818cf8" />
                  {product.warrantyInformation}
                </div>
              </div>
            )}
            {product.shippingInformation && (
              <div>
                <span className="meta-item-label">Shipping</span>
                <div className="meta-item-value" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Truck size={15} color="#34d399" />
                  {product.shippingInformation}
                </div>
              </div>
            )}
            {product.returnPolicy && (
              <div>
                <span className="meta-item-label">Return Policy</span>
                <div className="meta-item-value">{product.returnPolicy}</div>
              </div>
            )}
            {product.weight && (
              <div>
                <span className="meta-item-label">Weight</span>
                <div className="meta-item-value">{product.weight} kg</div>
              </div>
            )}
          </div>

          {/* Tags */}
          {Array.isArray(product.tags) && product.tags.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Tag size={15} color="var(--text-muted)" />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-subtle)',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      fontWeight: 500
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Verified Reviews Section */}
          {Array.isArray(product.reviews) && product.reviews.length > 0 && (
            <section className="reviews-section">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <MessageSquare size={18} color="#818cf8" />
                <h3 className="reviews-title" style={{ margin: 0 }}>Customer Reviews ({product.reviews.length})</h3>
              </div>
              {product.reviews.map((rev, idx) => (
                <div key={idx} className="review-card">
                  <div className="review-header">
                    <span className="reviewer-name">{rev.reviewerName}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#fbbf24' }}>
                      <Star size={13} fill="#fbbf24" color="#fbbf24" />
                      <span>{rev.rating}</span>
                    </div>
                  </div>
                  <p className="review-comment">"{rev.comment}"</p>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
