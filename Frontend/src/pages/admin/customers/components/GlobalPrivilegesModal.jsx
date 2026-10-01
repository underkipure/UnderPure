import React from 'react';
import { X } from 'lucide-react';

const GlobalPrivilegesModal = ({
  isOpen,
  globalPrivileges,
  newPrivilegeName,
  setNewPrivilegeName,
  newPrivilegeDesc,
  setNewPrivilegeDesc,
  onAddGlobalPrivilege,
  onRemoveGlobalPrivilege,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white max-w-2xl w-[95%] sm:w-full max-h-[90vh] flex flex-col border border-black/10 shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6 shrink-0">
          <div>
            <h3 className="font-serif text-xl">Manage Global VIP Privileges</h3>
            <p className="text-xs text-gray-500 tracking-widest uppercase mt-1">Define the privileges that can be assigned to VIP customers.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={onAddGlobalPrivilege} className="flex flex-col sm:flex-row gap-2 mb-6">
          <input 
            type="text" 
            value={newPrivilegeName} 
            onChange={(e) => setNewPrivilegeName(e.target.value)}
            placeholder="Privilege Name (e.g. Free Shipping)" 
            className="flex-1 border border-black/20 p-2 text-sm focus:outline-none focus:border-black"
            required
          />
          <input 
            type="text" 
            value={newPrivilegeDesc} 
            onChange={(e) => setNewPrivilegeDesc(e.target.value)}
            placeholder="Description (optional)" 
            className="flex-[2] border border-black/20 p-2 text-sm focus:outline-none focus:border-black"
          />
          <button type="submit" className="bg-black text-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-gray-800 shrink-0 cursor-pointer">
            Add Privilege
          </button>
        </form>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {globalPrivileges.map(privilege => (
            <div key={privilege.id} className="flex items-start justify-between border border-black/10 p-4 bg-gray-50 group">
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest text-black">{privilege.name}</h4>
                {privilege.description && (
                  <p className="text-xs text-gray-500 mt-1">{privilege.description}</p>
                )}
              </div>
              <button 
                onClick={() => onRemoveGlobalPrivilege(privilege.id)} 
                className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                title="Remove Privilege"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          {globalPrivileges.length === 0 && (
            <div className="p-4 border border-black/10 text-center text-gray-500 text-sm italic">
              No VIP privileges defined yet.
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-black/10 flex justify-end shrink-0">
          <button 
            onClick={onClose}
            className="bg-black text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalPrivilegesModal;
