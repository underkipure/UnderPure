import React from 'react';

export default function ReturnsLoadMore({
  currentCount,
  totalCount,
  hasMore,
  isLoadingMore,
  onLoadMore,
}) {
  return (
    <div className="mt-6 mb-4 flex flex-col items-center justify-center text-center p-6 border-t border-black/10">
      <p className="text-[13px] text-gray-700 font-serif mb-2">
        Showing <span className="font-bold text-black">{currentCount}</span> of{' '}
        <span className="font-bold text-black">{totalCount}</span> Requests
      </p>

      {totalCount > 0 && (
        <div className="w-full max-w-xs bg-gray-200 h-1.5 rounded-full overflow-hidden mb-4">
          <div
            className="bg-black h-full transition-all duration-300"
            style={{
              width: `${Math.min(100, Math.round((currentCount / totalCount) * 100))}%`,
            }}
          />
        </div>
      )}

      {hasMore ? (
        <button
          onClick={onLoadMore}
          disabled={isLoadingMore}
          className="border border-black bg-white px-8 py-2.5 text-xs uppercase tracking-widest font-bold text-black hover:bg-black hover:text-white transition-all duration-200 disabled:opacity-50 min-w-[200px] flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow"
        >
          {isLoadingMore ? (
            <>
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
              LOADING MORE REQUESTS...
            </>
          ) : (
            'LOAD MORE REQUESTS'
          )}
        </button>
      ) : totalCount > 0 ? (
        <span className="text-[11px] uppercase tracking-widest text-gray-400 font-medium">
          ✓ All {totalCount} requests loaded
        </span>
      ) : null}
    </div>
  );
}
