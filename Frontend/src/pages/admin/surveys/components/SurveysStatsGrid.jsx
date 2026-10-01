import React from "react";
import { ClipboardList, Star } from "lucide-react";
import { AdminStatCard } from "../../../../components/admin/shared";

export default function SurveysStatsGrid({ totalSubmissions, avgScore }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <AdminStatCard
        label="Total Submissions"
        value={totalSubmissions}
        icon={ClipboardList}
        iconColor="text-black"
      />
      <AdminStatCard
        label="Avg Recommendation Score"
        value={`${avgScore} / 10`}
        icon={Star}
        iconColor="text-yellow-500"
      />
    </div>
  );
}
