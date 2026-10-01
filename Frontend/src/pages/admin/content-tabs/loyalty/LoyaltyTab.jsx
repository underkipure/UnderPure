import React, { useState, useEffect } from "react";
import {
  useSiteSettingsStore,
  DEFAULTS,
} from "../../../../store/siteSettingsStore";
import { useAuthStore } from "../../../../store/authStore";
import { toast } from "sonner";
import LoyaltyHeader from "./components/LoyaltyHeader";
import LoyaltyBannersHeroEditor from "./components/LoyaltyBannersHeroEditor";
import LoyaltyTiersEditor from "./components/LoyaltyTiersEditor";
import LoyaltyFaqsEditor from "./components/LoyaltyFaqsEditor";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost/backend";

export default function LoyaltyTab() {
  const { token } = useAuthStore();
  const settings = useSiteSettingsStore();
  const updateSettings = useSiteSettingsStore((s) => s.updateSettings);

  const [d, setD] = useState(settings.loyaltyData || DEFAULTS.loyaltyData);

  useEffect(() => {
    if (settings._loaded && settings.loyaltyData) {
      setD(settings.loyaltyData);
    }
  }, [settings._loaded]);

  const update = (patch) => setD((prev) => ({ ...prev, ...patch }));

  // ── Upload helper ──
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`${API_BASE_URL}/upload/image?folder=loyalty`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url;
  };

  const handleSaveToBackend = async () => {
    await updateSettings({ loyaltyData: d }, token);
    toast.success("Loyalty Program page saved!");
  };

  // ── Tiers Logic ──
  const [editingTierId, setEditingTierId] = useState(null);
  const [tierForm, setTierForm] = useState({
    tier: "",
    subtitle: "",
    benefits: [],
    image: "",
  });

  const handleAddTier = () => {
    const newTier = {
      id: Date.now(),
      tier: "NEW TIER",
      subtitle: "",
      benefits: ["Benefit 1"],
      image: "",
    };
    update({ tiers: [...d.tiers, newTier] });
    setEditingTierId(newTier.id);
    setTierForm(newTier);
  };

  const handleSaveTier = () => {
    update({
      tiers: d.tiers.map((t) =>
        t.id === editingTierId ? { ...t, ...tierForm } : t,
      ),
    });
    setEditingTierId(null);
  };

  const handleDeleteTier = (id) =>
    update({ tiers: d.tiers.filter((t) => t.id !== id) });

  // ── FAQs Logic ──
  const [editingFaqId, setEditingFaqId] = useState(null);
  const [faqForm, setFaqForm] = useState({ q: "", a: "" });

  const handleAddFaq = () => {
    const newFaq = { id: Date.now(), q: "New Question", a: "New Answer" };
    update({ faqs: [...d.faqs, newFaq] });
    setEditingFaqId(newFaq.id);
    setFaqForm(newFaq);
  };

  const handleSaveFaq = () => {
    update({
      faqs: d.faqs.map((f) =>
        f.id === editingFaqId ? { ...f, ...faqForm } : f,
      ),
    });
    setEditingFaqId(null);
  };

  const handleDeleteFaq = (id) =>
    update({ faqs: d.faqs.filter((f) => f.id !== id) });

  return (
    <div className="space-y-6">
      <LoyaltyHeader handleSaveToBackend={handleSaveToBackend} />

      {/* ── Banners & Hero ── */}
      <LoyaltyBannersHeroEditor
        d={d}
        update={update}
        uploadImage={uploadImage}
      />

      {/* ── Tiers ── */}
      <LoyaltyTiersEditor
        tiers={d.tiers}
        editingTierId={editingTierId}
        setEditingTierId={setEditingTierId}
        tierForm={tierForm}
        setTierForm={setTierForm}
        handleAddTier={handleAddTier}
        handleSaveTier={handleSaveTier}
        handleDeleteTier={handleDeleteTier}
        uploadImage={uploadImage}
      />

      {/* ── FAQs ── */}
      <LoyaltyFaqsEditor
        faqTitle={d.faqTitle}
        faqs={d.faqs}
        update={update}
        editingFaqId={editingFaqId}
        setEditingFaqId={setEditingFaqId}
        faqForm={faqForm}
        setFaqForm={setFaqForm}
        handleAddFaq={handleAddFaq}
        handleSaveFaq={handleSaveFaq}
        handleDeleteFaq={handleDeleteFaq}
      />
    </div>
  );
}
