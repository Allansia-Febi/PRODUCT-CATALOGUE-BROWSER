import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // Generate page numbers range array
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav className="pagination-wrapper" aria-label="Pagination Navigation">
      <button
        type="button"
        className="page-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        <ChevronLeft size={16} />
        Previous
      </button>

      {pages[0] > 1 && (
        <>
          <button
            type="button"
            className={`page-btn ${currentPage === 1 ? 'active' : ''}`}
            onClick={() => onPageChange(1)}
            aria-label="Go to page 1"
          >
            1
          </button>
          {pages[0] > 2 && <span style={{ color: 'var(--text-muted)' }}>...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={`page-btn ${currentPage === page ? 'active' : ''}`}
          onClick={() => onPageChange(page)}
          aria-current={currentPage === page ? 'page' : undefined}
          aria-label={`Go to page ${page}`}
        >
          {page}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span style={{ color: 'var(--text-muted)' }}>...</span>
          )}
          <button
            type="button"
            className={`page-btn ${currentPage === totalPages ? 'active' : ''}`}
            onClick={() => onPageChange(totalPages)}
            aria-label={`Go to page ${totalPages}`}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        type="button"
        className="page-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
      >
        Next
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
