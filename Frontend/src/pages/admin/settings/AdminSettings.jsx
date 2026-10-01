import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';
import { useSiteSettingsStore } from '../../../store/siteSettingsStore';
import { useAuthStore } from '../../../store/authStore';
import { toast } from 'sonner';

import GlobalSizesManager from './components/GlobalSizesManager';
import GlobalBadgesManager from './components/GlobalBadgesManager';
import SizePresetShortcutsManager from './components/SizePresetShortcutsManager';
import GeneralStoreSettings from './components/GeneralStoreSettings';
import LoyaltySettingsEditor from './components/LoyaltySettingsEditor';

export default function AdminSettings() {
  const {
    globalSizes = [],
    setGlobalSizes,
    globalBadges = [],
    setGlobalBadges,
    sizeClasses = [],
    reloadSizeClasses
  } = useAdmin();
  const settings = useSiteSettingsStore();
  const { token } = useAuthStore();

  // General settings local state
  const [storeName, setStoreName] = useState(settings.storeName || 'UNDERPURE');
  const [logo, setLogo] = useState(settings.logo || '');
  const [metaTitle, setMetaTitle] = useState(settings.metaTitle || 'Underpure - Luxury Lingerie');
  const [favicon, setFavicon] = useState(settings.favicon || '');
  const [contactEmail, setContactEmail] = useState(settings.contactEmail || '');
  const [contactPhone, setContactPhone] = useState(settings.contactPhone || '');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(settings.freeShippingThreshold || 5000);

  // Loyalty Settings
  const defaultLoyalty = settings.loyaltySettings || {
    signupBonus: 200,
    pointsPerSpend: 10,
    spendUnit: 1000,
    redemptionRatio: 0.1,
    birthdayBonus: 500,
    tier2Threshold: 500,
    tier3Threshold: 1000,
  };
  const [signupBonus, setSignupBonus] = useState(defaultLoyalty.signupBonus);
  const [pointsPerSpend, setPointsPerSpend] = useState(defaultLoyalty.pointsPerSpend);
  const [spendUnit, setSpendUnit] = useState(defaultLoyalty.spendUnit);
  const [redemptionRatio, setRedemptionRatio] = useState(defaultLoyalty.redemptionRatio);
  const [birthdayBonus, setBirthdayBonus] = useState(defaultLoyalty.birthdayBonus || 500);
  const [tier2Threshold, setTier2Threshold] = useState(defaultLoyalty.tier2Threshold ?? 500);
  const [tier3Threshold, setTier3Threshold] = useState(defaultLoyalty.tier3Threshold ?? 1000);
  const [tier4Threshold, setTier4Threshold] = useState(defaultLoyalty.tier4Threshold ?? 2000);
  const [tier5Threshold, setTier5Threshold] = useState(defaultLoyalty.tier5Threshold ?? 5000);

  useEffect(() => {
    if (settings._loaded) {
      if (Array.isArray(settings.globalSizes)) {
        setGlobalSizes(settings.globalSizes);
      }
      setStoreName(settings.storeName || 'UNDERPURE');
      setLogo(settings.logo || '');
      setMetaTitle(settings.metaTitle || 'Underpure - Luxury Lingerie');
      setFavicon(settings.favicon || '');
      setContactEmail(settings.contactEmail || '');
      setContactPhone(settings.contactPhone || '');
      setFreeShippingThreshold(settings.freeShippingThreshold || 5000);

      if (settings.loyaltySettings) {
        setSignupBonus(settings.loyaltySettings.signupBonus);
        setPointsPerSpend(settings.loyaltySettings.pointsPerSpend);
        setSpendUnit(settings.loyaltySettings.spendUnit);
        setRedemptionRatio(settings.loyaltySettings.redemptionRatio);
        setBirthdayBonus(settings.loyaltySettings.birthdayBonus || 500);
        setTier2Threshold(settings.loyaltySettings.tier2Threshold ?? 500);
        setTier3Threshold(settings.loyaltySettings.tier3Threshold ?? 1000);
        setTier4Threshold(settings.loyaltySettings.tier4Threshold ?? 2000);
        setTier5Threshold(settings.loyaltySettings.tier5Threshold ?? 5000);
      }
    }
  }, [
    settings._loaded,
    settings.storeName,
    settings.metaTitle,
    settings.contactEmail,
    settings.contactPhone,
    settings.freeShippingThreshold,
    settings.favicon,
    settings.loyaltySettings,
    settings.globalSizes,
    setGlobalSizes,
  ]);

  const handleSaveAll = async () => {
    try {
      await settings.updateSettings(
        {
          storeName,
          logo: favicon || logo,
          metaTitle,
          favicon,
          contactEmail,
          contactPhone,
          freeShippingThreshold: Number(freeShippingThreshold),
          globalSizes,
          loyaltySettings: {
            signupBonus: Number(signupBonus),
            pointsPerSpend: Number(pointsPerSpend),
            spendUnit: Number(spendUnit),
            redemptionRatio: Number(redemptionRatio),
            birthdayBonus: Number(birthdayBonus),
            tier2Threshold: Number(tier2Threshold),
            tier3Threshold: Number(tier3Threshold),
            tier4Threshold: Number(tier4Threshold),
            tier5Threshold: Number(tier5Threshold),
          },
        },
        token
      );
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl mb-2 text-black">Settings</h1>
          <p className="text-gray-500 text-sm tracking-widest uppercase">
            Store preferences and global configuration
          </p>
        </div>
        <button
          onClick={handleSaveAll}
          className="bg-black text-white px-6 py-2.5 uppercase tracking-[0.1em] text-[13px] hover:bg-gray-800 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer"
        >
          <Save size={16} />
          Save Changes
        </button>
      </div>

      <div className="bg-white border border-black/10 p-6 md:p-8 space-y-12">
        {/* Product Attributes (Sizes, Badges & Size Presets) */}
        <section>
          <h2 className="font-serif text-xl mb-4 border-b border-black/10 pb-2">
            Global Product Attributes
          </h2>
          <p className="text-xs text-gray-500 mb-6 tracking-widest uppercase">
            Manage the options available when creating products.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <GlobalSizesManager
              globalSizes={globalSizes}
              setGlobalSizes={setGlobalSizes}
            />
            <GlobalBadgesManager
              globalBadges={globalBadges}
              setGlobalBadges={setGlobalBadges}
              token={token}
            />
          </div>

          <SizePresetShortcutsManager
            globalSizes={globalSizes}
            sizeClasses={sizeClasses}
            reloadSizeClasses={reloadSizeClasses}
            token={token}
          />
        </section>

        {/* General Settings */}
        <GeneralStoreSettings
          storeName={storeName}
          setStoreName={setStoreName}
          metaTitle={metaTitle}
          setMetaTitle={setMetaTitle}
          favicon={favicon}
          setFavicon={setFavicon}
          setLogo={setLogo}
          contactEmail={contactEmail}
          setContactEmail={setContactEmail}
          contactPhone={contactPhone}
          setContactPhone={setContactPhone}
          freeShippingThreshold={freeShippingThreshold}
          setFreeShippingThreshold={setFreeShippingThreshold}
        />

        {/* Loyalty Point Settings */}
        <LoyaltySettingsEditor
          signupBonus={signupBonus}
          setSignupBonus={setSignupBonus}
          pointsPerSpend={pointsPerSpend}
          setPointsPerSpend={setPointsPerSpend}
          spendUnit={spendUnit}
          setSpendUnit={setSpendUnit}
          redemptionRatio={redemptionRatio}
          setRedemptionRatio={setRedemptionRatio}
          birthdayBonus={birthdayBonus}
          setBirthdayBonus={setBirthdayBonus}
          tier2Threshold={tier2Threshold}
          setTier2Threshold={setTier2Threshold}
          tier3Threshold={tier3Threshold}
          setTier3Threshold={setTier3Threshold}
          tier4Threshold={tier4Threshold}
          setTier4Threshold={setTier4Threshold}
          tier5Threshold={tier5Threshold}
          setTier5Threshold={setTier5Threshold}
        />
      </div>
    </div>
  );
}
