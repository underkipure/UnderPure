import React from 'react';
import BadgeCard from './BadgeCard';

export default function BadgesGrid({
  badges,
  isBadgeInHeaderFn,
  onEditBadge,
  onDeleteBadge,
  onToggleHeader,
}) {
  if (!badges || badges.length === 0) {
    return (
      <div className="bg-white border border-black/10 p-12 text-center">
        <p className="text-gray-400 text-sm uppercase tracking-widest">No badges found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {badges.map((badge) => {
        const inHeader = isBadgeInHeaderFn(badge.name);
        return (
          <BadgeCard
            key={badge.id}
            badge={badge}
            inHeader={inHeader}
            onEdit={onEditBadge}
            onDelete={onDeleteBadge}
            onToggleHeader={onToggleHeader}
          />
        );
      })}
    </div>
  );
}
