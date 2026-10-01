export const fmt = (n) => {
  if (n === undefined || n === null) return "—";
  return Number(n).toLocaleString("en-PK", { maximumFractionDigits: 0 });
};

export const getStatusBadgeStyle = (status) => {
  switch (status) {
    case "pending":
      return "border-yellow-200 bg-yellow-50 text-yellow-700";
    case "processing":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "shipped":
      return "border-purple-200 bg-purple-50 text-purple-700";
    case "delivered":
      return "border-green-200 bg-green-50 text-green-700";
    default:
      return "border-red-200 bg-red-50 text-red-700";
  }
};
