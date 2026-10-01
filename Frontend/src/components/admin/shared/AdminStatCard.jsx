import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

/**
 * Universal Admin Metric / KPI Card component.
 * Supports clean modern borders, dark/light surface variants, trend indicators, and click navigation.
 */
export default function AdminStatCard({
  label,
  value,
  icon: Icon,
  iconColor = "text-gray-400",
  subtitle,
  change,
  isUp,
  onClick,
  variant = "default", // 'default' | 'surface-1' | 'minimal'
  className = "",
}) {
  const isClickable = Boolean(onClick);

  // Surface styles based on variant
  const variantClasses = {
    default: "bg-white border-black/10 hover:border-black text-black",
    "surface-1": "bg-surface-1 border-brand/10 text-ivory",
    minimal: "bg-white border-gray-100 text-black",
  }[variant] || "bg-white border-black/10 text-black";

  return (
    <div
      onClick={onClick}
      className={`border p-4 sm:p-5 md:p-6 rounded-sm flex flex-col justify-between transition-all duration-200 shadow-2xs ${
        isClickable ? "cursor-pointer hover:shadow-xs" : ""
      } ${variantClasses} ${className}`}
    >
      <div className="flex justify-between items-start mb-2 sm:mb-3">
        <span className="text-[10px] sm:text-xs tracking-widest uppercase font-bold text-gray-500 truncate">
          {label}
        </span>
        {Icon && (
          <Icon
            size={18}
            className={`sm:w-[20px] sm:h-[20px] ${iconColor}`}
            strokeWidth={1.5}
          />
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2 mt-auto">
        <p className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium leading-none">
          {value}
        </p>

        {change && (
          <span
            className={`flex items-center text-xs font-semibold tracking-wider ${
              isUp ? "text-green-600" : "text-red-600"
            }`}
          >
            {isUp ? (
              <ArrowUpRight size={14} className="mr-0.5" />
            ) : (
              <ArrowDownRight size={14} className="mr-0.5" />
            )}
            {change}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-[10px] sm:text-xs text-gray-400 font-sans mt-2 truncate">
          {subtitle}
        </p>
      )}
    </div>
  );
}
