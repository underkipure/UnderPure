import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import {
  useSiteSettingsStore,
  DEFAULTS,
} from "../../../../store/siteSettingsStore";
import { useCategoryStore } from "../../../../store/categoryStore";
import { useAuthStore } from "../../../../store/authStore";
import { toast } from "sonner";

import SmsBannerEditor from "./components/SmsBannerEditor";
import HeaderHelpEditor from "./components/HeaderHelpEditor";
import BoutiqueBlockEditor from "./components/BoutiqueBlockEditor";
import ContactInfoEditor from "./components/ContactInfoEditor";
import NavColumnsEditor from "./components/NavColumnsEditor";
import CompanyInfoColumnEditor from "./components/CompanyInfoColumnEditor";
import GetHelpColumnEditor, {
  defaultGetHelpLinks,
} from "./components/GetHelpColumnEditor";
import SocialLinksEditor from "./components/SocialLinksEditor";
import BigLogoEditor from "./components/BigLogoEditor";
import CopyrightLegalEditor from "./components/CopyrightLegalEditor";

export default function HeaderFooterTab() {
  const { token } = useAuthStore();
  const settings = useSiteSettingsStore();
  const updateSettings = useSiteSettingsStore((s) => s.updateSettings);

  // Local state — initialised from store
  const [fd, setFd] = useState(settings.footerData || DEFAULTS.footerData);
  const [globalContactEmail, setGlobalContactEmail] = useState(
    typeof settings.contactEmail === "string" && settings.contactEmail
      ? settings.contactEmail
      : (typeof settings.footerData?.contactEmail === "string" ? settings.footerData.contactEmail : "")
  );
  const [globalContactPhone, setGlobalContactPhone] = useState(
    typeof settings.contactPhone === "string" && settings.contactPhone
      ? settings.contactPhone
      : (typeof settings.footerData?.contactPhone === "string" ? settings.footerData.contactPhone : "")
  );

  const { categories } = useCategoryStore();

  // Sync when store loads from backend
  useEffect(() => {
    if (settings._loaded) {
      if (settings.footerData) setFd(settings.footerData);
      const email =
        typeof settings.contactEmail === "string" && settings.contactEmail
          ? settings.contactEmail
          : (typeof settings.footerData?.contactEmail === "string" ? settings.footerData.contactEmail : "");
      if (email) {
        setGlobalContactEmail(email);
      }
      const phone =
        typeof settings.contactPhone === "string" && settings.contactPhone
          ? settings.contactPhone
          : (typeof settings.footerData?.contactPhone === "string" ? settings.footerData.contactPhone : "");
      if (phone) {
        setGlobalContactPhone(phone);
      }
    }
  }, [settings._loaded, settings.contactEmail, settings.contactPhone, settings.footerData]);

  const [uploadingBoutiqueImage, setUploadingBoutiqueImage] = useState(false);

  const update = (patch) => setFd((prev) => ({ ...prev, ...patch }));

  const handleBoutiqueImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingBoutiqueImage(true);
    const localUrl = URL.createObjectURL(file);
    update({ boutiqueImage: localUrl });

    try {
      toast.info("Uploading boutique image to Cloudinary...");
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost/backend"
        }/upload/image?folder=boutique_media`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload failed");

      const json = await res.json();
      update({ boutiqueImage: json.url });
      toast.success("Boutique image uploaded to Cloudinary successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
    } finally {
      URL.revokeObjectURL(localUrl);
      setUploadingBoutiqueImage(false);
    }
  };

  // Column helpers
  const addColumn = () =>
    update({
      columns: [
        ...fd.columns,
        { id: Date.now(), title: "New Column", links: [] },
      ],
    });

  const updateColumn = (colId, field, val) =>
    update({
      columns: fd.columns.map((c) =>
        c.id === colId ? { ...c, [field]: val } : c
      ),
    });

  const removeColumn = (colId) =>
    update({ columns: fd.columns.filter((c) => c.id !== colId) });

  // Link helpers
  const addLink = (colId) =>
    update({
      columns: fd.columns.map((c) =>
        c.id === colId
          ? {
              ...c,
              links: [
                ...c.links,
                { id: Date.now(), name: "New Link", url: "/" },
              ],
            }
          : c
      ),
    });

  const updateLink = (colId, linkId, field, val) =>
    update({
      columns: fd.columns.map((c) =>
        c.id === colId
          ? {
              ...c,
              links: c.links.map((l) =>
                l.id === linkId ? { ...l, [field]: val } : l
              ),
            }
          : c
      ),
    });

  const removeLink = (colId, linkId) =>
    update({
      columns: fd.columns.map((c) =>
        c.id === colId
          ? { ...c, links: c.links.filter((l) => l.id !== linkId) }
          : c
      ),
    });

  // Boutique location helpers
  const addLocation = () =>
    update({
      boutiqueLocations: [
        ...fd.boutiqueLocations,
        { id: Date.now(), city: "", address: "" },
      ],
    });

  const updateLocation = (id, field, val) =>
    update({
      boutiqueLocations: fd.boutiqueLocations.map((l) =>
        l.id === id ? { ...l, [field]: val } : l
      ),
    });

  const removeLocation = (id) =>
    update({
      boutiqueLocations: fd.boutiqueLocations.filter((l) => l.id !== id),
    });

  // Legal link helpers
  const addLegalLink = () =>
    update({
      legalLinks: [
        ...(fd.legalLinks || []),
        { id: Date.now(), name: "New Link", url: "/" },
      ],
    });

  const updateLegalLink = (id, field, val) =>
    update({
      legalLinks: (fd.legalLinks || []).map((l) =>
        l.id === id ? { ...l, [field]: val } : l
      ),
    });

  const removeLegalLink = (id) =>
    update({
      legalLinks: (fd.legalLinks || []).filter((l) => l.id !== id),
    });

  // Company Info link helpers
  const defaultCompanyInfo = [
    { id: 1, label: "About Us", url: "/about-us" },
    { id: 2, label: "Boutiques", url: "/boutiques" },
    { id: 3, label: "Loyalty Program", url: "/loyalty-program" },
    { id: 4, label: "Take Our Survey", url: "/survey" },
  ];
  const companyInfoLinksList =
    fd.companyInfoLinks && fd.companyInfoLinks.length > 0
      ? fd.companyInfoLinks
      : defaultCompanyInfo;

  const addCompanyInfoLink = () =>
    update({
      companyInfoLinks: [
        ...companyInfoLinksList,
        { id: Date.now(), label: "New Link", url: "/" },
      ],
    });

  const updateCompanyInfoLink = (id, field, val) =>
    update({
      companyInfoLinks: companyInfoLinksList.map((l) =>
        l.id === id ? { ...l, [field]: val } : l
      ),
    });

  const removeCompanyInfoLink = (id) =>
    update({
      companyInfoLinks: companyInfoLinksList.filter((l) => l.id !== id),
    });

  // Get Help link helpers (Column 4)
  const getHelpLinksList =
    Array.isArray(fd.getHelpLinks) && fd.getHelpLinks.length > 0
      ? fd.getHelpLinks
      : defaultGetHelpLinks;

  const addGetHelpLink = () =>
    update({
      getHelpLinks: [
        ...getHelpLinksList,
        { id: Date.now(), label: "New Link", url: "/" },
      ],
    });

  const updateGetHelpLink = (id, field, val) =>
    update({
      getHelpLinks: getHelpLinksList.map((l) =>
        l.id === id ? { ...l, [field]: val } : l
      ),
    });

  const removeGetHelpLink = (id) =>
    update({
      getHelpLinks: getHelpLinksList.filter((l) => l.id !== id),
    });

  // Save
  const handleSave = async () => {
    const updatedFooterData = {
      ...fd,
      contactEmail: globalContactEmail,
      contactPhone: globalContactPhone,
    };
    await updateSettings(
      {
        footerData: updatedFooterData,
        contactEmail: globalContactEmail,
        contactPhone: globalContactPhone,
      },
      token
    );
    toast.success("Footer saved!");
  };

  return (
    <div className="space-y-6">
      {/* SMS Banner */}
      <SmsBannerEditor fd={fd} update={update} />

      {/* Header Help Dropdown */}
      <HeaderHelpEditor fd={fd} update={update} />

      {/* Footer Column 1: Boutiques */}
      <BoutiqueBlockEditor
        fd={fd}
        update={update}
        categories={categories}
        uploadingBoutiqueImage={uploadingBoutiqueImage}
        handleBoutiqueImageUpload={handleBoutiqueImageUpload}
        addLocation={addLocation}
        updateLocation={updateLocation}
        removeLocation={removeLocation}
      />

      {/* Footer Column 2: Contact */}
      <ContactInfoEditor
        fd={fd}
        update={update}
        globalContactEmail={globalContactEmail}
        setGlobalContactEmail={setGlobalContactEmail}
        globalContactPhone={globalContactPhone}
        setGlobalContactPhone={setGlobalContactPhone}
      />

      {/* Footer Column 3: Company Info Section */}
      <CompanyInfoColumnEditor
        fd={fd}
        update={update}
        companyInfoLinksList={companyInfoLinksList}
        addCompanyInfoLink={addCompanyInfoLink}
        updateCompanyInfoLink={updateCompanyInfoLink}
        removeCompanyInfoLink={removeCompanyInfoLink}
      />

      {/* Footer Column 4: Get Help Section */}
      <GetHelpColumnEditor
        fd={fd}
        update={update}
        getHelpLinksList={getHelpLinksList}
        addGetHelpLink={addGetHelpLink}
        updateGetHelpLink={updateGetHelpLink}
        removeGetHelpLink={removeGetHelpLink}
      />

      {/* Additional Navigation Columns (Custom / Extra) */}
      <NavColumnsEditor
        fd={fd}
        addColumn={addColumn}
        updateColumn={updateColumn}
        removeColumn={removeColumn}
        addLink={addLink}
        updateLink={updateLink}
        removeLink={removeLink}
      />

      {/* Social Links */}
      <SocialLinksEditor fd={fd} update={update} />

      {/* Big Logo */}
      <BigLogoEditor fd={fd} update={update} />

      {/* Copyright & Legal */}
      <CopyrightLegalEditor
        fd={fd}
        update={update}
        addLegalLink={addLegalLink}
        updateLegalLink={updateLegalLink}
        removeLegalLink={removeLegalLink}
      />

      {/* Save */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          className="bg-black text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-gray-800 flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Save size={14} /> Save Footer Settings
        </button>
      </div>
    </div>
  );
}
