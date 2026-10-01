import React from 'react';
import { Link } from 'react-router-dom';
import LovelistItemCard from './LovelistItemCard';

export default function LovelistGrid({
  activeTab,
  items,
  pageConfig,
  onRemove,
  onAddToCart
}) {
  const isLovelistTab = activeTab === 'lovelist';

  if (items.length > 0) {
    return (
      <div className="pt-2 flex justify-start items-start bg-white min-h-[300px] flex-wrap mb-8 md:mb-16">
        {items.map((item) => (
          <LovelistItemCard
            key={item.id || item.product_id}
            item={item}
            onRemove={onRemove}
            onAddToCart={onAddToCart}
            buttonText={pageConfig.buttons?.addToCart || 'ADD TO CART'}
          />
        ))}
      </div>
    );
  }

  if (isLovelistTab) {
    return (
      <div className="p-16 flex flex-col items-center justify-center bg-white min-h-[300px] text-center mb-16">
        <p className="text-[14px] font-bold text-[#4a4f5c] mb-6">
          {pageConfig.emptyLovelist?.title || 'Your Lovelist is currently empty.'}
        </p>
        <Link
          to={pageConfig.emptyLovelist?.link || '/collections/all'}
          className="inline-block bg-[#515866] text-white px-8 py-3 text-[12px] font-bold hover:opacity-90 transition-opacity"
        >
          {pageConfig.emptyLovelist?.buttonText || 'CONTINUE SHOPPING'}
        </Link>
      </div>
    );
  }

  return (
    <div className="border-x border-b border-gray-200 p-8 md:p-16 flex flex-col items-center justify-center bg-white min-h-[300px] text-center mb-16">
      <h3 className="text-[20px] md:text-[18px] text-black mb-4 tracking-wide">
        {pageConfig.emptySaved?.title || 'Save Your Favorite Items'}
      </h3>
      <p className="text-[13px] md:text-[14px] font-medium text-black mb-8 px-4">
        {pageConfig.emptySaved?.subtitle || 'Want to save an item for later? Simply click the heart icon on any product.'}
      </p>
      <Link
        to={pageConfig.emptySaved?.link || '/collections/all'}
        className="bg-[#4a4f5c] text-white px-8 py-3.5 text-[14px] font-bold hover:opacity-90 transition-opacity"
      >
        {pageConfig.emptySaved?.buttonText || 'EXPLORE COLLECTION'}
      </Link>
    </div>
  );
}
