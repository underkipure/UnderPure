import React from "react";

const SectionWithImage = ({ image, imageAlt, textLeft, children }) => (
  <div
    className={`flex flex-col ${
      textLeft ? "lg:flex-row" : "lg:flex-row-reverse"
    } min-h-[600px]`}
  >
    {/* Image */}
    <div className="w-full lg:w-1/2 overflow-hidden">
      <img
        src={image}
        alt={imageAlt || ""}
        className="w-full h-full object-cover min-h-[400px]"
      />
    </div>
    {/* Text */}
    <div
      className={`w-full lg:w-1/2 flex flex-col justify-center px-10 lg:px-16 xl:px-20 py-14`}
    >
      {children}
    </div>
  </div>
);

export default function FindBraSizeSection({ section, idx }) {
  return (
    <section id={section.anchor || `section-${idx}`} key={idx}>
      <SectionWithImage
        image={section.image}
        imageAlt={section.imageAlt}
        textLeft={idx % 2 !== 0} // Alternate: image-right, image-left
      >
        <h2 className="text-3xl lg:text-4xl font-serif text-black mb-6">
          {section.headingPrefix && <span>{section.headingPrefix} </span>}
          <em className="italic">{section.headingItalic}</em>
        </h2>
        {(section.paragraphs || []).map((p, pIdx) => (
          <p
            key={pIdx}
            className="text-[13px] text-black font-sans leading-[1.85] mb-3"
          >
            {p}
          </p>
        ))}
        {(section.steps || []).length > 0 && (
          <ol className="space-y-3 mb-5">
            {section.steps.map((step, sIdx) => (
              <li
                key={sIdx}
                className="flex items-start gap-2 text-[13px] text-black font-sans leading-[1.8]"
              >
                <span className="flex-shrink-0 font-medium">{sIdx + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        )}
        {section.hotTip && (
          <div className="mt-3">
            <p className="text-[12px] font-bold uppercase tracking-[0.05em] text-black mb-1">
              Hot Tip
            </p>
            <p className="text-[13px] text-black font-sans leading-[1.8]">
              {section.hotTip}
            </p>
          </div>
        )}
      </SectionWithImage>
    </section>
  );
}
