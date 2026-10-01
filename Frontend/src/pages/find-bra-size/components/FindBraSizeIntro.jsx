import React from "react";

export default function FindBraSizeIntro({ intro }) {
  if (!intro) return null;

  return (
    <section
      className="py-16 px-6 text-center max-w-[700px] mx-auto"
      id="style-guide"
    >
      <h2 className="text-3xl lg:text-4xl font-serif text-black mb-5">
        {intro.heading || "before we get"}{" "}
        <em className="italic">{intro.headingItalic || "started..."}</em>
      </h2>
      <p className="text-[13.5px] text-gray-600 font-sans leading-[1.9]">
        {intro.description ||
          "Start by standing in front of a mirror wearing your best-fitting, non-padded underwire bra. You'll also need a soft measuring tape. Remember to measure in inches."}
      </p>
    </section>
  );
}
