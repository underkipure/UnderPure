import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { getProductSizeStock } from "../../../utils/stockUtils";
import { optimizeImage } from "../../../lib/productUtils";

export default function CompleteTheLookItem({ item, addToCart }) {
  const itemColors = [];
  const inventory = Array.isArray(item.inventory)
    ? item.inventory
    : typeof item.inventory === "object" && item.inventory !== null
      ? Object.values(item.inventory)
      : [];

  if (inventory.length > 0) {
    inventory.forEach((inv) => {
      if (inv.color && !itemColors.includes(inv.color)) {
        itemColors.push(inv.color);
      }
    });
  } else if (Array.isArray(item.colors)) {
    item.colors.forEach((c) => {
      const name = typeof c === "object" && c ? c.name : c;
      if (name && !itemColors.includes(name)) itemColors.push(name);
    });
  } else if (item.color) {
    itemColors.push(item.color);
  }

  const [selectedColor, setSelectedColor] = useState(
    () => itemColors[0] || item.color || "",
  );
  const [selectedSize, setSelectedSize] = useState("");

  const itemTitle = item.title || item.name || "Product";
  const itemPrice = item.price || 0;

  let itemImage =
    item.image ||
    (Array.isArray(item.images) && item.images.length > 0
      ? item.images[0].image_url || item.images[0]
      : "");

  if (inventory.length > 0 && selectedColor) {
    const colorInv = inventory.find(
      (inv) =>
        inv.color && inv.color.toLowerCase() === selectedColor.toLowerCase(),
    );
    if (
      colorInv &&
      Array.isArray(colorInv.images) &&
      colorInv.images.length > 0
    ) {
      itemImage = colorInv.images[0];
    }
  }

  const itemSizes = [];
  if (inventory.length > 0 && selectedColor) {
    const colorInv = inventory.find(
      (inv) =>
        inv.color && inv.color.toLowerCase() === selectedColor.toLowerCase(),
    );
    if (colorInv && Array.isArray(colorInv.sizes)) {
      colorInv.sizes.forEach((s) => {
        const sName = s.size || s.name || String(s);
        if (sName && !itemSizes.includes(sName)) itemSizes.push(sName);
      });
    }
  }

  if (itemSizes.length === 0 && item.sizes) {
    try {
      const parsed =
        typeof item.sizes === "string" ? JSON.parse(item.sizes) : item.sizes;
      if (Array.isArray(parsed)) {
        parsed.forEach((s) => {
          if (typeof s === "object" && s && (s.size || s.name))
            itemSizes.push(s.size || s.name);
          else if (typeof s === "string") itemSizes.push(s);
        });
      }
    } catch (e) {
      if (typeof item.sizes === "string") {
        item.sizes.split(",").forEach((s) => {
          if (s.trim()) itemSizes.push(s.trim());
        });
      }
    }
  }

  const getItemSizeStock = (sizeName) => {
    return getProductSizeStock(item, selectedColor || null, sizeName);
  };

  const isColorOOS =
    getProductSizeStock(item, selectedColor || null, null) <= 0;

  const handleAdd = () => {
    if (isColorOOS) {
      toast.error("Item is out of stock in this color");
      return;
    }
    if (itemSizes.length > 0 && !selectedSize) {
      toast.error("Please select a size first");
      return;
    }
    if (selectedSize && getItemSizeStock(selectedSize) <= 0) {
      toast.error(`Selected size (${selectedSize}) is out of stock`);
      return;
    }

    addToCart({
      ...item,
      id: item.id,
      name: itemTitle,
      title: itemTitle,
      price: itemPrice,
      image: itemImage,
      color: selectedColor || item.color || "Default",
      size: selectedSize || "Default",
      quantity: 1,
    });
    toast.success("Added to bag!");
  };

  let buttonText = "ADD TO BAG";
  let isButtonDisabled = false;

  if (isColorOOS) {
    buttonText = "OUT OF STOCK";
    isButtonDisabled = true;
  } else if (selectedSize) {
    const sizeStock = getItemSizeStock(selectedSize);
    if (sizeStock <= 0) {
      buttonText = "OUT OF STOCK";
      isButtonDisabled = true;
    }
  }

  return (
    <div className="flex gap-7 md:gap-7 items-start">
      <div className="w-[120px] md:w-[140px] aspect-[4/6] bg-[#f5f5f5] shrink-0 overflow-hidden">
        <Link to={`/product/${item.slug || item.id}`}>
          <img
            loading="lazy"
            src={optimizeImage(itemImage, 350)}
            alt={itemTitle}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>
      <div className="flex-1 flex flex-col pt-0">
        <div className="flex justify-between items-start mb-0.5">
          <Link
            to={`/product/${item.slug || item.id}`}
            className="hover:opacity-70"
          >
            <h4 className="text-[13px] font-bold font-sans leading-tight pr-2">
              {itemTitle}
            </h4>
          </Link>
          <span className="text-[13px] font-bold font-sans shrink-0">
            Rs. {Number(itemPrice).toLocaleString()}
          </span>
        </div>

        {itemColors.length > 1 ? (
          <div className="relative w-full md:w-[70%] border border-gray-300 hover:border-black transition-colors mb-2 mt-1">
            <select
              aria-label="Select Color"
              value={selectedColor}
              onChange={(e) => {
                setSelectedColor(e.target.value);
                setSelectedSize("");
              }}
              className="w-full appearance-none bg-transparent py-2 px-3 text-[12px] font-sans font-medium text-black outline-none cursor-pointer pr-8"
            >
              {itemColors.map((c, ci) => (
                <option key={ci} value={c}>
                  Color: {c}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        ) : selectedColor ? (
          <div className="text-[12px] font-bold text-gray-400 font-sans mb-3">
            Color: {selectedColor}
          </div>
        ) : null}

        {itemSizes.length > 0 && (
          <div className="relative w-full md:w-[70%] border border-gray-300 hover:border-black transition-colors mb-2">
            <select
              aria-label="Select Size"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full appearance-none bg-transparent py-2.5 px-3 text-[12px] font-sans text-gray-700 outline-none cursor-pointer pr-8"
            >
              <option value="">Size</option>
              {itemSizes.map((s, si) => {
                const sStock = getItemSizeStock(s);
                const isOOS = sStock <= 0;
                return (
                  <option
                    key={si}
                    value={s}
                    disabled={isOOS}
                    className={isOOS ? "text-gray-400" : "text-black"}
                  >
                    {s} {isOOS ? "(Out of Stock)" : ""}
                  </option>
                );
              })}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        )}

        <button
          disabled={isButtonDisabled}
          onClick={handleAdd}
          className={`w-full md:w-[70%] text-[11px] font-bold uppercase tracking-[0.2em] py-3 border transition-all ${
            isButtonDisabled
              ? "bg-gray-300 text-gray-500 border-transparent cursor-not-allowed"
              : "bg-black text-white border-black hover:bg-white hover:text-black"
          }`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
