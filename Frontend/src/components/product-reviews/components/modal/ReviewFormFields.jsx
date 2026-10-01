import React from "react";
import { AGE_RANGES, SIZES } from "../../constants";

export function ReviewFormFields({
  title,
  setTitle,
  text,
  setText,
  formAge,
  setFormAge,
  formSizePurchased,
  setFormSizePurchased,
  formTrueSize,
  setFormTrueSize,
  user,
}) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[11px] font-bold font-sans uppercase tracking-widest mb-2 text-black">
            Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Review Title"
            className="w-full border border-gray-300 p-3 text-[13px] outline-none focus:border-black transition-colors"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold font-sans uppercase tracking-widest mb-2 text-black">
            Review
          </label>
          <textarea
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your review here..."
            rows="1"
            className="w-full border border-gray-300 p-3 text-[13px] outline-none focus:border-black transition-colors min-h-[46px]"
          ></textarea>
        </div>
      </div>

      {/* Extra Details for Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
        <div>
          <label
            htmlFor="review-age-select"
            className="block text-[11px] font-bold font-sans uppercase tracking-widest mb-2 text-black"
          >
            Age Range
          </label>
          <select
            id="review-age-select"
            aria-label="Age Range"
            value={formAge}
            onChange={(e) => setFormAge(e.target.value)}
            className="w-full border border-gray-300 p-3 text-[13px] outline-none focus:border-black transition-colors bg-white"
          >
            <option value="">Select Age</option>
            {AGE_RANGES.map((age) => (
              <option key={age} value={age}>
                {age}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="review-size-purchased-select"
            className="block text-[11px] font-bold font-sans uppercase tracking-widest mb-2 text-black"
          >
            Size Purchased
          </label>
          <select
            id="review-size-purchased-select"
            aria-label="Size Purchased"
            value={formSizePurchased}
            onChange={(e) => setFormSizePurchased(e.target.value)}
            className="w-full border border-gray-300 p-3 text-[13px] outline-none focus:border-black transition-colors bg-white"
          >
            <option value="">Select Size</option>
            {SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="review-true-size-select"
            className="block text-[11px] font-bold font-sans uppercase tracking-widest mb-2 text-black"
          >
            True Size
          </label>
          <select
            id="review-true-size-select"
            aria-label="True Size"
            value={formTrueSize}
            onChange={(e) => setFormTrueSize(e.target.value)}
            className="w-full border border-gray-300 p-3 text-[13px] outline-none focus:border-black transition-colors bg-white"
          >
            <option value="">Select Size</option>
            {SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hidden Name/Email as they are pulled from Auth */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div>
          <label className="block text-[11px] font-bold font-sans uppercase tracking-widest mb-2 text-gray-500">
            Name
          </label>
          <input
            type="text"
            readOnly
            value={user?.name || ""}
            className="w-full border border-gray-200 bg-gray-50 p-3 text-[13px] outline-none text-gray-500"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold font-sans uppercase tracking-widest mb-2 text-gray-500">
            Email
          </label>
          <input
            type="email"
            readOnly
            value={user?.email || ""}
            className="w-full border border-gray-200 bg-gray-50 p-3 text-[13px] outline-none text-gray-500"
          />
        </div>
      </div>
    </>
  );
}
