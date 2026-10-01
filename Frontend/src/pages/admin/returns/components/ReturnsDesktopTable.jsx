import React from 'react';
import { Check, X } from 'lucide-react';
import ReturnStatusBadge from './ReturnStatusBadge';

export default function ReturnsDesktopTable({
  requests,
  actioningId,
  onUpdateStatus,
}) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-black/10 text-xs uppercase tracking-widest text-gray-500">
            <th className="p-4 font-medium">Order #</th>
            <th className="p-4 font-medium">Order Date</th>
            <th className="p-4 font-medium">Reason</th>
            <th className="p-4 font-medium">Method</th>
            <th className="p-4 font-medium">Status</th>
            <th className="p-4 font-medium">Date Initiated</th>
            <th className="p-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-black/5">
          {requests.map((req) => (
            <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="p-4 font-medium">{req.order_number}</td>
              <td className="p-4 text-gray-600">{req.order_date}</td>
              <td className="p-4 text-gray-600 max-w-[300px] truncate" title={req.reason}>
                {req.reason}
              </td>
              <td className="p-4 text-gray-500">
                <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {req.method || 'Unknown'}
                </span>
              </td>
              <td className="p-4">
                <ReturnStatusBadge status={req.status} />
              </td>
              <td className="p-4 text-gray-500 text-xs">
                {new Date(req.created_at).toLocaleString()}
              </td>
              <td className="p-4 text-right">
                {req.status === 'Pending' ? (
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onUpdateStatus(req.id, 'Processed')}
                      disabled={actioningId === req.id}
                      className="text-green-600 hover:bg-green-50 p-2 rounded transition-colors cursor-pointer disabled:opacity-50"
                      title="Mark as Processed"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => onUpdateStatus(req.id, 'Rejected')}
                      disabled={actioningId === req.id}
                      className="text-red-600 hover:bg-red-50 p-2 rounded transition-colors cursor-pointer disabled:opacity-50"
                      title="Reject Request"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">Completed</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
