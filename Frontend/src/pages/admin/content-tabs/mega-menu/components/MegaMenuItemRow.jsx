import React from "react";
import { Menu, ChevronUp, ChevronDown, Edit3, Trash2 } from "lucide-react";

export default function MegaMenuItemRow({
  item,
  index,
  totalItems,
  onMoveItem,
  onEdit,
  onDelete,
}) {
  const linksCount = (item.linkGroups || []).reduce(
    (acc, g) => acc + (g.links || []).length,
    (item.links || []).length
  );
  const promosCount = (item.promos || []).length;

  return (
    <div className="flex items-center gap-3">
      <span className="text-gray-300 cursor-grab">
        <Menu size={14} />
      </span>
      <span
        className={`text-xs uppercase tracking-widest font-semibold flex-1 ${
          item.isRed ? "text-red-600" : "text-black"
        }`}
      >
        {item.name}
      </span>
      <span className="text-[9px] uppercase tracking-widest text-gray-400 hidden sm:block">
        {item.hasDropdown
          ? `Mega Menu (${linksCount} Links, ${promosCount} Promos)`
          : "Simple Link"}
      </span>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onMoveItem(index, -1)}
          disabled={index === 0}
          className="text-gray-400 hover:text-black disabled:opacity-20"
          title="Move Up"
        >
          <ChevronUp size={16} />
        </button>
        <button
          onClick={() => onMoveItem(index, 1)}
          disabled={index === totalItems - 1}
          className="text-gray-400 hover:text-black disabled:opacity-20"
          title="Move Down"
        >
          <ChevronDown size={16} />
        </button>
        <button
          onClick={() => onEdit(item)}
          className="text-gray-400 hover:text-black ml-2"
          title="Edit Menu Item"
        >
          <Edit3 size={14} />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="text-gray-400 hover:text-red-600"
          title="Delete Menu Item"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
