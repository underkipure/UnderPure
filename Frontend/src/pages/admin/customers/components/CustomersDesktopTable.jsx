import React from 'react';
import CustomerTableRow from './CustomerTableRow';

const CustomersDesktopTable = ({
  customers,
  actioningId,
  onOpenPrivileges,
  onToggleVip,
}) => {
  return (
    <div className="hidden md:block bg-white border border-black/10 overflow-hidden rounded-sm shadow-2xs w-full">
      <div className="w-full">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-black/10 text-[10px] uppercase tracking-[0.15em] text-gray-500 bg-gray-50/80">
              <th className="p-4 font-semibold">Customer</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Orders</th>
              <th className="p-4 font-semibold text-right">Total Spent</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {customers.map((c) => (
              <CustomerTableRow
                key={c.id}
                customer={c}
                actioningId={actioningId}
                onOpenPrivileges={onOpenPrivileges}
                onToggleVip={onToggleVip}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersDesktopTable;
