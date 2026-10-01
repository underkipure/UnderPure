import React from 'react';

export default function ProductSizeGuideEditor({ data, onChange }) {
  const sizeGuide = data.sizeGuide || {};

  const handleToggle = (checked) => {
    onChange({
      ...data,
      sizeGuide: { ...sizeGuide, enabled: checked }
    });
  };

  const handleLinkTextChange = (text) => {
    onChange({
      ...data,
      sizeGuide: { ...sizeGuide, linkText: text }
    });
  };

  const handleNoteChange = (note) => {
    onChange({
      ...data,
      sizeGuide: { ...sizeGuide, note }
    });
  };

  const addColumn = () => {
    let baseName = 'New Column';
    let newCol = baseName;
    let counter = 1;
    const cols = sizeGuide.columns || [];
    while (cols.includes(newCol)) {
      newCol = `${baseName} ${counter}`;
      counter++;
    }
    onChange({
      ...data,
      sizeGuide: {
        ...sizeGuide,
        columns: [...cols, newCol]
      }
    });
  };

  const addRow = () => {
    const newRow = { id: Date.now() };
    (sizeGuide.columns || []).forEach(col => {
      newRow[col] = '';
    });
    onChange({
      ...data,
      sizeGuide: {
        ...sizeGuide,
        table: [...(sizeGuide.table || []), newRow]
      }
    });
  };

  const handleRenameColumn = (colIndex, newColName) => {
    const newCols = [...(sizeGuide.columns || [])];
    const oldColName = newCols[colIndex];
    newCols[colIndex] = newColName;

    const newTable = (sizeGuide.table || []).map(row => {
      const newRow = { ...row };
      if (newRow[oldColName] !== undefined) {
        newRow[newColName] = newRow[oldColName];
        delete newRow[oldColName];
      }
      return newRow;
    });

    onChange({
      ...data,
      sizeGuide: {
        ...sizeGuide,
        columns: newCols,
        table: newTable
      }
    });
  };

  const handleDeleteColumn = (colIndex, colName) => {
    const newCols = (sizeGuide.columns || []).filter((_, i) => i !== colIndex);
    const newTable = (sizeGuide.table || []).map(row => {
      const newRow = { ...row };
      delete newRow[colName];
      return newRow;
    });

    onChange({
      ...data,
      sizeGuide: {
        ...sizeGuide,
        columns: newCols,
        table: newTable
      }
    });
  };

  const handleCellChange = (rowIndex, col, value) => {
    const newTable = [...(sizeGuide.table || [])];
    newTable[rowIndex] = { ...newTable[rowIndex], [col]: value };
    onChange({
      ...data,
      sizeGuide: {
        ...sizeGuide,
        table: newTable
      }
    });
  };

  const handleDeleteRow = (rowId) => {
    const newTable = (sizeGuide.table || []).filter(r => r.id !== rowId);
    onChange({
      ...data,
      sizeGuide: {
        ...sizeGuide,
        table: newTable
      }
    });
  };

  return (
    <div className="border-t border-black/10 pt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest">Size Guide Configuration</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-[10px] uppercase tracking-widest text-gray-500">Enable</span>
          <input
            type="checkbox"
            checked={sizeGuide.enabled}
            onChange={e => handleToggle(e.target.checked)}
            className="w-4 h-4 accent-black"
          />
        </label>
      </div>

      {sizeGuide.enabled && (
        <>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
              Link Text (on product page)
            </label>
            <input
              type="text"
              value={sizeGuide.linkText || ''}
              onChange={e => handleLinkTextChange(e.target.value)}
              className="w-full max-w-sm border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[10px] uppercase tracking-widest text-gray-500">
                Size Guide Table
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={addColumn}
                  className="text-[10px] uppercase tracking-widest flex items-center gap-1 hover:underline text-black font-bold"
                >
                  + Add Column
                </button>
                <button
                  type="button"
                  onClick={addRow}
                  className="text-[10px] uppercase tracking-widest flex items-center gap-1 hover:underline text-black font-bold"
                >
                  + Add Row
                </button>
              </div>
            </div>

            <div className="border border-black/20 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-500 border-b border-black/10">
                  <tr>
                    {sizeGuide.columns?.map((col, colIndex) => (
                      <th
                        key={colIndex}
                        className="p-0 border-r border-black/10 text-center relative group min-w-[120px]"
                      >
                        {col === 'Size' ? (
                          <div className="py-2 px-3 w-full h-full text-center font-bold text-gray-500">
                            {col}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-full h-full relative">
                            <input
                              type="text"
                              value={col}
                              onChange={e => handleRenameColumn(colIndex, e.target.value)}
                              className="bg-transparent w-full text-center py-2 pl-3 pr-8 focus:outline-none focus:bg-white text-[10px] uppercase tracking-widest font-bold text-gray-500 transition-colors"
                              placeholder="COLUMN NAME"
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteColumn(colIndex, col)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 z-10"
                              title="Delete Column"
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </th>
                    ))}
                    <th className="px-3 py-2 w-10 text-center"></th>
                  </tr>
                </thead>
                <tbody>
                  {(sizeGuide.table || []).map((row, index) => (
                    <tr
                      key={row.id || index}
                      className="border-b border-black/5 last:border-0 hover:bg-gray-50 transition-colors"
                    >
                      {sizeGuide.columns?.map(col => (
                        <td key={col} className="p-0 border-r border-black/5">
                          <input
                            type="text"
                            value={row[col] || ''}
                            onChange={e => handleCellChange(index, col, e.target.value)}
                            className={`w-full p-2 focus:outline-none focus:bg-white text-center ${
                              col === 'Size' ? 'font-bold' : ''
                            }`}
                            placeholder={col === 'Size' ? 'e.g. XS' : ''}
                          />
                        </td>
                      ))}
                      <td className="p-0 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(row.id)}
                          className="text-gray-400 hover:text-red-500 p-2 w-full h-full flex items-center justify-center transition-colors"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(!sizeGuide.table || sizeGuide.table.length === 0) && (
                    <tr>
                      <td
                        colSpan={(sizeGuide.columns?.length || 0) + 1}
                        className="px-3 py-4 text-center text-xs text-gray-500"
                      >
                        No size records added.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
              Bottom Note (Optional)
            </label>
            <input
              type="text"
              value={sizeGuide.note || ''}
              onChange={e => handleNoteChange(e.target.value)}
              className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black italic text-gray-600"
              placeholder="e.g. Note: This is a placeholder size guide..."
            />
          </div>
        </>
      )}
    </div>
  );
}
