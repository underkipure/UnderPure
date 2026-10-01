import React, { useState, useEffect } from 'react';
import { useSiteSettingsStore, DEFAULTS } from '../../../../store/siteSettingsStore';
import { toast } from 'sonner';

import CheckoutHeader from './components/CheckoutHeader';
import CheckoutNavTabs from './components/CheckoutNavTabs';
import CheckoutGeneralTab from './components/CheckoutGeneralTab';
import CheckoutPaymentTab from './components/CheckoutPaymentTab';
import CheckoutDialogsTab from './components/CheckoutDialogsTab';

export default function CheckoutTab() {
  const { checkoutSettings, shippingRates, updateSettings, contactEmail, contactPhone } = useSiteSettingsStore();
  const [formData, setFormData] = useState({ ...DEFAULTS.checkoutSettings, ...checkoutSettings });
  const [shippingRate, setShippingRate] = useState({ name: 'Standard Courier', price: 2865, minDays: 5, maxDays: 7 });
  const [globalContactEmail, setGlobalContactEmail] = useState(
    typeof contactEmail === 'string' ? contactEmail : ''
  );
  const [globalContactPhone, setGlobalContactPhone] = useState(
    typeof contactPhone === 'string' ? contactPhone : ''
  );
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general'); // 'general', 'payment', 'dialogs'
  const [selectedDialog, setSelectedDialog] = useState('refund');

  useEffect(() => {
    if (checkoutSettings) {
      setFormData({ ...DEFAULTS.checkoutSettings, ...checkoutSettings });
    }
    if (shippingRates && shippingRates.length > 0) {
      setShippingRate(shippingRates[0]);
    }
    if (typeof contactEmail === 'string') {
      setGlobalContactEmail(contactEmail);
    }
    if (typeof contactPhone === 'string') {
      setGlobalContactPhone(contactPhone);
    }
  }, [checkoutSettings, shippingRates, contactEmail, contactPhone]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('auth_token');
      await updateSettings({ 
        checkoutSettings: formData,
        shippingRates: [shippingRate],
        contactEmail: globalContactEmail,
        contactPhone: globalContactPhone
      }, token);
      toast.success('Checkout settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update checkout settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border border-black/10 p-6 space-y-8 max-w-5xl">
      <CheckoutHeader handleSave={handleSave} isSaving={isSaving} />

      {/* Sub-tabs */}
      <CheckoutNavTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* TAB 1: GENERAL & SIDEBAR */}
      {activeTab === 'general' && (
        <CheckoutGeneralTab
          formData={formData}
          setFormData={setFormData}
          shippingRate={shippingRate}
          setShippingRate={setShippingRate}
          globalContactEmail={globalContactEmail}
          setGlobalContactEmail={setGlobalContactEmail}
          globalContactPhone={globalContactPhone}
          setGlobalContactPhone={setGlobalContactPhone}
        />
      )}

      {/* TAB 2: SHIPPING PROTECTION & PAYMENT */}
      {activeTab === 'payment' && (
        <CheckoutPaymentTab
          formData={formData}
          setFormData={setFormData}
        />
      )}

      {/* TAB 3: FOOTER LINKS & DIALOGS */}
      {activeTab === 'dialogs' && (
        <CheckoutDialogsTab
          formData={formData}
          setFormData={setFormData}
          selectedDialog={selectedDialog}
          setSelectedDialog={setSelectedDialog}
          globalContactEmail={globalContactEmail}
          globalContactPhone={globalContactPhone}
        />
      )}
    </div>
  );
}
