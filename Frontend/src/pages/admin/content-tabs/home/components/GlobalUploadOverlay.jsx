import React from 'react';

export default function GlobalUploadOverlay({ isUploading, uploadProgress }) {
  if (!isUploading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full space-y-4">
        <div className="flex items-center gap-3">
          <div className="animate-spin inline-block w-6 h-6 border-2 border-black border-t-transparent rounded-full" />
          <h3 className="font-serif text-lg">Uploading Media...</h3>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-black h-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
        <p className="text-right text-xs uppercase tracking-widest text-gray-500">
          {uploadProgress}% complete
        </p>
      </div>
    </div>
  );
}
