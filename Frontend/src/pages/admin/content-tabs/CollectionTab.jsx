import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useSiteSettingsStore } from '../../../store/siteSettingsStore';
import { useAuthStore } from '../../../store/authStore';
import { useCategoryStore } from '../../../store/categoryStore';
import { toast } from 'sonner';

export default function CollectionTab() {
  const { token } = useAuthStore();
  const settings = useSiteSettingsStore();
  const { categories } = useCategoryStore();
  
  const [data, setData] = useState(settings.collectionSettings);

  useEffect(() => {
    if (settings._loaded && settings.collectionSettings) {
      setData({
        ...settings.collectionSettings,
        customTabTitles: settings.collectionSettings.customTabTitles || {}
      });
    }
  }, [settings._loaded, settings.collectionSettings]);

  const handleSave = async () => {
    try {
      await settings.updateSettings({ collectionSettings: data }, token);
      toast.success('Collection settings saved globally!');
    } catch (err) {
      toast.error('Failed to save settings');
    }
  };

  const toggleFilter = (filterName) => {
    setData(prev => {
      const filters = prev.filtersToShow.includes(filterName) 
        ? prev.filtersToShow.filter(f => f !== filterName)
        : [...prev.filtersToShow, filterName];
      return { ...prev, filtersToShow: filters };
    });
  };

  return (
    <div className="bg-white border border-black/10 p-6 space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 border-b border-black/10 pb-3">
        <div>
          <h2 className="font-serif text-xl">Collection / Category Page</h2>
          <p className="text-xs text-gray-500 tracking-wider">Control the layout, banners, filters, and appearance of collection listing pages.</p>
        </div>
        <button onClick={handleSave} className="bg-black text-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-gray-800 flex items-center gap-2">
          <Save size={14} /> Save Collection Settings
        </button>
      </div>

      {/* 1. Top Banner Settings */}
      <section className="space-y-4 border border-black/10 p-5">
        <h3 className="text-sm uppercase tracking-widest font-bold border-b border-black/10 pb-2 mb-4">1. Collection Banner Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Category Banner Height</label>
              <select value={data.bannerConfig.height} onChange={e => setData({...data, bannerConfig: {...data.bannerConfig, height: e.target.value}})} className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black">
                <option value="small">Small (200px)</option>
                <option value="medium">Medium (350px)</option>
                <option value="large">Large (500px)</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Banner Title Placeholder</label>
              <input type="text" value={data.bannerConfig.title} onChange={e => setData({...data, bannerConfig: {...data.bannerConfig, title: e.target.value}})} className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black font-serif" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Banner Description Text</label>
              <input type="text" value={data.bannerConfig.description} onChange={e => setData({...data, bannerConfig: {...data.bannerConfig, description: e.target.value}})} className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Layout & Sorting */}
      <section className="space-y-4 border border-black/10 p-5">
        <h3 className="text-sm uppercase tracking-widest font-bold border-b border-black/10 pb-2 mb-4">2. Layout & Interactions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Default Layout</label>
          <select value={data.defaultLayout} onChange={e => setData({...data, defaultLayout: e.target.value})} className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black">
            <option value="grid-3">3-Column Grid</option>
            <option value="grid-4">4-Column Grid</option>
            <option value="grid-2">2-Column Grid</option>
            <option value="list">List View</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Products Per Page</label>
          <input type="number" value={data.productsPerPage} onChange={e => setData({...data, productsPerPage: parseInt(e.target.value) || 24})} className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black" />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Sort Default</label>
          <select value={data.defaultSort} onChange={e => setData({...data, defaultSort: e.target.value})} className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black">
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="best-selling">Best Selling</option>
          </select>
        </div>
          <div className="md:col-span-2 mt-4">
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold border-b border-black/10 pb-2">Custom Sort Option Names</label>
            <div className="grid grid-cols-2 gap-4 mt-3">
              {data.sortOptions.map(opt => (
                <div key={opt.id}>
                  <label className="block text-[9px] uppercase tracking-widest text-gray-400 mb-1">{opt.id} text</label>
                  <input 
                    type="text" 
                    value={opt.name} 
                    onChange={e => setData({...data, sortOptions: data.sortOptions.map(x => x.id === opt.id ? {...x, name: e.target.value} : x)})}
                    className="w-full border border-black/20 p-2 text-sm focus:outline-none focus:border-black" 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Filters & Text */}
      <section className="space-y-4 border border-black/10 p-5">
        <h3 className="text-sm uppercase tracking-widest font-bold border-b border-black/10 pb-2 mb-4">3. Filters & Text Labels</h3>
        <div>
        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Filters to Show</label>
        <div className="flex flex-wrap gap-2">
          {['Size', 'Color', 'Price Range', 'Category', 'Availability', 'Material', 'Style'].map((filter) => (
            <label key={filter} className="flex items-center gap-2 px-3 py-1.5 border border-black/10 cursor-pointer hover:border-black/30 transition-colors">
              <input type="checkbox" checked={data.filtersToShow.includes(filter)} onChange={() => toggleFilter(filter)} className="w-3.5 h-3.5 accent-black" />
              <span className="text-[10px] uppercase tracking-widest">{filter}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={data.showQuickViewOnHover} onChange={e => setData({...data, showQuickViewOnHover: e.target.checked})} className="w-4 h-4 accent-black" />
          <span className="text-sm uppercase tracking-widest">Show Product Quick View on Hover</span>
        </label>
      </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Quick Shop Button Text</label>
            <input type="text" value={data.quickShopText} onChange={e => setData({...data, quickShopText: e.target.value})} className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest" />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Empty Collection Message</label>
            <input type="text" value={data.emptyMessage} onChange={e => setData({...data, emptyMessage: e.target.value})} className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black" />
          </div>
        </div>
      </section>

      {/* 4. Custom Tab Titles */}
      <section className="space-y-4 border border-black/10 p-5 bg-gray-50">
        <h3 className="text-sm uppercase tracking-widest font-bold border-b border-black/10 pb-2 mb-4">4. Custom Tab Titles (SEO)</h3>
        <p className="text-xs text-gray-500 mb-4">
          Category Tab Titles are now managed globally! Please go to the <strong>Categories</strong> tab on the left sidebar to set the SEO Tab Title for each individual category.
        </p>
      </section>
    </div>
  );
}

