import React from "react";
import { CheckCircle, Tag, Clock } from "lucide-react";
import { AdminStatCard } from "../../../../components/admin/shared";

export default function PromotionsStatsGrid({ activeCount, totalUses, expiringSoonCount }) {
  const stats = [
    { label: "Active Codes", value: activeCount, icon: CheckCircle, iconColor: "text-green-500" },
    { label: "Total Uses", value: totalUses, icon: Tag, iconColor: "text-black" },
    { label: "Expiring Soon", value: expiringSoonCount, icon: Clock, iconColor: "text-yellow-500", colSpanMobile: true },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-5 sm:mb-6 md:mb-10 w-full">
      {stats.map((s) => (
        <AdminStatCard
          key={s.label}
          label={s.label}
          value={s.value}
          icon={s.icon}
          iconColor={s.iconColor}
          className={s.colSpanMobile ? "col-span-2 sm:col-span-1" : ""}
        />
      ))}
    </div>
  );
}
