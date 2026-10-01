import React, { useState, useEffect } from "react";
import { useSiteSettingsStore, DEFAULTS } from "../../../../store/siteSettingsStore";
import { useAuthStore } from "../../../../store/authStore";
import { toast } from "sonner";

import ReturnsTabHeader from "./components/ReturnsTabHeader";
import ReturnsBannerSection from "./components/ReturnsBannerSection";
import ReturnsPolicyContentSection from "./components/ReturnsPolicyContentSection";
import ReturnsBoutiqueSection from "./components/ReturnsBoutiqueSection";
import ReturnsEuWithdrawalSection from "./components/ReturnsEuWithdrawalSection";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost/backend";

export default function ReturnsTab() {
  const { token } = useAuthStore();
  const settings = useSiteSettingsStore();
  const updateSettings = useSiteSettingsStore((s) => s.updateSettings);

  const [d, setD] = useState(settings.returnsData || DEFAULTS.returnsData);

  useEffect(() => {
    if (settings._loaded && settings.returnsData) {
      setD(settings.returnsData);
    }
  }, [settings._loaded]);

  const update = (patch) => setD((prev) => ({ ...prev, ...patch }));

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`${API_BASE_URL}/upload/image?folder=returns`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url;
  };

  const handleSaveToBackend = async () => {
    try {
      await updateSettings({ returnsData: d }, token);
      toast.success("Returns & Exchanges page saved!");
    } catch {
      toast.error("Failed to save returns settings");
    }
  };

  return (
    <div className="space-y-6">
      <ReturnsTabHeader onSave={handleSaveToBackend} />

      <ReturnsBannerSection
        data={d}
        onUpdate={update}
        onUploadImage={uploadImage}
      />

      <ReturnsPolicyContentSection
        data={d}
        onUpdate={update}
      />

      <ReturnsBoutiqueSection
        data={d}
        onUpdate={update}
      />

      <ReturnsEuWithdrawalSection
        data={d}
        onUpdate={update}
      />
    </div>
  );
}
