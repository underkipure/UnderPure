import React from "react";
import { Upload, Trash2, GripVertical } from "lucide-react";
import { optimizeImage } from "../../../../lib/productUtils";

export default function ProductImagesManager({
  formData,
  handleMainDragStart,
  handleMainDragOver,
  handleMainDrop,
  draggedMainIndex,
  removeImage,
  handleImageUpload,
}) {
  return (
    <div className="bg-white border border-black/10 p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-black/10 pb-2 gap-1">
        <div>
          <h2 className="font-serif text-lg">Product Images</h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">
            Drag & drop thumbnails to reorder sequence. First image is Main.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(formData.images || []).map((img, idx) => (
          <div
            key={idx}
            draggable
            onDragStart={(e) => handleMainDragStart(e, idx)}
            onDragOver={handleMainDragOver}
            onDrop={(e) => handleMainDrop(e, idx)}
            className={`aspect-[3/4] bg-gray-100 border relative group overflow-hidden cursor-grab active:cursor-grabbing transition-all ${
              draggedMainIndex === idx
                ? "opacity-40 border-dashed border-black scale-95"
                : "border-black/10 hover:border-black/50"
            }`}
          >
            <img
              loading="lazy"
              src={
                typeof img === "string" && img.startsWith("data:")
                  ? img
                  : optimizeImage(img, 150)
              }
              alt={`Product ${idx + 1}`}
              className="w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical size={14} />
            </div>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="bg-white text-red-600 p-2 rounded-full hover:bg-gray-100"
              >
                <Trash2 size={16} />
              </button>
            </div>
            {idx === 0 && (
              <span className="absolute top-1 left-1 bg-black text-white text-[8px] px-1.5 py-0.5 uppercase tracking-widest">
                Main
              </span>
            )}
            <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 font-mono rounded">
              {idx + 1}
            </span>
          </div>
        ))}
        <label className="aspect-[3/4] border-2 border-dashed border-black/20 flex flex-col items-center justify-center cursor-pointer hover:border-black/40 transition-colors">
          <Upload size={20} className="text-gray-400 mb-2" />
          <span className="text-[9px] uppercase tracking-widest text-gray-500 text-center px-2">
            Upload from device
          </span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
      </div>
    </div>
  );
}
