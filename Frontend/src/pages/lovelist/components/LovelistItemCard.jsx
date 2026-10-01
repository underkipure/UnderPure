import React from 'react';
import { X } from 'lucide-react';
import { optimizeImage } from '../../../lib/productUtils';

export default function LovelistItemCard({
  item,
  onRemove,
  onAddToCart,
  buttonText = 'ADD TO CART'
}) {
  const product = item.product || item;
  const imageUrl = item.image || item.images?.[0]?.image_url || product?.images?.[0]?.image_url || '';
  const title = item.name || product?.name || '';
  const color = item.color || product?.color || '';
  const size = item.size || product?.size || '';
  const price = parseFloat(item.price || product?.price || 0);

  return (
    <div className="w-[160px] md:w-[200px] border border-black relative ml-0 md:ml-12 mt-6 flex flex-col">
      <button
        onClick={() => onRemove(item.product_id || item.id)}
        className="absolute top-3 right-3 text-black-400 hover:text-black z-10"
        title="Remove item"
      >
        <X size={20} strokeWidth={1.5} />
      </button>

      <div className="w-full h-[120px] md:h-[190px] bg-gray-100 relative overflow-hidden">
        <img
          src={optimizeImage(imageUrl, 400)}
          alt={title}
          className="w-full h-full object-cover object-top"
          loading="lazy"
        />
      </div>

      <div className="px-3 py-1 flex flex-col items-start text-left bg-white">
        <p className="text-[11px] md:text-[14px] font-bold text-[#4a4f5c] tracking-[0.0001em] line-clamp-1">
          {title}
        </p>

        {(color || size) && (
          <p className="text-[13px] text-[#4a4f5c] mb-1">
            {color} {color && size ? '/' : ''} {size}
          </p>
        )}

        <p className="text-[16px] font-bold text-[#33363f] mb-1">
          Rs. {price.toLocaleString()}
        </p>
      </div>

      <button
        onClick={() => onAddToCart(product)}
        className="w-full py-2 md:py-3.5 bg-[#f5cfc4] text-white text-[13px] font-bold tracking-widest uppercase hover:opacity-90 transition-opacity mt-auto"
      >
        {buttonText}
      </button>
    </div>
  );
}
