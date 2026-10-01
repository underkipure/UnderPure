import React, { useState } from "react";

export default function CategoryBadgeList({
  categoryIds,
  fallbackCategory,
  categories,
}) {
  const [expanded, setExpanded] = useState(false);

  const catNames =
    categoryIds && categoryIds.length > 0
      ? categoryIds
          .map(
            (id) =>
              categories.find((c) => String(c.id) === String(id))?.name,
          )
          .filter(Boolean)
      : fallbackCategory
        ? [fallbackCategory]
        : [];

  if (catNames.length === 0)
    return <span className="text-gray-400 italic">Uncategorized</span>;

  if (catNames.length <= 2) {
    return <span>{catNames.join(", ")}</span>;
  }

  const visibleCats = expanded ? catNames : catNames.slice(0, 2);
  const remainingCount = catNames.length - 2;

  return (
    <span>
      {visibleCats.join(", ")}
      {!expanded ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(true);
          }}
          className="ml-1 text-[10px] font-bold text-black border-b border-black hover:text-gray-600 inline-block uppercase tracking-wider whitespace-nowrap"
        >
          +{remainingCount} more
        </button>
      ) : (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(false);
          }}
          className="ml-1.5 text-[10px] font-bold text-red-600 border-b border-red-600 hover:text-red-800 inline-block uppercase tracking-wider whitespace-nowrap"
        >
          Show less
        </button>
      )}
    </span>
  );
}
