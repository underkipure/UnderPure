import React from "react";
import { Plus, Trash2, Edit3 } from "lucide-react";

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

const LoyaltyFaqsEditor = ({
  faqTitle,
  faqs,
  update,
  editingFaqId,
  setEditingFaqId,
  faqForm,
  setFaqForm,
  handleAddFaq,
  handleSaveFaq,
  handleDeleteFaq,
}) => {
  return (
    <Section title="Loyalty FAQs">
      <Field label="FAQs Section Title">
        <input
          type="text"
          value={faqTitle || ""}
          onChange={(e) => update({ faqTitle: e.target.value })}
          className="w-full max-w-sm border border-black/20 p-2 text-sm focus:outline-none focus:border-black font-serif italic"
        />
      </Field>
      <div className="flex justify-end mb-2 mt-4">
        <button
          onClick={handleAddFaq}
          className="text-[10px] uppercase tracking-widest font-semibold hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Plus size={12} /> Add FAQ
        </button>
      </div>
      <div className="space-y-3">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="border border-black/10 p-3 relative group"
          >
            {editingFaqId === faq.id ? (
              <div className="space-y-3">
                <Field label="Question">
                  <input
                    type="text"
                    value={faqForm.q}
                    onChange={(e) =>
                      setFaqForm({ ...faqForm, q: e.target.value })
                    }
                    className="w-full border border-black/20 p-2 text-sm focus:outline-none focus:border-black font-serif"
                  />
                </Field>
                <Field label="Answer">
                  <textarea
                    rows={2}
                    value={faqForm.a}
                    onChange={(e) =>
                      setFaqForm({ ...faqForm, a: e.target.value })
                    }
                    className="w-full border border-black/20 p-2 text-sm focus:outline-none focus:border-black font-serif"
                  />
                </Field>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveFaq}
                    className="bg-black text-white px-3 py-1.5 text-[10px] uppercase tracking-widest cursor-pointer hover:bg-gray-800"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => setEditingFaqId(null)}
                    className="border border-black/20 px-3 py-1.5 text-[10px] uppercase tracking-widest cursor-pointer hover:border-black"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-serif text-sm">{faq.q}</h5>
                  <p className="text-xs text-gray-500 mt-1 font-serif">
                    {faq.a}
                  </p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingFaqId(faq.id);
                      setFaqForm(faq);
                    }}
                    className="text-gray-400 hover:text-black cursor-pointer"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteFaq(faq.id)}
                    className="text-gray-400 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
};

export default LoyaltyFaqsEditor;
