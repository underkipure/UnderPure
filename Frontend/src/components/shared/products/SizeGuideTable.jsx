import React from "react";

export const DEFAULT_COLUMNS = ["Size", "Bust (in)", "Waist (in)", "Hip (in)"];

/**
 * Reusable SizeGuideTable component for the Size Guide page and Product Detail modal.
 *
 * @param {Object} props
 * @param {Array} props.table - Rows of size chart data
 * @param {Array} [props.columns=DEFAULT_COLUMNS] - Table header columns
 * @param {string} [props.note] - Optional footnote / measurement guidance
 * @param {'standalone'|'modal'} [props.variant='standalone'] - Styling variant
 */
export function SizeGuideTable({
  table = [],
  columns = DEFAULT_COLUMNS,
  note = "",
  variant = "standalone",
}) {
  if (!table || table.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 border border-gray-100">
        <p className="text-sm font-sans text-gray-500 uppercase tracking-widest">
          Size guide is currently being updated.
        </p>
      </div>
    );
  }

  const isModal = variant === "modal";

  return (
    <div className={isModal ? "overflow-x-auto border border-gray-200" : "overflow-x-auto"}>
      <table
        className={`w-full border-collapse ${
          isModal ? "min-w-[450px] md:min-w-full text-center" : "min-w-[500px] text-left"
        }`}
      >
        <thead>
          <tr className={isModal ? "" : "border-b border-gray-200"}>
            {columns.map((col, idx) => (
              <th
                key={col}
                className={
                  isModal
                    ? "py-4 px-4 font-bold text-[9px] md:text-[11px] tracking-[0.15em] uppercase text-black"
                    : `py-4 px-4 font-bold text-[14px] text-black w-1/4 ${
                        idx > 0 ? "text-center" : ""
                      }`
                }
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.map((row, index) => (
            <tr
              key={row.id || index}
              className={`border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors ${
                isModal && index % 2 === 1 ? "bg-[#f7f7f7]" : "bg-white"
              }`}
            >
              {columns.map((col, idx) => {
                const cellValue =
                  row[col] ??
                  row[col.toLowerCase()] ??
                  row[col.toLowerCase().replace(/[^a-z0-9]/g, "_")] ??
                  "";

                return (
                  <td
                    key={col}
                    className={
                      isModal
                        ? "py-4 px-2 text-center text-[14px] font-sans font-medium text-black"
                        : `py-5 px-4 text-[14px] font-sans text-gray-800 ${
                            idx > 0 ? "text-center" : ""
                          }`
                    }
                  >
                    {cellValue}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {note && (
        <p
          className={`text-[12px] text-gray-500 italic ${
            isModal ? "mt-4 text-center" : "mt-8 text-center"
          }`}
        >
          * {note}
        </p>
      )}
    </div>
  );
}
