import React from "react";
import { Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Section, Field } from "./ReturnsFormPrimitives";

export default function ReturnsBannerSection({ data, onUpdate, onUploadImage }) {
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        toast.info("Uploading...");
        const url = await onUploadImage(file);
        onUpdate({ bannerImage: url });
        toast.success("Done!");
      } catch {
        toast.error("Failed");
      }
    }
  };

  return (
    <Section title="Top Banner & Button">
      <Field label="Top Hero Background Image">
        <div className="flex items-start gap-4">
          {data.bannerImage && (
            <img
              loading="lazy"
              src={data.bannerImage}
              alt="Hero"
              className="h-24 w-auto object-cover border border-black/10"
            />
          )}
          <label className="border border-black/20 px-4 py-2 text-[10px] uppercase tracking-widest cursor-pointer hover:border-black flex items-center gap-2">
            <ImageIcon size={12} /> Upload
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <Field label="Button Text">
          <input
            type="text"
            value={data.buttonText || ""}
            onChange={(e) => onUpdate({ buttonText: e.target.value })}
            className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black font-serif italic"
          />
        </Field>
        <Field label="Button Link">
          <input
            type="text"
            value={data.buttonLink || ""}
            onChange={(e) => onUpdate({ buttonLink: e.target.value })}
            className="w-full border border-black/20 p-2.5 text-sm focus:outline-none focus:border-black font-sans"
          />
        </Field>
      </div>
    </Section>
  );
}
