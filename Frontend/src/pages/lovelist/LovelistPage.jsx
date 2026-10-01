import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useSiteSettingsStore, DEFAULTS } from '../../store/siteSettingsStore';
import { useProductStore } from '../../store/productStore';
import { toast } from 'sonner';

import LovelistHeader from './components/LovelistHeader';
import LovelistGrid from './components/LovelistGrid';
import LovelistRecommendations from './components/LovelistRecommendations';
import GuestModal from './components/GuestModal';
import SharePromptModal from './components/SharePromptModal';
import EmailShareModal from './components/EmailShareModal';

export default function LovelistPage({ addToCart }) {
  const lovelistData = useSiteSettingsStore((s) => s.lovelistData);
  const pageConfig = lovelistData || DEFAULTS.lovelistData || {};
  const { user, isAuthenticated } = useAuthStore();
  const { products = [] } = useProductStore();

  const [activeTab, setActiveTab] = useState('lovelist');
  const [showGuestPopup, setShowGuestPopup] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [showEmailSharePopup, setShowEmailSharePopup] = useState(false);
  const [lovelistItems, setLovelistItems] = useState([]);
  const [isLovelistLoading, setIsLovelistLoading] = useState(false);

  const [shareSender, setShareSender] = useState('');
  const [shareRecipient, setShareRecipient] = useState('');
  const [shareMessage, setShareMessage] = useState('');

  const [savedItems, setSavedItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('underpure_saved_items') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (user && !shareSender) {
      setShareSender(user.name || user.first_name || user.email?.split('@')[0] || '');
    }
  }, [user]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchLovelist = async () => {
    if (!isAuthenticated) {
      setLovelistItems([]);
      return;
    }
    setIsLovelistLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost/backend'}/wishlist`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        }
      );
      const data = await res.json();
      setLovelistItems(Array.isArray(data) ? data : []);
    } catch {
      setLovelistItems([]);
    } finally {
      setIsLovelistLoading(false);
    }
  };

  useEffect(() => {
    fetchLovelist();
  }, [isAuthenticated]);

  const removeFromLovelist = async (productId) => {
    if (!isAuthenticated) {
      setLovelistItems((prev) =>
        prev.filter((p) => p.id !== productId && p.product_id !== productId)
      );
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost/backend'}/wishlist/${productId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        }
      );
      if (!res.ok) throw new Error('Failed to remove from lovelist');
      fetchLovelist();
      toast.success('Removed from lovelist');
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromSaved = (id) => {
    setSavedItems((prev) => {
      const updated = prev.filter((p) => (p.id || p.product_id) !== id);
      localStorage.setItem('underpure_saved_items', JSON.stringify(updated));
      return updated;
    });
    toast.success('Removed from saved items');
  };

  const handleClearLovelist = () => {
    setLovelistItems([]);
  };

  const handleMoveAllSavedToCart = () => {
    if (addToCart && savedItems.length > 0) {
      savedItems.forEach((item) => addToCart(item.product || item));
      setSavedItems([]);
      localStorage.removeItem('underpure_saved_items');
      toast.success('Moved all saved items to cart!');
    }
  };

  const handleShareClick = () => {
    if (isAuthenticated) {
      setShowEmailSharePopup(true);
    } else {
      setShowSharePopup(true);
    }
  };

  const handleAddToCartItem = (item) => {
    if (addToCart) {
      addToCart(item.product || item);
      if (activeTab === 'saved') {
        removeFromSaved(item.product_id || item.id);
      }
      toast.success('Added to cart!');
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#33363f] relative">
      <div className="max-w-[1490px] mx-auto px-4 md:px-12 pt-5">
        {/* Header with Title, User Identity, Tabs, and Action Bar */}
        <LovelistHeader
          pageConfig={pageConfig}
          user={user}
          isAuthenticated={isAuthenticated}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onGuestClick={() => setShowGuestPopup(true)}
          onShareClick={handleShareClick}
          onClearLovelist={handleClearLovelist}
          onMoveAllSavedToCart={handleMoveAllSavedToCart}
          savedItemsCount={savedItems.length}
        />

        {/* Content Area Grid / Empty State */}
        <div className="w-full md:w-[85%] mx-auto">
          <LovelistGrid
            activeTab={activeTab}
            items={activeTab === 'lovelist' ? lovelistItems : savedItems}
            pageConfig={pageConfig}
            onRemove={activeTab === 'lovelist' ? removeFromLovelist : removeFromSaved}
            onAddToCart={handleAddToCartItem}
          />
        </div>
      </div>

      {/* Selected For You / Recommendations */}
      <LovelistRecommendations
        recommendationsConfig={pageConfig.recommendations}
        products={products}
        onAddToCart={handleAddToCartItem}
        quickShopButtonText={pageConfig.buttons?.quickShop}
      />

      {/* Guest User Popup Modal */}
      <GuestModal
        isOpen={showGuestPopup}
        onClose={() => setShowGuestPopup(false)}
        guestPopupConfig={pageConfig.guestPopup}
      />

      {/* Share Prompt Popup Modal */}
      <SharePromptModal
        isOpen={showSharePopup}
        onClose={() => setShowSharePopup(false)}
        sharePopupConfig={pageConfig.sharePopup}
      />

      {/* Email & Social Share Popup Modal */}
      <EmailShareModal
        isOpen={showEmailSharePopup}
        onClose={() => setShowEmailSharePopup(false)}
        emailShareConfig={pageConfig.emailShare}
        shareSender={shareSender}
        setShareSender={setShareSender}
        shareRecipient={shareRecipient}
        setShareRecipient={setShareRecipient}
        shareMessage={shareMessage}
        setShareMessage={setShareMessage}
      />
    </div>
  );
}
