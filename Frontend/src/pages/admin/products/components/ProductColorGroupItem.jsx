import React from "react";
import { Plus, Trash2, X, Upload, GripVertical } from "lucide-react";
import CustomColorPicker from "./CustomColorPicker";
import { optimizeImage } from "../../../../lib/productUtils";

export default function ProductColorGroupItem({
  cg,
  gIdx,
  formData,
  updateColorGroupField,
  removeColorGroup,
  handleColorGroupImageUpload,
  removeColorGroupImage,
  toggleMainImageToColorGroup,
  handleColorGroupImageDragStart,
  handleColorGroupImageDrop,
  draggedColorGroupImage,
  sizeClasses,
  addPresetSizesToColorGroup,
  addSizeToColorGroup,
  removeSizeFromColorGroup,
  updateColorGroupSizeField,
  safeGlobalSizes,
}) {
  return (
    <div className="bg-white border border-black/15 p-5 space-y-4 rounded-xs shadow-xs relative group/cgroup">
      {/* Top Bar: Color Name & Color Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/10 pb-3">
        <div className="flex items-center gap-3 flex-1">
          <span className="w-6 h-6 rounded-full bg-black text-white font-bold text-[10px] flex items-center justify-center shrink-0">
            {gIdx + 1}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-gray-500 mb-1 font-bold">
                Color Name *
              </label>
              <input
                type="text"
                value={cg.color}
                onChange={(e) =>
                  updateColorGroupField(gIdx, "color", e.target.value)
                }
                placeholder="e.g. Red, Choco Brown"
                className="w-full border border-black/20 p-2 text-sm focus:outline-none focus:border-black font-semibold"
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-gray-500 mb-1 font-bold">
                Color Palette
              </label>
              <CustomColorPicker
                value={cg.hex}
                onChange={(val) => updateColorGroupField(gIdx, "hex", val)}
                onNameChange={(name) => {
                  if (!cg.color) updateColorGroupField(gIdx, "color", name);
                }}
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => removeColorGroup(gIdx)}
          className="text-gray-400 hover:text-red-600 transition-colors self-end sm:self-center p-1.5 border border-black/10 hover:border-red-600 rounded-xs"
          title="Remove Color Group"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Color-Specific Images Subsection */}
      <div className="bg-gray-50/70 p-4 border border-black/10 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-black font-bold">
              Images for "{cg.color || "Color"}" ({cg.images?.length || 0})
            </label>
            <p className="text-[10px] text-gray-500">
              Upload or drag to reorder images specific to this color
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="bg-black text-white px-3 py-1.5 text-[10px] uppercase tracking-widest cursor-pointer hover:bg-gray-800 transition-colors flex items-center gap-1 font-semibold rounded-xs">
              <Upload size={12} /> Upload Images
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  handleColorGroupImageUpload(gIdx, e.target.files)
                }
              />
            </label>
          </div>
        </div>

        {/* Thumbnails Grid with Drag & Drop */}
        {cg.images && cg.images.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
            {cg.images.map((imgUrl, imgIdx) => (
              <div
                key={imgIdx}
                draggable
                onDragStart={() =>
                  handleColorGroupImageDragStart(gIdx, imgIdx)
                }
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleColorGroupImageDrop(gIdx, imgIdx)}
                className={`group/thumb relative aspect-square bg-white border overflow-hidden cursor-move transition-all ${
                  draggedColorGroupImage?.gIdx === gIdx &&
                  draggedColorGroupImage?.imgIdx === imgIdx
                    ? "opacity-40 border-dashed border-black scale-95"
                    : "border-black/10 hover:border-black/50"
                }`}
              >
                <img
                  loading="lazy"
                  src={
                    typeof imgUrl === "string" && imgUrl.startsWith("data:")
                      ? imgUrl
                      : optimizeImage(imgUrl, 150)
                  }
                  alt={`Color ${cg.color}`}
                  className="w-full h-full object-cover pointer-events-none"
                />
                <span className="absolute top-1 left-1 bg-black/70 text-white text-[9px] font-mono px-1 py-0.5 rounded-xs">
                  {imgIdx + 1}
                </span>
                <div className="absolute top-1 right-1 opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => removeColorGroupImage(gIdx, imgIdx)}
                    className="bg-red-600 text-white p-1 shadow-xs hover:bg-red-700 transition-colors rounded-xs"
                    title="Remove image"
                  >
                    <X size={10} />
                  </button>
                </div>
                <div className="absolute bottom-1 right-1 text-white/70 opacity-0 group-hover/thumb:opacity-100">
                  <GripVertical size={12} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-[10px] text-gray-400 italic py-2 text-center border border-dashed border-black/10 bg-white">
            No images added for {cg.color || "this color"} yet. Click "Upload
            Images" or pick from main product images below.
          </div>
        )}

        {/* Quick Pick from Main Product Images */}
        {formData.images && formData.images.length > 0 && (
          <div className="pt-2 border-t border-black/10 mt-2">
            <p className="text-[9px] uppercase tracking-widest text-gray-500 mb-2 font-bold">
              Pick from main product images:
            </p>
            <div className="flex flex-wrap gap-2">
              {formData.images.map((gImg, imgIdx) => {
                const isSelected = (cg.images || []).includes(gImg);
                return (
                  <button
                    key={imgIdx}
                    type="button"
                    onClick={() =>
                      toggleMainImageToColorGroup(gIdx, gImg)
                    }
                    className={`w-10 h-12 border relative overflow-hidden transition-all cursor-pointer ${
                      isSelected
                        ? "border-black ring-2 ring-black ring-offset-1"
                        : "border-gray-200 opacity-50 hover:opacity-100"
                    }`}
                    title={
                      isSelected ? "Remove from color" : "Add to color"
                    }
                  >
                    <img
                      src={
                        typeof gImg === "string" && gImg.startsWith("data:")
                          ? gImg
                          : optimizeImage(gImg, 150)
                      }
                      alt={`Main ${imgIdx}`}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sizes & Stock Quantities Subsection */}
      <div className="bg-gray-50 border border-black/10 p-3.5 sm:p-4 rounded-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-black/10 pb-3">
          <label className="text-xs uppercase tracking-widest text-black font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-black inline-block"></span>
            Sizes &amp; Stock Quantities for &quot;{cg.color || "Color"}&quot;
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {Array.isArray(sizeClasses) &&
              sizeClasses.length > 0 &&
              sizeClasses.map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() =>
                    addPresetSizesToColorGroup(gIdx, sc.sizes)
                  }
                  className="text-[10px] uppercase tracking-wider text-gray-700 bg-white border border-black/20 hover:border-black hover:bg-gray-100 px-3 py-1.5 transition-colors font-semibold rounded-xs shadow-2xs cursor-pointer"
                  title={`Add sizes: ${(sc.sizes || []).join(", ")}`}
                >
                  + Add {sc.name}
                </button>
              ))}

            <button
              type="button"
              onClick={() => addSizeToColorGroup(gIdx)}
              className="text-[10px] uppercase tracking-wider bg-black text-white px-3 py-1.5 hover:bg-gray-800 transition-colors font-semibold flex items-center gap-1.5 rounded-xs shadow-2xs cursor-pointer"
            >
              <Plus size={12} /> Add Size
            </button>
          </div>
        </div>

        {/* Sizes Grid */}
        {cg.sizes && cg.sizes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3.5 pt-1">
            {cg.sizes.map((sz, szIdx) => (
              <div
                key={szIdx}
                className="border border-black/15 p-3.5 bg-white relative rounded-xs shadow-2xs hover:border-black/40 transition-colors"
              >
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-black/5">
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                    Size #{szIdx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSizeFromColorGroup(gIdx, szIdx)}
                    className="text-gray-400 hover:text-red-600 transition-colors p-0.5 rounded-xs hover:bg-red-50 cursor-pointer"
                    title="Remove size"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-12 gap-2.5 items-end">
                  <div className="col-span-7">
                    <label className="block text-[9px] uppercase tracking-widest text-gray-500 mb-1 font-bold">
                      Size
                    </label>
                    <select
                      value={sz.size}
                      onChange={(e) =>
                        updateColorGroupSizeField(
                          gIdx,
                          szIdx,
                          "size",
                          e.target.value,
                        )
                      }
                      className="w-full border border-black/20 px-2.5 py-2 text-xs focus:outline-none focus:border-black font-bold bg-white cursor-pointer rounded-xs"
                    >
                      {safeGlobalSizes.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-5">
                    <label className="block text-[9px] uppercase tracking-widest text-gray-500 mb-1 font-bold text-center">
                      Stock Qty
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={sz.stock !== undefined ? sz.stock : 0}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateColorGroupSizeField(
                          gIdx,
                          szIdx,
                          "stock",
                          val === "" ? "" : parseInt(val) || 0,
                        );
                      }}
                      className="w-full border border-black/20 px-2 py-2 text-xs focus:outline-none focus:border-black font-semibold text-center rounded-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-[11px] text-gray-400 italic py-3 text-center border border-dashed border-black/10 bg-white rounded-xs">
            No sizes added for this color yet. Click &quot;+ Add Size&quot; or
            choose a preset above.
          </div>
        )}
      </div>
    </div>
  );
}
