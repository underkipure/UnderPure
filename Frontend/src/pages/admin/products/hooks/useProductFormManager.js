import { useState } from "react";
import { toast } from "sonner";
import {
  EMPTY_PRODUCT,
  transformProductToFormData,
  transformFormDataToPayload,
} from "../utils/adminProductHelpers";
import { createProduct, updateProduct, fetchProduct } from "../../../../lib/api";

export function useProductFormManager({
  token,
  categories,
  safeGlobalSizes,
  onSaveSuccess,
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ ...EMPTY_PRODUCT });
  const [draggedMainIndex, setDraggedMainIndex] = useState(null);
  const [draggedColorGroupImage, setDraggedColorGroupImage] = useState(null);

  const openNewForm = () => {
    setFormData({
      ...EMPTY_PRODUCT,
      colorGroups: [
        {
          color: "Red",
          hex: "#DC2626",
          images: [],
          sizes: [],
        },
      ],
    });
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = async (product) => {
    const formatted = transformProductToFormData(product);
    setFormData(formatted);
    setEditingId(product.id);
    setShowForm(true);

    if (product?.id) {
      try {
        const fullRes = await fetchProduct(product.id);
        if (fullRes?.product) {
          const fullFormatted = transformProductToFormData(fullRes.product);
          setFormData(fullFormatted);
        }
      } catch (err) {
        console.error("Failed to load full product for editing:", err);
      }
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ ...EMPTY_PRODUCT });
  };

  const handleSave = async () => {
    if (!formData.name?.trim()) return;
    const payload = transformFormDataToPayload(formData, categories);

    try {
      const isEdit = Boolean(editingId);
      const currentEditingId = editingId;

      if (isEdit) {
        await updateProduct(token, currentEditingId, payload);
        toast.success("Product updated successfully");
      } else {
        await createProduct(token, payload);
        toast.success("Product created successfully");
      }
      closeForm();
      if (onSaveSuccess) {
        await onSaveSuccess({
          isEdit,
          editingId: currentEditingId,
          payload,
        });
      }
    } catch (error) {
      toast.error(error.message || "Failed to save product");
    }
  };

  const addColorGroup = () => {
    setFormData((prev) => ({
      ...prev,
      colorGroups: [
        ...(prev.colorGroups || []),
        {
          color: "",
          hex: "#000000",
          images: [],
          sizes: [],
        },
      ],
    }));
  };

  const removeColorGroup = (gIdx) => {
    setFormData((prev) => ({
      ...prev,
      colorGroups: (prev.colorGroups || []).filter((_, i) => i !== gIdx),
    }));
  };

  const updateColorGroupField = (gIdx, field, value) => {
    setFormData((prev) => {
      const groups = [...(prev.colorGroups || [])];
      groups[gIdx] = { ...groups[gIdx], [field]: value };
      return { ...prev, colorGroups: groups };
    });
  };

  const addSizeToColorGroup = (gIdx) => {
    setFormData((prev) => {
      const groups = [...(prev.colorGroups || [])];
      const currentGroup = { ...groups[gIdx] };
      const existingSizes = (currentGroup.sizes || []).map((s) => s.size);
      const nextSize =
        safeGlobalSizes.find((s) => !existingSizes.includes(s)) ||
        safeGlobalSizes[0] ||
        "Free Size";
      currentGroup.sizes = [
        ...(currentGroup.sizes || []),
        { size: nextSize, stock: 0, sku: "" },
      ];
      groups[gIdx] = currentGroup;
      return { ...prev, colorGroups: groups };
    });
  };

  const addPresetSizesToColorGroup = (gIdx, presetInput = "standard") => {
    setFormData((prev) => {
      const groups = [...(prev.colorGroups || [])];
      const currentGroup = { ...groups[gIdx] };
      const existingSizes = (currentGroup.sizes || []).map((s) => s.size);

      let presets = [];
      if (Array.isArray(presetInput)) {
        presets = presetInput;
      } else if (presetInput === "numeric") {
        presets = ["30", "32", "34", "36", "38", "40"];
      } else if (presetInput === "standard") {
        presets = ["Small", "Medium", "Large", "XL"];
      } else if (
        typeof presetInput === "object" &&
        Array.isArray(presetInput?.sizes)
      ) {
        presets = presetInput.sizes;
      }

      const newSizes = [...(currentGroup.sizes || [])];
      presets.forEach((p) => {
        if (!existingSizes.includes(p)) {
          newSizes.push({ size: p, stock: 0, sku: "" });
        }
      });
      currentGroup.sizes = newSizes;
      groups[gIdx] = currentGroup;
      return { ...prev, colorGroups: groups };
    });
  };

  const removeSizeFromColorGroup = (gIdx, szIdx) => {
    setFormData((prev) => {
      const groups = [...(prev.colorGroups || [])];
      const currentGroup = { ...groups[gIdx] };
      currentGroup.sizes = (currentGroup.sizes || []).filter(
        (_, i) => i !== szIdx
      );
      groups[gIdx] = currentGroup;
      return { ...prev, colorGroups: groups };
    });
  };

  const updateColorGroupSizeField = (gIdx, szIdx, field, value) => {
    setFormData((prev) => {
      const groups = [...(prev.colorGroups || [])];
      const currentGroup = { ...groups[gIdx] };
      const newSizes = [...(currentGroup.sizes || [])];
      newSizes[szIdx] = { ...newSizes[szIdx], [field]: value };
      currentGroup.sizes = newSizes;
      groups[gIdx] = currentGroup;
      return { ...prev, colorGroups: groups };
    });
  };

  const handleColorGroupImageUpload = async (gIdx, files) => {
    if (!files || files.length === 0) return;
    try {
      const fileList = Array.from(files);
      const base64Images = await Promise.all(
        fileList.map((file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
          });
        })
      );
      setFormData((prev) => {
        const groups = [...(prev.colorGroups || [])];
        const currentGroup = { ...groups[gIdx] };
        currentGroup.images = [
          ...(currentGroup.images || []),
          ...base64Images,
        ];
        groups[gIdx] = currentGroup;
        return { ...prev, colorGroups: groups };
      });
      toast.success(
        `Uploaded ${base64Images.length} image(s) for color group`
      );
    } catch {
      toast.error("Failed to upload images");
    }
  };

  const removeColorGroupImage = (gIdx, imgIdx) => {
    setFormData((prev) => {
      const groups = [...(prev.colorGroups || [])];
      const currentGroup = { ...groups[gIdx] };
      currentGroup.images = (currentGroup.images || []).filter(
        (_, i) => i !== imgIdx
      );
      groups[gIdx] = currentGroup;
      return { ...prev, colorGroups: groups };
    });
  };

  const toggleMainImageToColorGroup = (gIdx, imgUrl) => {
    setFormData((prev) => {
      const groups = [...(prev.colorGroups || [])];
      const currentGroup = { ...groups[gIdx] };
      const currentImgs = [...(currentGroup.images || [])];
      if (currentImgs.includes(imgUrl)) {
        currentGroup.images = currentImgs.filter((u) => u !== imgUrl);
      } else {
        currentGroup.images = [...currentImgs, imgUrl];
      }
      groups[gIdx] = currentGroup;
      return { ...prev, colorGroups: groups };
    });
  };

  const handleColorGroupImageDragStart = (gIdx, imgIdx) => {
    setDraggedColorGroupImage({ gIdx, imgIdx });
  };

  const handleColorGroupImageDrop = (gIdx, targetImgIdx) => {
    if (!draggedColorGroupImage) return;
    const { gIdx: srcGIdx, imgIdx: srcImgIdx } = draggedColorGroupImage;
    if (srcGIdx !== gIdx || srcImgIdx === targetImgIdx) return;

    setFormData((prev) => {
      const groups = [...(prev.colorGroups || [])];
      const currentGroup = { ...groups[gIdx] };
      const images = [...(currentGroup.images || [])];
      const [moved] = images.splice(srcImgIdx, 1);
      images.splice(targetImgIdx, 0, moved);
      currentGroup.images = images;
      groups[gIdx] = currentGroup;
      return { ...prev, colorGroups: groups };
    });
    setDraggedColorGroupImage(null);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const base64Images = await Promise.all(
      files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      })
    );

    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...base64Images],
    }));
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  const handleMainDragStart = (e, index) => {
    setDraggedMainIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleMainDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleMainDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedMainIndex === null || draggedMainIndex === dropIndex) return;

    setFormData((prev) => {
      const updated = [...(prev.images || [])];
      const [moved] = updated.splice(draggedMainIndex, 1);
      updated.splice(dropIndex, 0, moved);
      return { ...prev, images: updated };
    });
    setDraggedMainIndex(null);
  };

  const toggleBadge = (badge) => {
    const has = (formData.badges || []).includes(badge);
    setFormData((prev) => ({
      ...prev,
      badges: has
        ? (prev.badges || []).filter((b) => b !== badge)
        : [...(prev.badges || []), badge],
    }));
  };

  return {
    showForm,
    setShowForm,
    editingId,
    setEditingId,
    formData,
    setFormData,
    draggedMainIndex,
    draggedColorGroupImage,
    openNewForm,
    openEditForm,
    closeForm,
    handleSave,
    addColorGroup,
    removeColorGroup,
    updateColorGroupField,
    addSizeToColorGroup,
    addPresetSizesToColorGroup,
    removeSizeFromColorGroup,
    updateColorGroupSizeField,
    handleColorGroupImageUpload,
    removeColorGroupImage,
    toggleMainImageToColorGroup,
    handleColorGroupImageDragStart,
    handleColorGroupImageDrop,
    handleImageUpload,
    removeImage,
    handleMainDragStart,
    handleMainDragOver,
    handleMainDrop,
    toggleBadge,
  };
}
