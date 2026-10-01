import React, { useState, useRef } from "react";
import { useSiteSettingsStore, DEFAULTS } from "../../store/siteSettingsStore";
import SEO from "../../components/SEO";
import { calculateBraSize } from "./utils/braSizeCalculator";
import FindBraSizeHero from "./components/FindBraSizeHero";
import FindBraSizeNav from "./components/FindBraSizeNav";
import FindBraSizeIntro from "./components/FindBraSizeIntro";
import FindBraSizeSection from "./components/FindBraSizeSection";
import FindBraSizeCalculator from "./components/FindBraSizeCalculator";
import FindBraSizeCarousel from "./components/FindBraSizeCarousel";
import FindBraSizeFitAndSupport from "./components/FindBraSizeFitAndSupport";

const DEFAULT_NAV_TABS = [
  { label: "Find Your Bra Size", anchor: "find-size" },
  { label: "Bra Style Guide", anchor: "style-guide" },
  { label: "The Band", anchor: "the-band" },
  { label: "The Bust", anchor: "the-bust" },
  { label: "Size Calculator", anchor: "calculator" },
];

const FindYourBraSize = () => {
  const { braSizeData } = useSiteSettingsStore();
  const d = braSizeData || DEFAULTS.braSizeData || {};

  const calculatorRef = useRef(null);
  const [band, setBand] = useState("");
  const [bust, setBust] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    if (!band || !bust) {
      setError("Please enter both measurements.");
      return;
    }
    const res = calculateBraSize(band, bust);
    if (!res) {
      setError("Please enter valid numbers.");
      return;
    }
    setError("");
    setResult(res);
  };

  const scrollToCalculator = () => {
    calculatorRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const navTabs = d.navTabs || DEFAULT_NAV_TABS;

  return (
    <div className="min-h-screen bg-white">
      <SEO title={(d.hero?.heading || "Find Your Bra Size") + " | Underpure"} />

      {/* Hero */}
      <FindBraSizeHero hero={d.hero} onGetStarted={scrollToCalculator} />

      {/* Sticky Nav */}
      <FindBraSizeNav tabs={navTabs} />

      {/* Intro */}
      <FindBraSizeIntro intro={d.intro} />

      {/* Sections (e.g. The Band, The Bust) */}
      {(d.sections || []).map((section, idx) => (
        <FindBraSizeSection key={idx} section={section} idx={idx} />
      ))}

      {/* Size Calculator */}
      <FindBraSizeCalculator
        calculatorRef={calculatorRef}
        calculator={d.calculator}
        band={band}
        setBand={setBand}
        bust={bust}
        setBust={setBust}
        handleCalculate={handleCalculate}
        error={error}
        result={result}
      />

      {/* Extra Sections Carousel (Bra Style Guide Carousel) */}
      <FindBraSizeCarousel extraSections={d.extraSections} />

      {/* Fit 101 & Support Sections */}
      <FindBraSizeFitAndSupport
        fitSection={d.fitSection}
        supportSection={d.supportSection}
      />
    </div>
  );
};

export default FindYourBraSize;
