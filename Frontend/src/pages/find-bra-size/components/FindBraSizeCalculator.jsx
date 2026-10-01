import React from "react";
import { Link } from "react-router-dom";

export default function FindBraSizeCalculator({
  calculatorRef,
  calculator,
  band,
  setBand,
  bust,
  setBust,
  handleCalculate,
  error,
  result,
}) {
  return (
    <section
      id="calculator"
      ref={calculatorRef}
      className="py-20 px-6 text-center bg-white"
    >
      <div className="max-w-[700px] mx-auto">
        <h2 className="text-3xl lg:text-4xl font-serif text-black mb-3">
          {calculator?.headingPrefix || "your"}{" "}
          <em className="italic">{calculator?.headingItalic || "Underpure"}</em>{" "}
          {calculator?.headingSuffix || "size"}
        </h2>
        <p className="text-[13.5px] text-gray-600 font-sans leading-[1.85] mb-10">
          {calculator?.description ||
            "Our products may vary in size from your universal sizing. Use the calculator below to determine your best fitting Underpure sizes."}
        </p>

        {/* Inputs */}
        <div className="flex flex-col sm:flex-row gap-0 mb-4 max-w-[600px] mx-auto">
          <input
            type="number"
            value={band}
            onChange={(e) => setBand(e.target.value)}
            placeholder={
              calculator?.bandPlaceholder || "Band measurement (inches)"
            }
            className="flex-1 border border-black/30 px-5 py-4 text-[14px] font-sans focus:outline-none focus:border-black text-center"
          />
          <input
            type="number"
            value={bust}
            onChange={(e) => setBust(e.target.value)}
            placeholder={
              calculator?.bustPlaceholder || "Bust measurement (inches)"
            }
            className="flex-1 border border-black/30 border-t-0 sm:border-t sm:border-l-0 px-5 py-4 text-[14px] font-sans focus:outline-none focus:border-black text-center"
          />
          <button
            onClick={handleCalculate}
            className="bg-black text-white text-[11px] uppercase tracking-[0.12em] font-bold px-8 py-4 hover:bg-gray-800 transition-colors whitespace-nowrap border border-black"
          >
            {calculator?.buttonText || "GET MY SIZE"}
          </button>
        </div>
        {error && <p className="text-red-500 text-[12px] mb-4">{error}</p>}

        {/* Result */}
        {result && (
          <div className="border border-black/15 py-8 px-8 max-w-[600px] mx-auto">
            <p className="text-[14px] text-black font-sans mb-1">
              Your size is{" "}
              <span className="font-bold text-[16px]">{result.size}</span>.
            </p>
            <p className="text-[13px] text-gray-600 font-sans mb-6">
              {calculator?.resultMessage ||
                "Shop our collection to find your perfect fit."}
            </p>
            {(calculator?.shopButtons || []).map((btn, bIdx) => (
              <Link
                key={bIdx}
                to={btn.url || "/"}
                className="inline-block bg-black text-white text-[11px] uppercase tracking-[0.12em] font-bold px-8 py-3 hover:bg-gray-800 transition-colors mx-2 mb-2"
              >
                {btn.label || "SHOP NOW"}
              </Link>
            ))}
            {(!calculator?.shopButtons ||
              calculator.shopButtons.length === 0) && (
              <Link
                to="/bras"
                className="inline-block bg-black text-white text-[11px] uppercase tracking-[0.12em] font-bold px-8 py-3 hover:bg-gray-800 transition-colors"
              >
                SHOP BRAS
              </Link>
            )}
          </div>
        )}

        <p className="text-[11px] text-gray-400 font-sans mt-6 uppercase tracking-widest">
          {calculator?.note || "All sizes in inches"}
        </p>
      </div>
    </section>
  );
}
