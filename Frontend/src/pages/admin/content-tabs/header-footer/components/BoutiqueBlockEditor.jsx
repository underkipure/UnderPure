import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Section, Field, Input, Toggle } from "./FormControls";

const BoutiqueBlockEditor = ({
  fd,
  update,
  categories,
  uploadingBoutiqueImage,
  handleBoutiqueImageUpload,
  addLocation,
  updateLocation,
  removeLocation,
}) => {
  return (
    <Section title="Footer Column 1: Brand & Boutiques">
      <Toggle
        enabled={fd.boutiquesEnabled}
        onChange={(v) => update({ boutiquesEnabled: v })}
        label={
          fd.boutiquesEnabled
            ? "Boutique Block Visible"
            : "Boutique Block Hidden"
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="Title">
          <Input
            value={fd.boutiqueTitle}
            onChange={(v) => update({ boutiqueTitle: v })}
          />
        </Field>
        <Field label="Button / CTA Text">
          <Input
            value={fd.boutiqueCta || "EXPLORE COLLECTION"}
            onChange={(v) => update({ boutiqueCta: v })}
          />
        </Field>
        <Field label="Boutiques Link — Select a Collection">
          <select
            value={fd.boutiqueCtaLink || "/boutiques"}
            onChange={(e) => update({ boutiqueCtaLink: e.target.value })}
            className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black bg-white"
          >
            <option value="/boutiques">Boutiques Page (/boutiques)</option>
            <option value="/collections">
              All Collections (/collections)
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={`/collections/${cat.slug}`}>
                {cat.name} (/collections/{cat.slug})
              </option>
            ))}
            <option value="__custom">Custom URL...</option>
          </select>
          {fd.boutiqueCtaLink &&
            ![
              "/boutiques",
              "/collections",
              ...categories.map((c) => `/collections/${c.slug}`),
            ].includes(fd.boutiqueCtaLink) && (
              <input
                type="text"
                value={fd.boutiqueCtaLink}
                onChange={(e) => update({ boutiqueCtaLink: e.target.value })}
                placeholder="e.g. /collections/sale"
                className="mt-2 w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black"
              />
            )}
        </Field>
      </div>
      <Field label="Description">
        <textarea
          value={fd.boutiqueDescription}
          onChange={(e) => update({ boutiqueDescription: e.target.value })}
          rows={3}
          className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black resize-none"
        />
      </Field>

      <Field label="Boutique Image">
        <div className="flex items-center gap-4">
          <div className="w-20 h-24 bg-gray-100 border border-black/10 flex items-center justify-center overflow-hidden shrink-0">
            {fd.boutiqueImage ? (
              <img
                src={fd.boutiqueImage}
                alt="Boutique Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[10px] text-gray-400">No image</span>
            )}
          </div>
          <div className="flex-1 flex gap-2 items-center">
            <Input
              value={fd.boutiqueImage || ""}
              onChange={(v) => update({ boutiqueImage: v })}
              placeholder="Image URL or upload button"
            />
            <label className="bg-black text-white px-4 py-2.5 text-[10px] uppercase tracking-widest cursor-pointer hover:bg-gray-800 transition-colors shrink-0 flex items-center gap-1 font-bold whitespace-nowrap">
              {uploadingBoutiqueImage ? "Uploading..." : "Upload Image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingBoutiqueImage}
                onChange={handleBoutiqueImageUpload}
              />
            </label>
          </div>
        </div>
      </Field>

      {/* Locations */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-[10px] uppercase tracking-widest text-gray-500">
            Store Locations
          </label>
          <button
            onClick={addLocation}
            className="flex items-center gap-1 text-[10px] uppercase tracking-widest hover:underline"
          >
            <Plus size={12} /> Add Location
          </button>
        </div>
        <div className="space-y-2">
          {fd.boutiqueLocations.map((loc) => (
            <div
              key={loc.id}
              className="flex flex-col sm:flex-row gap-2 items-start sm:items-center group relative p-2 sm:p-0 border sm:border-0 border-black/10"
            >
              <input
                type="text"
                value={loc.city}
                onChange={(e) =>
                  updateLocation(loc.id, "city", e.target.value)
                }
                placeholder="City"
                className="border border-black/20 p-2 text-sm focus:outline-none focus:border-black w-full sm:w-40"
              />
              <input
                type="text"
                value={loc.address}
                onChange={(e) =>
                  updateLocation(loc.id, "address", e.target.value)
                }
                placeholder="Address"
                className="flex-1 border border-black/20 p-2 text-sm focus:outline-none focus:border-black"
              />
              <button
                onClick={() => removeLocation(loc.id)}
                className="absolute sm:relative top-2 right-2 sm:top-auto sm:right-auto text-gray-300 hover:text-red-500 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity p-1"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default BoutiqueBlockEditor;
