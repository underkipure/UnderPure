import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchPromotions, createPromotion, updatePromotion, deletePromotion, fetchCategories } from "../../../lib/api";
import { useAuthStore } from "../../../store/authStore";

import { EMPTY_FORM } from "./constants";
import PromotionsHeader from "./components/PromotionsHeader";
import PromotionsStatsGrid from "./components/PromotionsStatsGrid";
import PromotionsMobileCards from "./components/PromotionsMobileCards";
import PromotionsDesktopTable from "./components/PromotionsDesktopTable";
import CreatePromotionModal from "./components/CreatePromotionModal";
import DeletePromotionModal from "./components/DeletePromotionModal";

const INITIAL_CODES = [];

export default function AdminPromotions() {
  const { token } = useAuthStore();
  const [codes, setCodes] = useState(INITIAL_CODES);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [deleteId, setDeleteId] = useState(null);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data || []);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  const loadPromotions = async () => {
    try {
      const data = await fetchPromotions(token);
      setCodes(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load promotions");
    }
  };

  useEffect(() => {
    if (token) {
      loadPromotions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    loadCategories();
  }, []);

  const setField = (key, value) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleCreate = async () => {
    if (!form.code.trim()) {
      toast.error("Please enter a code");
      return;
    }
    if (form.applyTo === "category" && !form.category_id) {
      toast.error("Please select a category");
      return;
    }
    try {
      const payload = {
        ...form,
        code: form.code.toUpperCase().replace(/\s+/g, ""),
        category_id: form.applyTo === "category" ? form.category_id : null
      };
      await createPromotion(token, payload);
      toast.success("Discount code created");
      setModalOpen(false);
      setForm({ ...EMPTY_FORM });
      loadPromotions();
    } catch (err) {
      toast.error(err.message || "Failed to create code");
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      const codeToUpdate = codes.find(c => c.id === id);
      await updatePromotion(token, id, { ...codeToUpdate, active: !currentStatus });
      toast.success("Code status updated");
      loadPromotions();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePromotion(token, id);
      toast.success("Code deleted");
      setDeleteId(null);
      loadPromotions();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete code");
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code).catch(() => { });
    toast.success(`Copied: ${code}`);
  };

  const activeCodes = codes.filter((c) => c.active);
  const totalUses = codes.reduce((s, c) => s + c.uses, 0);
  const expiringSoonCount = codes.filter((c) => c.expires).length;

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-[1400px] mx-auto w-full overflow-x-hidden pb-20 md:pb-10">
      {/* Header */}
      <PromotionsHeader 
        totalCodes={codes.length}
        activeCodes={activeCodes.length}
        onOpenModal={() => setModalOpen(true)}
      />

      {/* Summary Stats */}
      <PromotionsStatsGrid 
        activeCount={activeCodes.length}
        totalUses={totalUses}
        expiringSoonCount={expiringSoonCount}
      />

      {/* Mobile View */}
      <PromotionsMobileCards 
        codes={codes}
        categories={categories}
        handleCopy={handleCopy}
        handleToggle={handleToggle}
        setDeleteId={setDeleteId}
      />

      {/* Desktop View */}
      <PromotionsDesktopTable 
        codes={codes}
        categories={categories}
        handleCopy={handleCopy}
        handleToggle={handleToggle}
        setDeleteId={setDeleteId}
      />

      {/* Create Modal */}
      <CreatePromotionModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        form={form}
        setField={setField}
        categories={categories}
        handleCreate={handleCreate}
      />

      {/* Delete Modal */}
      <DeletePromotionModal 
        deleteId={deleteId}
        onClose={() => setDeleteId(null)}
        handleDelete={handleDelete}
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; sm:width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #111; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d4a59a60; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d4a59a; }
      `}</style>
    </div>
  );
}
