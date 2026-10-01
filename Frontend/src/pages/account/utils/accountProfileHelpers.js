/**
 * Pure helper functions for the Account Profile Tab
 */

export function getCalculatedLoyaltyTier(points = 0, thresholds = {}) {
  const {
    tier2Threshold = 500,
    tier3Threshold = 1000,
    tier4Threshold = 2000,
    tier5Threshold = 5000,
  } = thresholds;

  if (points >= tier5Threshold) return "Tier 5";
  if (points >= tier4Threshold) return "Tier 4";
  if (points >= tier3Threshold) return "Tier 3";
  if (points >= tier2Threshold) return "Tier 2";
  return "Tier 1";
}

export function formatAddressSummary(address) {
  if (!address) return "";
  const parts = [
    address.address_line1,
    address.address_line2,
    address.city,
    address.country || "Pakistan",
  ].filter(Boolean);

  return `${address.full_name} — ${parts.join(", ")}`;
}

export function getOrderStatusBadgeClass(status) {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-600";
    case "shipped":
      return "bg-blue-100 text-blue-600";
    default:
      return "bg-gray-100 text-gray-500";
  }
}
