import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export function ErrorState({ error, onRetry }) {
  return (
    <div className="state-container" role="alert">
      <AlertTriangle className="state-icon" style={{ color: '#f87171' }} aria-hidden="true" />
      <h2 className="state-title">Unable to load products</h2>
      <p className="state-description">
        {error || 'Please check your connection and try again.'}
      </p>
      {onRetry && (
        <button
          type="button"
          className="btn-primary"
          onClick={onRetry}
          aria-label="Retry loading products"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      )}
    </div>
  );
}
