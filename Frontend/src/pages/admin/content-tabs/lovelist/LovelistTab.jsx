import React, { useState, useEffect } from "react";
import { useSiteSettingsStore, DEFAULTS } from "../../../../store/siteSettingsStore";
import { useAuthStore } from "../../../../store/authStore";
import { useAdmin } from "../../../../context/AdminContext";
import { toast } from "sonner";
import LovelistHeader from "./components/LovelistHeader";
import LovelistGeneralSettings from "./components/LovelistGeneralSettings";
import LovelistTabsSettings from "./components/LovelistTabsSettings";
import LovelistButtonsSettings from "./components/LovelistButtonsSettings";
import LovelistEmptyStates from "./components/LovelistEmptyStates";
import LovelistRecommendationsSettings from "./components/LovelistRecommendationsSettings";
import LovelistPopupsSettings from "./components/LovelistPopupsSettings";

export default function LovelistTab() {
  const { token } = useAuthStore();
  const settings = useSiteSettingsStore();
  const { products: availableProducts = [] } = useAdmin();
  const updateSettings = useSiteSettingsStore((s) => s.updateSettings);

  const [d, setD] = useState(settings.lovelistData || DEFAULTS.lovelistData);

  useEffect(() => {
    if (settings._loaded && settings.lovelistData) {
      setD(settings.lovelistData);
    }
  }, [settings._loaded]);

  const update = (patch) => setD((prev) => ({ ...prev, ...patch }));

  const handleSave = async () => {
    await updateSettings({ lovelistData: d }, token);
    toast.success("Lovelist page content saved!");
  };

  return (
    <div className="bg-white border border-black/10 p-4 sm:p-6 space-y-6 sm:space-y-8 max-w-4xl mx-auto">
      <LovelistHeader handleSave={handleSave} />
      <LovelistGeneralSettings d={d} update={update} />
      <LovelistTabsSettings d={d} update={update} />
      <LovelistButtonsSettings d={d} update={update} />
      <LovelistEmptyStates d={d} update={update} />
      <LovelistRecommendationsSettings
        d={d}
        update={update}
        availableProducts={availableProducts}
      />
      <LovelistPopupsSettings d={d} update={update} />
    </div>
  );
}
