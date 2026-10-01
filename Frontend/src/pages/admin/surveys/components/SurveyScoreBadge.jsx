import React from "react";

export default function SurveyScoreBadge({ score, className = "" }) {
  const numScore = Number(score);
  const colorClass =
    numScore >= 8
      ? "bg-green-100 text-green-800"
      : numScore >= 5
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800";

  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass} ${className}`}
    >
      {score}/10
    </span>
  );
}
