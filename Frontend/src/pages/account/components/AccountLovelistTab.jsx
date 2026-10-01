import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { optimizeImage } from "../../../lib/productUtils";

export default function AccountLovelistTab({
  d,
  lovelist,
  lovelistLoading,
  removeFromLovelist,
}) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end pb-4">
        <div>
          <h2 className="font-serif text-[18px] md:text-[20px] uppercase tracking-wider text-black">
            {d?.navigation?.tab3 || "Your Lovelist"}
          </h2>
          <p className="text-[12px] font-sans text-gray-500 mt-1">
            {lovelist.length} items saved
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8">
        {lovelistLoading ? (
          <div className="col-span-full py-16 text-center">
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : lovelist.length === 0 ? (
          <div className="col-span-full py-12 text-center border border-gray-200 rounded-lg">
            <Heart
              size={28}
              strokeWidth={1}
              className="mx-auto mb-3 text-gray-300"
            />
            <h3 className="font-serif text-lg mb-1">
              Your lovelist is empty
            </h3>
            <p className="text-[12px] text-gray-400 mb-5">
              Save your favorite pieces here.
            </p>
            <Link
              to="/collections/new-arrivals"
              className="bg-black text-white px-6 py-2.5 text-[11px] uppercase tracking-widest hover:bg-gray-800 transition-colors inline-block"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          lovelist.map((item) => (
            <div key={item.id} className="group cursor-pointer">
              <div className="relative aspect-[3/4] bg-gray-100 mb-3 overflow-hidden">
                <img
                  loading="lazy"
                  src={
                    optimizeImage(
                      item.images?.[0]?.image_url ||
                      item.image ||
                      "",
                      500
                    )
                  }
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeFromLovelist(item.product_id || item.id);
                  }}
                  className="absolute top-3 right-3 w-8 h-8 bg-white flex items-center justify-center rounded-full shadow-sm hover:scale-110 transition-transform"
                >
                  <Heart size={14} className="fill-black text-black" />
                </button>
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-[12px] font-sans uppercase tracking-wider leading-relaxed">
                  {item.name}
                </h3>
                <p className="text-[13px] font-sans">
                  Rs. {parseFloat(item.price).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
