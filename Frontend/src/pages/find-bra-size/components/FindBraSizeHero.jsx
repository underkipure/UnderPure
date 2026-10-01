import React from "react";

export default function FindBraSizeHero({ hero, onGetStarted }) {
  return (
    <section
      id="find-size"
      className="flex flex-col lg:flex-row min-h-[520px] lg:min-h-[600px]"
    >
      {/* Image */}
      <div
        className="w-full lg:w-1/2 overflow-hidden max-h-[680px]"
      >
        {hero?.image ? (
          <img
            src={hero.image}
            alt="Find your bra size"
            className="w-full h-full object-cover min-h-[380px]"
          />
        ) : (
          <div
            className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 min-h-[380px]"
          >
            Hero Image
          </div>
        )}
      </div>
      {/* Text */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start px-10 lg:px-20 py-16 text-center lg:text-left">
        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-serif text-black mb-6 leading-tight">
          {hero?.headingLine1 || "find your"}{" "}
          <em className="italic">{hero?.headingItalic || "bra"}</em>{" "}
          {hero?.headingLine2 || "size"}
        </h1>
        <p className="text-[14px] text-gray-600 font-sans leading-[1.8] mb-8 max-w-[420px]">
          {hero?.description ||
            "Are you wearing the right size? Finding the right bra can be hard, but we're here to help. Let us get you the support you need."}
        </p>
        <button
          onClick={onGetStarted}
          className="bg-black text-white text-[12px] uppercase tracking-[0.12em] font-bold px-10 py-4 hover:bg-gray-800 transition-colors"
        >
          {hero?.buttonText || "GET STARTED"}
        </button>
      </div>
    </section>
  );
}
