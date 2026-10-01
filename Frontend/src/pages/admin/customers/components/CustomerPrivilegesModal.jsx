import React from 'react';
import { X, Check } from 'lucide-react';

const CustomerPrivilegesModal = ({
  customer,
  globalPrivileges,
  selectedPrivileges,
  onTogglePrivilege,
  onSave,
  onClose,
}) => {
  if (!customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white max-w-md w-[95%] sm:w-full max-h-[90vh] flex flex-col border border-black/10 shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6 shrink-0">
          <div>
            <h3 className="font-serif text-xl">Manage VIP Privileges</h3>
            <p className="text-xs text-gray-500 tracking-widest uppercase mt-1">For {customer.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {globalPrivileges.map(priv => {
            const isSelected = selectedPrivileges.includes(priv.name);
            return (
              <div 
                key={priv.id}
                onClick={() => onTogglePrivilege(priv.name)}
                className={`p-4 border cursor-pointer transition-colors flex items-start gap-4 ${
                  isSelected ? 'border-black bg-gray-50' : 'border-black/10 hover:border-black/30'
                }`}
              >
                <div className={`w-5 h-5 mt-0.5 border flex items-center justify-center shrink-0 ${
                  isSelected ? 'border-black bg-black text-white' : 'border-black/30'
                }`}>
                  {isSelected && <Check size={14} />}
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest">{priv.name}</div>
                  {priv.description && (
                    <div className="text-[11px] text-gray-500 mt-1 leading-snug">{priv.description}</div>
                  )}
                </div>
              </div>
            );
          })}
          {globalPrivileges.length === 0 && (
            <p className="text-sm text-gray-500 italic text-center py-4">No global privileges defined. Add them in Settings.</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-black/10 shrink-0">
          <button 
            onClick={onSave}
            className="flex-1 bg-black text-white py-3 text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Save Privileges
          </button>
          <button 
            onClick={onClose}
            className="flex-1 border border-black/20 py-3 text-xs uppercase tracking-widest hover:border-black transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerPrivilegesModal;
