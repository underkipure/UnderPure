import React from 'react';
import { Check, X } from 'lucide-react';
import ReturnStatusBadge from './ReturnStatusBadge';

export default function ReturnsMobileCards({
  requests,
  actioningId,
  onUpdateStatus,
}) {
  return (
    <div className="md:hidden space-y-4 p-4">
      {requests.map((req) => (
        <div
          key={req.id}
          className="bg-white border border-black/10 p-4 space-y-3 rounded-sm shadow-2xs"
        >
          <div className="flex justify-between items-center border-b border-black/10 pb-2">
            <span className="font-medium text-black">Order #{req.order_number}</span>
            <ReturnStatusBadge status={req.status} />
          </div>

          <div className="text-xs space-y-1 text-gray-600">
            <p>
              <span className="text-gray-400">Date:</span> {req.order_date}
            </p>
            <p>
              <span className="text-gray-400">Method:</span> {req.method}
            </p>
            <p className="bg-gray-50 p-2 rounded border border-black/5 mt-2 text-gray-700">
              <span className="text-gray-400 block text-[10px] uppercase tracking-wider">
                Reason:
              </span>
              {req.reason}
            </p>
          </div>

          {req.status === 'Pending' && (
            <div className="flex justify-end gap-2 pt-2 border-t border-black/10">
              <button
                onClick={() => onUpdateStatus(req.id, 'Processed')}
                disabled={actioningId === req.id}
                className="bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-green-100 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Check size={14} /> Accept
              </button>
              <button
                onClick={() => onUpdateStatus(req.id, 'Rejected')}
                disabled={actioningId === req.id}
                className="bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-red-100 transition-colors cursor-pointer disabled:opacity-50"
              >
                <X size={14} /> Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
