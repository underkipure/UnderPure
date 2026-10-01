import React from "react";
import { Plus, Trash2, Edit3, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

const Section = ({ title, children }) => (
  <div className="bg-white border border-black/10 p-6 space-y-5">
    <h3 className="font-serif text-lg border-b border-black/10 pb-3">
      {title}
    </h3>
    {children}
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
      {label}
    </label>
    {children}
  </div>
);

const LoyaltyTiersEditor = ({
  tiers,
  editingTierId,
  setEditingTierId,
  tierForm,
  setTierForm,
  handleAddTier,
  handleSaveTier,
  handleDeleteTier,
  uploadImage,
}) => {
  return (
    <Section title="Loyalty Tiers">
      <div className="flex justify-end mb-2">
        <button
          onClick={handleAddTier}
          className="text-[10px] uppercase tracking-widest font-semibold hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Plus size={12} /> Add Tier
        </button>
      </div>
      <div className="space-y-4">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className="border border-black/10 p-4 relative group bg-gray-50/50"
          >
            {editingTierId === tier.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Tier Name">
                    <input
                      type="text"
                      value={tierForm.tier}
                      onChange={(e) =>
                        setTierForm({ ...tierForm, tier: e.target.value })
                      }
                      className="w-full border border-black/20 p-2 text-sm focus:outline-none focus:border-black font-serif italic"
                    />
                  </Field>
                  <Field label="Subtitle / Points Required">
                    <input
                      type="text"
                      value={tierForm.subtitle}
                      onChange={(e) =>
                        setTierForm({
                          ...tierForm,
                          subtitle: e.target.value,
                        })
                      }
                      className="w-full border border-black/20 p-2 text-sm focus:outline-none focus:border-black font-serif"
                    />
                  </Field>
                </div>
                <Field label="Benefits (one per line)">
                  <textarea
                    rows={4}
                    value={tierForm.benefits.join("\n")}
                    onChange={(e) =>
                      setTierForm({
                        ...tierForm,
                        benefits: e.target.value.split("\n"),
                      })
                    }
                    className="w-full border border-black/20 p-2 text-sm focus:outline-none focus:border-black resize-none font-sans"
                  />
                </Field>
                <Field label="Tier Image">
                  <div className="flex items-center gap-4">
                    {tierForm.image && (
                      <img
                        loading="lazy"
                        src={tierForm.image}
                        alt="Tier"
                        className="h-16 w-16 object-cover border border-black/10"
                      />
                    )}
                    <label className="border border-black/20 px-3 py-1.5 text-[10px] uppercase tracking-widest cursor-pointer hover:border-black flex items-center gap-2">
                      <ImageIcon size={12} /> Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            try {
                              toast.info("Uploading...");
                              const url = await uploadImage(file);
                              setTierForm({ ...tierForm, image: url });
                              toast.success("Done!");
                            } catch {
                              toast.error("Failed");
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                </Field>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveTier}
                    className="bg-black text-white px-4 py-2 text-xs uppercase tracking-widest cursor-pointer hover:bg-gray-800"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => setEditingTierId(null)}
                    className="border border-black/20 px-4 py-2 text-xs uppercase tracking-widest cursor-pointer hover:border-black"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-4">
                {tier.image && (
                  <img
                    loading="lazy"
                    src={tier.image}
                    className="w-20 h-20 object-cover aspect-square border border-black/10"
                    alt={tier.tier}
                  />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-serif italic text-xl">{tier.tier}</h4>
                      <p className="text-sm font-serif text-gray-600 whitespace-pre-line">
                        {tier.subtitle}
                      </p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingTierId(tier.id);
                          setTierForm(tier);
                        }}
                        className="text-gray-400 hover:text-black cursor-pointer"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTier(tier.id)}
                        className="text-gray-400 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 text-xs space-y-1">
                    {tier.benefits.slice(0, 3).map((b, i) => (
                      <div key={i}>• {b}</div>
                    ))}
                    {tier.benefits.length > 3 && (
                      <div className="text-gray-400 italic">
                        +{tier.benefits.length - 3} more...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
};

export default LoyaltyTiersEditor;
