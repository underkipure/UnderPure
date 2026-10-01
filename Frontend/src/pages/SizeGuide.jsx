import React, { useEffect } from "react";
import { useSiteSettingsStore } from "../store/siteSettingsStore";
import { SizeGuideTable } from "../components/shared/products";

export default function SizeGuide() {
  const settings = useSiteSettingsStore();
  const sizeGuideData = settings.productDetailSettings?.sizeGuide;

  useEffect(() => {
    document.title = "Size Guide - Underpure";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif text-black mb-10 text-center italic">
          Size Guide
        </h1>

        <div className="bg-white p-6 sm:p-10 border border-gray-100 shadow-sm">
          <SizeGuideTable
            table={sizeGuideData?.table}
            columns={sizeGuideData?.columns}
            note={sizeGuideData?.note}
            variant="standalone"
          />
        </div>
      </div>
    </div>
  );
}
