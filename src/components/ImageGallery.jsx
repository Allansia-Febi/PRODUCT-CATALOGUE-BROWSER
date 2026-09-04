import React, { useState } from 'react';

export function ImageGallery({ images = [], title = 'Product image' }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="gallery-container">
        <div className="gallery-main-wrapper">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
            No image available
          </div>
        </div>
      </div>
    );
  }

  const currentImage = images[selectedIndex] || images[0];

  return (
    <div className="gallery-container">
      <div className="gallery-main-wrapper">
        <img
          src={currentImage}
          alt={`${title} - view ${selectedIndex + 1}`}
          className="gallery-main-img"
        />
      </div>

      {images.length > 1 && (
        <div
          className="thumbnails-list"
          role="region"
          aria-label="Product thumbnail list"
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              className={`thumbnail-btn ${selectedIndex === idx ? 'active' : ''}`}
              onClick={() => setSelectedIndex(idx)}
              aria-label={`Select image ${idx + 1} for ${title}`}
              aria-pressed={selectedIndex === idx}
            >
              <img
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                className="thumbnail-img"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
