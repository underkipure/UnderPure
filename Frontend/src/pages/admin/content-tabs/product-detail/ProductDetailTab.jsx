import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useSiteSettingsStore } from '../../../../store/siteSettingsStore';
import { useAuthStore } from '../../../../store/authStore';
import { useAdmin } from '../../../../context/AdminContext';
import { toast } from 'sonner';

import ProductLayoutButtons from './components/ProductLayoutButtons';
import ProductPerksEditor from './components/ProductPerksEditor';
import ProductAccordionsEditor from './components/ProductAccordionsEditor';
import ProductRecommendationsEditor from './components/ProductRecommendationsEditor';
import ProductReviewsSocial from './components/ProductReviewsSocial';
import ProductSizeGuideEditor from './components/ProductSizeGuideEditor';

export default function ProductDetailTab() {
  const { token } = useAuthStore();
  const settings = useSiteSettingsStore();
  const { categories = [], globalBadges = [] } = useAdmin();
  const safeGlobalBadges = globalBadges || [];

  const [data, setData] = useState(settings.productDetailSettings || {});

  useEffect(() => {
    if (settings._loaded && settings.productDetailSettings) {
      const dbData = JSON.parse(JSON.stringify(settings.productDetailSettings));

      if (!dbData.perks || !Array.isArray(dbData.perks)) {
        dbData.perks = [
          { id: 1, enabled: true, icon: 'Package', text: 'Free shipping on orders over Rs. 195+', link: '/faqs', openModal: '' },
          { id: 2, enabled: true, icon: 'RotateCcw', text: 'Easy Returns', link: '', openModal: 'returns' },
          { id: 3, enabled: true, icon: 'Gift', text: 'Make it a gift with an UnderPure signature gift box', link: '/contact', openModal: '' }
        ];
      }
      if (!dbData.installmentNote) {
        dbData.installmentNote = { enabled: true, provider: 'afterpay', installments: 4, customText: '' };
      }
      if (!dbData.titles) {
        dbData.titles = {
          relatedProducts: 'You May Also Like',
          reviewsHeader: 'Customer Reviews',
          accordionMaterials: 'Materials & Care',
          accordionShipping: 'Shipping Info',
          accordionReturns: 'Returns Info'
        };
      } else {
        dbData.titles = {
          accordionMaterials: 'Materials & Care',
          accordionShipping: 'Shipping Info',
          accordionReturns: 'Returns Info',
          ...dbData.titles
        };
      }
      if (dbData.showSocialShare === undefined) {
        dbData.showSocialShare = true;
      }
      if (!dbData.customAccordions) {
        dbData.customAccordions = [];
      }
      if (dbData.sizeGuide && !dbData.sizeGuide.columns) {
        dbData.sizeGuide.columns = ['Size', 'Bust (in)', 'Waist (in)', 'Hip (in)'];
        dbData.sizeGuide.table = dbData.sizeGuide.table?.map(row => ({
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
      await settings.updateSettings({ productDetailSettings: data }, token);
      toast.success('Product Detail settings saved globally!');
    } catch (err) {
      toast.error('Failed to save settings');
    }
  };

  if (!data || !data.buttonTexts) {
    return <div className="p-6 text-sm text-gray-500">Loading Product Detail Settings...</div>;
  }

  return (
    <div className="bg-white border border-black/10 p-6 space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 border-b border-black/10 pb-3">
        <div>
          <h2 className="font-serif text-xl">Product Detail Page Content</h2>
          <p className="text-xs text-gray-500 tracking-wider">
            Configure perks, payment installment line, accordions, size guide, and layout.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="bg-black text-white px-6 py-2 text-xs uppercase tracking-widest hover:bg-gray-800 flex items-center gap-2"
        >
          <Save size={14} /> Save Settings
        </button>
      </div>

      <div className="space-y-8">
        {/* Layout & Button Texts */}
        <ProductLayoutButtons data={data} onChange={setData} />

        {/* Perks & Features Highlights List */}
        <ProductPerksEditor
          perks={data.perks || []}
          onChange={newPerks => setData({ ...data, perks: newPerks })}
        />

        {/* Accordions Configuration */}
        <ProductAccordionsEditor data={data} onChange={setData} />

        {/* Selected For You, Lover (Recommendations) */}
        <ProductRecommendationsEditor
          data={data}
          onChange={setData}
          categories={categories}
          safeGlobalBadges={safeGlobalBadges}
        />

        {/* Reviews & Social Links */}
        <ProductReviewsSocial data={data} onChange={setData} />

        {/* Size Guide Config */}
        <ProductSizeGuideEditor data={data} onChange={setData} />
      </div>
    </div>
  );
}
