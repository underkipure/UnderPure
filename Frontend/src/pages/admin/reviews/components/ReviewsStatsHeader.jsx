import React from "react";
import { AdminStatCard } from "../../../../components/admin/shared";

const ReviewsStatsHeader = ({
  totalCount,
  activeCount,
  disabledCount,
  productCount,
  serviceCount,
}) => {
  const stats = [
    {
      label: "Total Reviews",
      value: totalCount,
      subtitle: "All feedback received",
    },
    {
      label: "Active Reviews",
      value: activeCount,
      subtitle: "Visible to customers",
    },
    {
      label: "Disabled Reviews",
      value: disabledCount,
      subtitle: "Hidden from site",
    },
    {
      label: "Product / Service",
      value: `${productCount} / ${serviceCount}`,
      subtitle: "PDP vs Store reviews",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand/15 pb-5">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-ivory">
            Manage Reviews
          </h1>
          <p className="text-xs text-warm-gray font-sans mt-1">
            Approve, disable, and moderate user reviews and ratings.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {stats.map((stat, i) => (
          <AdminStatCard
            key={i}
            label={stat.label}
            value={stat.value}
            subtitle={stat.subtitle}
            variant="surface-1"
          />
        ))}
      </div>
    </div>
  );
};

export default ReviewsStatsHeader;
