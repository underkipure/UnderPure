import React from "react";

export default function SurveysHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold font-serif mb-2">Survey Reports</h1>
        <p className="text-gray-500 text-sm">
          Manage and view all customer survey submissions.
        </p>
      </div>
    </div>
  );
}
