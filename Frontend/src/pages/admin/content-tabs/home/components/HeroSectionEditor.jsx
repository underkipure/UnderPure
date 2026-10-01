import React from 'react';
import { Camera, Save } from 'lucide-react';

export default function HeroSectionEditor({
  heroData,
  setHeroData,
  uploadingHero,
  uploadProgress,
  handleHeroMediaUpload,
  saveHeroData,
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
          Heading
        </label>
        <input
          type="text"
          value={heroData.heading || ''}
          onChange={e => setHeroData({ ...heroData, heading: e.target.value })}
          className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black font-serif"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Button Text
          </label>
          <input
            type="text"
            value={heroData.buttonText ?? ''}
            onChange={e => setHeroData({ ...heroData, buttonText: e.target.value })}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black uppercase tracking-widest"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Text &amp; Button Color
          </label>
          <div className="flex items-center border border-black/20 h-[46px] p-1 px-2 bg-white">
            <input
              type="color"
              value={heroData.buttonColor || '#FFFFFF'}
              onChange={e => setHeroData({ ...heroData, buttonColor: e.target.value })}
              className="w-8 h-8 cursor-pointer border-0 p-0"
            />
            <span className="ml-3 text-sm text-gray-600 uppercase tracking-widest">
              {heroData.buttonColor || '#FFFFFF'}
            </span>
          </div>
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
            Button Link
          </label>
          <input
            type="text"
            value={heroData.buttonLink || ''}
            onChange={e => setHeroData({ ...heroData, buttonLink: e.target.value })}
            className="w-full border border-black/20 p-3 text-sm focus:outline-none focus:border-black"
          />
        </div>
      </div>
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
          Background Media (Image or Video)
        </label>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {heroData.mediaUrl && heroData.mediaType === 'video' ? (
            <video
              src={heroData.mediaUrl}
              className="w-16 h-16 object-cover border border-black/20"
              autoPlay
              loop
              muted
            />
          ) : heroData.mediaUrl ? (
            <img
              loading="lazy"
              src={heroData.mediaUrl}
              alt="Hero"
              className="w-16 h-16 object-cover border border-black/20"
            />
          ) : null}
          <label
            className={`px-4 py-3 text-xs uppercase tracking-widest whitespace-nowrap transition-colors flex items-center gap-2 ${
              uploadingHero
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-black hover:bg-gray-800 cursor-pointer text-white'
            }`}
          >
            {uploadingHero ? (
              <>
                <span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" />{' '}
                Uploading {uploadProgress}%
              </>
            ) : (
              <>
                <Camera size={14} /> Upload Media
              </>
            )}
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleHeroMediaUpload}
              disabled={uploadingHero}
            />
          </label>
          <span className="text-[10px] text-gray-400">
            Videos will automatically loop &amp; mute without controls.
          </span>
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={saveHeroData}
          disabled={uploadingHero}
          className={`text-white px-6 py-2 text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer ${
            uploadingHero ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
          }`}
        >
          <Save size={14} />{' '}
          {uploadingHero ? `Uploading ${uploadProgress}%...` : 'Save Hero Section'}
        </button>
      </div>
    </div>
  );
}
