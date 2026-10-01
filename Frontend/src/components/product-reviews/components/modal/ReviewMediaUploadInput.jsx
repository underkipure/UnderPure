import React from "react";
import { Upload } from "lucide-react";

export function ReviewMediaUploadInput({
  mediaPreview,
  mediaFile,
  handleMediaChange,
}) {
  return (
    <div className="mt-4">
      <label className="block text-[11px] font-bold font-sans uppercase tracking-widest mb-2 text-black">
        Add Photo or Video
      </label>
      <label className="cursor-pointer border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors group relative">
        {mediaPreview ? (
          <div className="w-full h-32 relative">
            {mediaFile?.type?.startsWith("video") ? (
              <video
                src={mediaPreview}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={mediaPreview}
                className="w-full h-full object-cover"
                alt="Preview"
              />
            )}
          </div>
        ) : (
          <>
            <Upload className="w-6 h-6 text-gray-400 group-hover:text-black mb-2 transition-colors" />
            <span className="text-[12px] font-bold font-sans text-gray-500 group-hover:text-black transition-colors">
              Click to upload media
            </span>
          </>
        )}
        <input
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleMediaChange}
        />
      </label>
    </div>
  );
}
