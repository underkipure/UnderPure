import React from "react";
import { Plus, Trash2, Camera } from "lucide-react";
import { Section, Field, Input, TextArea } from "./ContactFormPrimitives";

export default function ContactStoresSection({
  stores = [],
  addStore,
  updateStore,
  removeStore,
  handleImageUpload,
  uploadingId,
}) {
  return (
    <Section title="Boutique Locations">
      <p className="text-xs text-gray-500 mb-4 uppercase tracking-widest">
        These locations are displayed in the grid on the Contact Us page.
      </p>

      <div className="space-y-6">
        {stores.map((store, index) => (
          <div
            key={store.id}
            className="relative bg-gray-50 p-4 border border-black/10"
          >
            <button
              onClick={() => removeStore(store.id)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
              title="Remove Store"
            >
              <Trash2 size={18} />
            </button>

            <h4 className="font-serif mb-4">Store #{index + 1}</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Store Name">
                <Input
                  value={store.name}
                  onChange={(v) => updateStore(store.id, "name", v)}
                  placeholder="e.g. Nolita Boutique"
                />
              </Field>
              <Field label="Phone">
                <Input
                  value={store.phone}
                  onChange={(v) => updateStore(store.id, "phone", v)}
                  placeholder="e.g. +1 (917) 237-0008"
                />
              </Field>
              <Field label="Address Line 1">
                <Input
                  value={store.addressLine1}
                  onChange={(v) => updateStore(store.id, "addressLine1", v)}
                  placeholder="e.g. 372 Broome Street"
                />
              </Field>
              <Field label="Address Line 2">
                <Input
                  value={store.addressLine2}
                  onChange={(v) => updateStore(store.id, "addressLine2", v)}
                  placeholder="e.g. New York, NY 10013"
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="Store Hours (Use Enter for new line)">
                  <TextArea
                    value={store.hours}
                    onChange={(v) => updateStore(store.id, "hours", v)}
                    placeholder="Monday-Saturday 11AM-7PM..."
                  />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label="Store Image">
                  <div className="flex items-start gap-4">
                    {store.image ? (
                      <img
                        src={store.image}
                        alt={store.name}
                        className="w-24 h-24 object-cover border border-black/10"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                        No Image
                      </div>
                    )}
                    <div className="flex-1">
                      <Input
                        value={store.image}
                        onChange={(v) => updateStore(store.id, "image", v)}
                        placeholder="Image URL or upload below"
                        className="mb-2"
                      />
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, store.id)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={uploadingId === store.id}
                        />
                        <button
                          type="button"
                          className="bg-gray-100 border border-black/20 text-black px-4 py-2 text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-gray-200 transition-colors"
                          disabled={uploadingId === store.id}
                        >
                          <Camera size={14} />
                          {uploadingId === store.id
                            ? "Uploading..."
                            : "Upload Image"}
                        </button>
                      </div>
                    </div>
                  </div>
                </Field>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addStore}
          className="w-full py-3 border border-dashed border-black/30 text-gray-500 hover:text-black hover:border-black transition-colors flex justify-center items-center gap-2 text-xs uppercase tracking-widest font-medium bg-gray-50 hover:bg-gray-100"
        >
          <Plus size={16} /> Add Store Location
        </button>
      </div>
    </Section>
  );
}
