import React, { useState, useEffect } from "react";
import { useSiteSettingsStore, DEFAULTS } from "../../../../store/siteSettingsStore";
import { useAuthStore } from "../../../../store/authStore";
import { toast } from "sonner";
import ContactUsHeader from "./components/ContactUsHeader";
import ContactClientServicesSection from "./components/ContactClientServicesSection";
import ContactStoresSection from "./components/ContactStoresSection";
import ContactOtherInquiriesSection from "./components/ContactOtherInquiriesSection";

export default function ContactUsTab() {
  const { token } = useAuthStore();
  const settings = useSiteSettingsStore();

  const [data, setData] = useState(
    settings.contactUsData || DEFAULTS.contactUsData
  );
  const [uploadingId, setUploadingId] = useState(null);

  useEffect(() => {
    if (settings._loaded && settings.contactUsData) {
      setData(settings.contactUsData);
    }
  }, [settings._loaded, settings.contactUsData]);

  const update = (patch) => setData((prev) => ({ ...prev, ...patch }));

  const addStore = () => {
    update({
      stores: [
        ...(data.stores || []),
        {
          id: Date.now(),
          name: "New Boutique",
          addressLine1: "123 Street Name",
          addressLine2: "City, ST 12345",
          phone: "+1 (000) 000-0000",
          hours: "Monday-Saturday 11AM-7PM",
          image: "",
        },
      ],
    });
  };

  const updateStore = (id, field, value) => {
    update({
      stores: (data.stores || []).map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    });
  };

  const removeStore = (id) => {
    update({ stores: (data.stores || []).filter((s) => s.id !== id) });
  };

  const uploadFileToServer = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL || "http://localhost/backend"}/upload/image?folder=stores`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );
    if (!res.ok) throw new Error("Upload failed");
    const resData = await res.json();
    return resData.url;
  };

  const handleImageUpload = async (e, storeId) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingId(storeId);
    try {
      toast.info("Uploading store image...");
      const serverUrl = await uploadFileToServer(file);
      updateStore(storeId, "image", serverUrl);
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setUploadingId(null);
    }
  };

  const handleSave = async () => {
    try {
      await settings.updateSettings({ contactUsData: data }, token);
      toast.success("Contact Us settings saved successfully");
    } catch (err) {
      toast.error("Failed to save settings");
    }
  };

  return (
    <div className="bg-white border border-black/10 p-6 space-y-8 max-w-4xl">
      <ContactUsHeader handleSave={handleSave} />
      <ContactClientServicesSection
        clientServices={data.clientServices}
        update={update}
      />
      <ContactStoresSection
        stores={data.stores}
        addStore={addStore}
        updateStore={updateStore}
        removeStore={removeStore}
        handleImageUpload={handleImageUpload}
        uploadingId={uploadingId}
      />
      <ContactOtherInquiriesSection
        otherInquiries={data.otherInquiries}
        update={update}
      />
    </div>
  );
}
