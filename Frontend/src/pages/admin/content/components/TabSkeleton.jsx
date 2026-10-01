import React from 'react';

export default function TabSkeleton() {
  return (
    <div className="w-full space-y-6 py-4 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-gray-200 rounded-sm"></div>
          <div className="h-3.5 w-72 bg-gray-100 rounded-sm"></div>
        </div>
        <div className="h-9 w-28 bg-gray-200 rounded-sm"></div>
      </div>

      {/* Content Cards Skeleton */}
      <div className="space-y-6">
        <div className="p-6 border border-gray-200/60 rounded-sm bg-white space-y-4">
          <div className="h-4 w-36 bg-gray-200 rounded-sm"></div>
          <div className="h-10 w-full bg-gray-50 border border-gray-100 rounded-sm"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="h-24 bg-gray-50 border border-gray-100 rounded-sm"></div>
            <div className="h-24 bg-gray-50 border border-gray-100 rounded-sm"></div>
          </div>
        </div>

        <div className="p-6 border border-gray-200/60 rounded-sm bg-white space-y-4">
          <div className="h-4 w-40 bg-gray-200 rounded-sm"></div>
          <div className="h-32 w-full bg-gray-50 border border-gray-100 rounded-sm"></div>
        </div>
      </div>
    </div>
  );
}
