import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { createBadge, deleteBadge } from '../../../../lib/api';

export default function GlobalBadgesManager({
  globalBadges = [],
  setGlobalBadges,
  token
}) {
  const [newBadge, setNewBadge] = useState('');

  const handleAddBadge = async (e) => {
    e.preventDefault();
    const val = newBadge.trim();
    if (!val || globalBadges.some((b) => (b.name || b) === val)) return;
    try {
      const res = await createBadge(token, { name: val });
      setGlobalBadges([...globalBadges, res.badge || { name: val }]);
      setNewBadge('');
      toast.success('Badge added successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to add badge');
    }
  };

  const handleRemoveBadge = async (badgeToRemove) => {
    try {
      const badgeObj = globalBadges.find(
        (b) =>
          b === badgeToRemove ||
          b.name === badgeToRemove ||
          b.name === badgeToRemove?.name
      );
      if (badgeObj && badgeObj.id) {
        await deleteBadge(token, badgeObj.id);
      }
      setGlobalBadges(
        globalBadges.filter(
          (b) =>
            b !== badgeToRemove &&
            b.name !== badgeToRemove &&
            b.name !== badgeToRemove?.name
        )
      );
      toast.success('Badge removed successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to remove badge');
    }
  };

  return (
    <div>
      <h3 className="text-sm uppercase tracking-widest font-semibold mb-3">
        Manage Badges
      </h3>

      <form onSubmit={handleAddBadge} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newBadge}
          onChange={(e) => setNewBadge(e.target.value)}
          placeholder="e.g. Clearance, Pre-order"
          className="flex-1 border border-black/20 p-2 text-sm focus:outline-none focus:border-black"
        />
        <button
          type="submit"
          className="bg-black text-white px-3 py-2 text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
        >
          Add
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {globalBadges.map((badge) => {
          const key =
            typeof badge === 'object' && badge !== null
              ? badge.id || badge.name
              : badge;
          const label =
            typeof badge === 'object' && badge !== null
              ? badge.name || ''
              : badge;
          return (
            <div
              key={key}
              className="flex items-center gap-1 px-3 py-1.5 border border-black/20 bg-gray-50"
            >
              <span className="text-xs uppercase tracking-widest">{label}</span>
              <button
                type="button"
                onClick={() => handleRemoveBadge(badge)}
                className="text-gray-400 hover:text-red-500 ml-1"
                title="Remove Badge"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
        {globalBadges.length === 0 && (
          <span className="text-xs text-gray-400 italic">No badges added.</span>
        )}
      </div>
    </div>
  );
}
