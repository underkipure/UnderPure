import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useSiteSettingsStore, DEFAULTS } from '../../../../store/siteSettingsStore';
import { fetchProducts, fetchCategories } from '../../../../lib/api';
import { toast } from 'sonner';

import CartGeneralSettings from './components/CartGeneralSettings';
import CartFreeShippingBar from './components/CartFreeShippingBar';
import CartGiftingBanner from './components/CartGiftingBanner';
import CartDiscoverSection from './components/CartDiscoverSection';
import CartRecommendationsSection from './components/CartRecommendationsSection';
import CartLoyaltyBanner from './components/CartLoyaltyBanner';
import CartPoliciesSection from './components/CartPoliciesSection';

export default function CartTab() {
  const { cartSettings, updateSettings } = useSiteSettingsStore();
  const [isSaving, setIsSaving] = useState(false);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const [prodRes, catRes] = await Promise.all([
          fetchProducts(token),
          fetchCategories(token)
        ]);
        setAvailableProducts(prodRes.products || []);
        setAvailableCategories(catRes.categories || []);
      } catch (err) {
        console.error("Failed to load dependency data for cart settings", err);
      }
    };
    loadData();
  }, []);

  // Initialize with fallback to prevent undefined errors before effect runs
  const [basic, setBasic] = useState(cartSettings?.basic || DEFAULTS.cartSettings.basic || {
    title: 'Your bag',
    emptyMessage: 'Your bag is empty.',
    checkoutText: 'CONTINUE TO CHECKOUT',
    viewBagText: 'VIEW BAG',
    subtotalText: 'Subtotal',
    removeText: 'Remove',
    taxShippingText: 'Taxes and shipping calculated at checkout',
    shippingNotice: 'Free Shipping on U.S. Orders Rs. 195+ and easy returns. Some items may ship separately.'
  });

  const [shippingBar, setShippingBar] = useState(cartSettings?.shippingBar || DEFAULTS.cartSettings.shippingBar || {
    enabled: true,
    threshold: 250,
    awayMessage: "You're $X away from free shipping!",
    achievedMessage: "You've unlocked free shipping!",
    progressColor: '#000000',
    backgroundColor: '#e5e7eb'
  });

  const [gifting, setGifting] = useState(cartSettings?.gifting || DEFAULTS.cartSettings.gifting || {
    enabled: true,
    title: 'Gifting a lover?',
    description: 'Make it extra special with an UnderPure gift box.',
    image: '',
    products: [
      { id: 1, name: 'HEART', price: 28 },
      { id: 2, name: 'STANDARD', price: 15 }
    ]
  });

  const [discover, setDiscover] = useState(cartSettings?.discover || DEFAULTS.cartSettings.discover || {
    enabled: true,
    title: 'Discover new in lingerie, clothing and other exclusive styles.',
    collections: []
  });

  const [crossSells, setCrossSells] = useState(cartSettings?.crossSells || {
    enabled: true,
    title: 'Pairs Well With'
  });

  const [recommendations, setRecommendations] = useState(cartSettings?.recommendations || {
    enabled: true,
    title: '',
    mode: 'auto',
    limit: 4,
    customProducts: []
  });

  const [loyaltyBanner, setLoyaltyBanner] = useState(cartSettings?.loyaltyBanner || {
    enabled: true,
    title: 'UnderPure Rewards',
    description: 'Join our loyalty program to access exclusive benefits and earn UnderPure Coins every time you shop.',
    buttonText: 'SIGN UP',
    footerText: 'Already a member? Log in'
  });

  const [policies, setPolicies] = useState(cartSettings?.policies || {
    enabled: true,
    title: 'Our Policies'
  });

  useEffect(() => {
    if (cartSettings) {
      if (cartSettings.basic) setBasic(cartSettings.basic);
      if (cartSettings.shippingBar) setShippingBar(cartSettings.shippingBar);
      if (cartSettings.gifting) setGifting(cartSettings.gifting);
      if (cartSettings.discover) setDiscover(cartSettings.discover);
      if (cartSettings.crossSells) setCrossSells(cartSettings.crossSells);
      if (cartSettings.recommendations) setRecommendations(cartSettings.recommendations);
      if (cartSettings.loyaltyBanner) setLoyaltyBanner(cartSettings.loyaltyBanner);
      if (cartSettings.policies) setPolicies(cartSettings.policies);
    }
  }, [cartSettings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('auth_token');
      await updateSettings({
        cartSettings: {
          basic,
          shippingBar: { ...shippingBar, threshold: Number(shippingBar.threshold) },
          gifting,
          discover,
          crossSells,
          recommendations,
          loyaltyBanner,
          policies
        }
      }, token);
      toast.success('Cart settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update cart settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show temporary preview
    const localUrl = URL.createObjectURL(file);
    setGifting({ ...gifting, image: localUrl });

    try {
      toast.info('Uploading image...');
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost/backend'}/upload/image?folder=cart_media`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const json = await res.json();
      setGifting(prev => ({ ...prev, image: json.url }));
      toast.success('Image uploaded successfully');
    } catch (err) {
      toast.error('Image upload failed');
    } finally {
      URL.revokeObjectURL(localUrl);
    }
  };

  const [uploadingCollectionIndex, setUploadingCollectionIndex] = useState(null);

  const handleCollectionImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingCollectionIndex(index);
    const localUrl = URL.createObjectURL(file);

    // Show temporary preview
    setDiscover(prev => {
      const newCols = [...(prev.collections || [])];
      newCols[index] = { ...newCols[index], image: localUrl };
      return { ...prev, collections: newCols };
    });

    try {
      toast.info('Uploading image to Cloudinary...');
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost/backend'}/upload/image?folder=cart_discover`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const json = await res.json();
      setDiscover(prev => {
        const newCols = [...(prev.collections || [])];
        newCols[index] = { ...newCols[index], image: json.url };
        return { ...prev, collections: newCols };
      });
      toast.success('Image uploaded to Cloudinary successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Image upload failed');
    } finally {
      URL.revokeObjectURL(localUrl);
      setUploadingCollectionIndex(null);
    }
  };

  return (
    <div className="bg-white border border-black/10 p-6 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-end gap-4 border-b border-black/10 pb-3">
        <div>
          <h2 className="font-serif text-2xl">Cart Drawer Editor</h2>
          <p className="text-xs text-gray-500 tracking-wider mt-2">
            Fully control every section, text, and banner within the cart drawer.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-black text-white px-6 py-2.5 uppercase tracking-[0.1em] text-[10px] hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <Save size={14} />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* 1. Basic Cart Settings */}
      <CartGeneralSettings basic={basic} onChange={setBasic} />

      {/* 1.5 Free Shipping Bar */}
      <CartFreeShippingBar shippingBar={shippingBar} onChange={setShippingBar} />

      {/* 2. Gifting Box Section */}
      <CartGiftingBanner
        gifting={gifting}
        onChange={setGifting}
        availableProducts={availableProducts}
        onImageUpload={handleImageUpload}
      />

      {/* 2.5 Discover Section */}
      <CartDiscoverSection
        discover={discover}
        onChange={setDiscover}
        availableCategories={availableCategories}
        uploadingCollectionIndex={uploadingCollectionIndex}
        onCollectionImageUpload={handleCollectionImageUpload}
      />

      {/* 3. Suggested Products Slider (Recommendations) */}
      <CartRecommendationsSection
        recommendations={recommendations}
        onChange={setRecommendations}
        availableProducts={availableProducts}
      />

      {/* 4. Loyalty Banner */}
      <CartLoyaltyBanner loyaltyBanner={loyaltyBanner} onChange={setLoyaltyBanner} />

      {/* 5. Policies Accordion */}
      <CartPoliciesSection policies={policies} onChange={setPolicies} />
    </div>
  );
}
