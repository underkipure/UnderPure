import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useSiteSettingsStore } from '../../../store/siteSettingsStore';
import { useAuthStore } from '../../../store/authStore';
import { toast } from 'sonner';

export default function SizeGuideTab() {
  const { token } = useAuthStore();
  const settings = useSiteSettingsStore();
  
  const [data, setData] = useState({
    enabled: true,
    linkText: 'Size Guide',
    note: 'Note: This is a placeholder size guide. Real images/data can be connected via the admin panel.',
    table: [
        { id: 1, size: 'XS', bust: '32 - 33', waist: '24 - 25', hip: '34 - 35' },
        { id: 2, size: 'S', bust: '34 - 35', waist: '26 - 27', hip: '36 - 37' },
        { id: 3, size: 'M', bust: '36 - 37', waist: '28 - 29', hip: '38 - 39' },
        { id: 4, size: 'L', bust: '38.5 - 40', waist: '30.5 - 32', hip: '40.5 - 42' },
        { id: 5, size: 'XL', bust: '41.5 - 43', waist: '33.5 - 35', hip: '43.5 - 45' }
    ]
  });

  useEffect(() => {
    if (settings._loaded && settings.productDetailSettings?.sizeGuide) {
      const dbData = JSON.parse(JSON.stringify(settings.productDetailSettings.sizeGuide));
      // Migration logic for old data format
      if (!dbData.columns) {
        dbData.columns = ['Size', 'Bust (in)', 'Waist (in)', 'Hip (in)'];
        dbData.table = dbData.table?.map(row => ({
          id: row.id,
          'Size': row.size || '',
          'Bust (in)': row.bust || '',
          'Waist (in)': row.waist || '',
          'Hip (in)': row.hip || ''
        })) || [];
      }
      setData(dbData);
    }
  }, [settings._loaded, settings.productDetailSettings]);

  const handleSave = async () => {
    try {
      const updatedProductDetailSettings = {
        ...settings.productDetailSettings,
        sizeGuide: data
      };
      await settings.updateSettings({ productDetailSettings: updatedProductDetailSettings }, token);
      toast.success('Size Guide settings saved globally!');
    } catch (err) {
      toast.error('Failed to save settings');
    }
  };

  return (
    <div className="bg-white border border-black/10 p-6 space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 border-b border-black/10 pb-3">
        <div>
          <h2 className="font-serif text-xl">Size Guide Configuration</h2>
          <p className="text-xs text-gray-500 tracking-wider">Manage your global size guide settings, tables, and notes.</p>
        </div>
        <button onClick={handleSave} className="bg-black text-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-gray-800 flex items-center gap-2">
          <Save size={14} /> Save Settings
        </button>
      </div>

      <div className="space-y-6 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest">Enable Size Guide</h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-[10px] uppercase tracking-widest text-gray-500">Enable</span>
            <input type="checkbox" checked={data.enabled} onChange={e => setData({...data, enabled: e.target.checked})} className="w-4 h-4 accent-black" />
          </label>
        </div>
        
        {data.enabled && (
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Link Text (on product page)</label>
              <input type="text" value={data.linkText} onChange={e => setData({...data, linkText: e.target.value})} className="w-full max-w-sm border border-black/20 p-3 text-sm focus:outline-none focus:border-black" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] uppercase tracking-widest text-gray-500">Size Guide Table</label>
                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      let baseName = "New Column";
                      let newCol = baseName;
                      let counter = 1;
                      const cols = data.columns || [];
                      while (cols.includes(newCol)) {
                        newCol = `${baseName} ${counter}`;
                        counter++;
                      }
                      setData({
                        ...data,
                        columns: [...cols, newCol]
                      });
                    }}
                    className="text-[10px] uppercase tracking-widest flex items-center gap-1 hover:underline text-black"
                  >
                    + Add Column
                  </button>
                  <button 
                    onClick={() => {
                      const newRow = { id: Date.now() };
                      (data.columns || []).forEach(col => newRow[col] = '');
                      setData({
                        ...data,
                        table: [...(data.table || []), newRow]
                      });
                    }}
                    className="text-[10px] uppercase tracking-widest flex items-center gap-1 hover:underline text-black"
                  >
                    + Add Row
                  </button>
                </div>
              </div>
              
              <div className="border border-black/20 overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-500 border-b border-black/10">
                    <tr>
                      {data.columns?.map((col, colIndex) => (
                        <th key={colIndex} className="p-0 border-r border-black/10 text-center relative group min-w-[120px]">
                          {col === 'Size' ? (
                            <div className="py-3 px-3 w-full h-full text-center font-bold text-gray-500">
                              {col}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center w-full h-full relative">
                              <input 
                                type="text"
                                value={col}
                                onChange={(e) => {
                                  const newCols = [...data.columns];
                                  const oldColName = newCols[colIndex];
                                  const newColName = e.target.value;
                                  
                                  newCols[colIndex] = newColName;
                                  
                                  const newTable = data.table.map(row => {
                                    const newRow = { ...row };
                                    if (newRow[oldColName] !== undefined) {
                                      newRow[newColName] = newRow[oldColName];
                                      delete newRow[oldColName];
                                    }
                                    return newRow;
                                  });
                                  
                                  setData({...data, columns: newCols, table: newTable});
                                }}
                                className="bg-transparent w-full text-center py-3 pl-3 pr-8 focus:outline-none focus:bg-white text-[10px] uppercase tracking-widest font-bold text-gray-500 transition-colors"
                                placeholder="COLUMN NAME"
                              />
                              <button
                                onClick={() => {
                                  const newCols = data.columns.filter((_, i) => i !== colIndex);
                                  const newTable = data.table.map(row => {
                                    const newRow = { ...row };
                                    delete newRow[col];
                                    return newRow;
                                  });
                                  setData({...data, columns: newCols, table: newTable});
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 z-10"
                                title="Delete Column"
                              >
                                ×
                              </button>
                            </div>
                          )}
                        </th>
                      ))}
                      <th className="px-3 py-3 w-10 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.table || []).map((row, index) => (
                      <tr key={row.id} className="border-b border-black/5 last:border-0 hover:bg-gray-50 transition-colors">
                        {data.columns?.map(col => (
                          <td key={col} className="p-0 border-r border-black/5">
                            <input 
                              type="text" 
                              value={row[col] || ''}
                              onChange={e => {
                                const newTable = [...data.table];
                                newTable[index] = { ...newTable[index], [col]: e.target.value };
                                setData({...data, table: newTable});
                              }}
                              className={`w-full p-3 focus:outline-none focus:bg-white text-center ${col === 'Size' ? 'font-bold' : ''}`}
                              placeholder={col === 'Size' ? 'e.g. XS' : ''}
                            />
                          </td>
                        ))}
                        <td className="p-0 text-center">
                          <button 
                            onClick={() => {
                              const newTable = data.table.filter(r => r.id !== row.id);
                              setData({...data, table: newTable});
                            }}
                            className="text-gray-400 hover:text-red-500 p-3 w-full h-full flex items-center justify-center transition-colors"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!data.table || data.table.length === 0) && (
                      <tr>
                        <td colSpan={(data.columns?.length || 0) + 1} className="px-3 py-6 text-center text-xs text-gray-500">No size records added.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Bottom Note (Optional)</label>
              <input 
                type="text" 
                value={data.note || ''} 
                onChange={e => setData({...data, note: e.target.value})} 
                className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black italic text-gray-600" 
                placeholder="e.g. Note: This is a placeholder size guide..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
