import React from 'react';

export default function ReturnStatusBadge({ status, className = '' }) {
  const getBadgeStyle = (st) => {
    switch (st?.toLowerCase()) {
      case 'pending':
        return 'bg-orange-100 text-orange-700';
      case 'processed':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <span
      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getBadgeStyle(
        status
      )} ${className}`}
    >
      {status}
    </span>
  );
}
