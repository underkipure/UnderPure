import React, { useState, useEffect } from 'react';
import ProductCard from '../../../components/ProductCard';

const INITIAL_CHUNK_SIZE = 16;
const NEXT_CHUNK_SIZE = 12;

export default function CollectionProductGrid({
  loading,
  products = [],
  gridClass,
  emptyMessage,
  addToCart,
  contextBadge,
  productsPerPage = 8,
  totalCount = 0,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore
}) {
  const [renderedCount, setRenderedCount] = useState(INITIAL_CHUNK_SIZE);

  // Progressive / Chunked DOM rendering: Mount first chunk immediately, then append remainder during idle frames
  useEffect(() => {
    if (products.length <= INITIAL_CHUNK_SIZE) {
      setRenderedCount(products.length);
      return;
    }

    setRenderedCount(INITIAL_CHUNK_SIZE);
    let timerId = null;
    let cancelled = false;

    const scheduleNextChunk = () => {
      const schedule = typeof window !== 'undefined' && window.requestIdleCallback 
        ? window.requestIdleCallback 
        : (cb) => setTimeout(cb, 20);

      timerId = schedule(() => {
        if (cancelled) return;
        setRenderedCount((prev) => {
          if (prev >= products.length) return prev;
          const next = Math.min(prev + NEXT_CHUNK_SIZE, products.length);
          if (next < products.length) {
            scheduleNextChunk();
          }
          return next;
        });
      });
    };

    scheduleNextChunk();

    return () => {
      cancelled = true;
      if (typeof window !== 'undefined' && window.cancelIdleCallback && timerId) {
        window.cancelIdleCallback(timerId);
      } else if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [products]);

  if (loading) {
    return (
      <div className={`grid ${gridClass}`}>
        {[...Array(productsPerPage)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] bg-gray-200 mb-4" />
            <div className="h-4 bg-gray-200 rounded mb-2 mx-auto w-3/4" />
            <div className="h-4 bg-gray-100 rounded mx-auto w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-[14px] font-sans text-gray-400 tracking-widest uppercase">
          {emptyMessage || 'No products found in this collection'}
        </p>
      </div>
    );
  }

  const visibleProducts = products.slice(0, renderedCount);

  return (
    <>
      <div className={`grid ${gridClass}`}>
        {visibleProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={addToCart}
            contextBadge={contextBadge}
          />
        ))}
      </div>

      {/* Server-Side Load More Section */}
      <div className="mt-14 mb-8 flex flex-col items-center justify-center text-center">
        <p className="text-[13px] md:text-[14px] italic text-gray-700 font-sans mb-4">
          Showing {products.length} of {totalCount} products
        </p>

        {hasMore && (
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="border border-black bg-white px-10 py-3 text-[12px] md:text-[13px] font-sans font-bold uppercase tracking-[0.1em] text-black hover:bg-black hover:text-white transition-all duration-200 disabled:opacity-50 min-w-[160px] flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
          >
            {isLoadingMore ? (
              <>
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                LOADING...
              </>
            ) : (
              'LOAD MORE'
            )}
          </button>
        )}
      </div>
    </>
  );
}
