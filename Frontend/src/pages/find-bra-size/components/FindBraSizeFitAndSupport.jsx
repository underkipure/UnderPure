import React from "react";
import { Link } from "react-router-dom";

export default function FindBraSizeFitAndSupport({ fitSection, supportSection }) {
  return (
    <>
      {/* ── FIT 101 SECTION ─── */}
      <section className="py-16 px-6 bg-white text-center">
        <div className="max-w-[700px] mx-auto">
          <p className="text-[13.5px] text-gray-600 font-sans leading-[1.8] mb-8">
            {fitSection?.description ||
              "Band too tight or straps sliding off your shoulders? Get schooled on all things bra fit & sister sizing below."}
          </p>
          <Link
            to={fitSection?.buttonUrl || "/"}
            className="inline-block bg-black text-white text-[11px] uppercase tracking-[0.12em] font-bold px-12 py-4 hover:bg-gray-800 transition-colors"
          >
            {fitSection?.buttonText || "BRA FIT 101"}
          </Link>
        </div>
      </section>

      {/* ── SUPPORT SECTION ─── */}
      <section className="py-16 px-6 bg-white text-center" id="support">
        <div className="max-w-[700px] mx-auto">
          <h2 className="text-3xl lg:text-4xl font-serif text-black mb-6">
            {supportSection?.headingPrefix || "we"}{" "}
            <em className="italic">
              {supportSection?.headingItalic || "support you"}
            </em>
          </h2>
          <p className="text-[13px] text-gray-600 font-sans leading-[1.9] mb-8">
            {supportSection?.description ||
              "Still need help? Chat with a Underpure stylist for more information, or book an in-store fitting with a bra specialist below (we recommend a professional fitting every 6 months to a year)."}
          </p>
          <button
            onClick={() =>
              window.dispatchEvent(new CustomEvent("open-chat-widget"))
            }
            className="inline-block bg-black text-white text-[11px] uppercase tracking-[0.12em] font-bold px-12 py-4 hover:bg-gray-800 transition-colors"
          >
            {supportSection?.buttonText || "CHAT WITH UNDERPURE"}
          </button>
        </div>
      </section>
    </>
  );
}
