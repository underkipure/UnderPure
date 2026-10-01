import React from "react";
import { Link } from "react-router-dom";
import { useSiteSettingsStore, DEFAULTS } from "../../../store/siteSettingsStore";
import { sanitizeHtml } from "../../../utils/sanitizeHtml";

export const CheckoutPolicyModal = ({
  popupContent,
  setPopupContent,
  checkoutSettings = {},
  footerData = {},
  contactEmail = "",
  contactPhone = "",
}) => {
  if (!popupContent) return null;

  // Pull live CMS data from store
  const privacyPolicyData = useSiteSettingsStore((s) => s.privacyPolicyData) || DEFAULTS.privacyPolicyData || {};
  const termsOfServiceData = useSiteSettingsStore((s) => s.termsOfServiceData) || DEFAULTS.termsOfServiceData || {};
  const returnsData = useSiteSettingsStore((s) => s.returnsData) || DEFAULTS.returnsData || {};
  const shippingRates = useSiteSettingsStore((s) => s.shippingRates) || DEFAULTS.shippingRates || [];

  const cs = checkoutSettings || {};
  const fd = footerData || {};
  const rawEmail = contactEmail || fd.contactEmail || "";
  const rawPhone = contactPhone || fd.contactPhone || "";
  const activeEmail = typeof rawEmail === "string" ? rawEmail : String(rawEmail || "");
  const activePhone =
    typeof rawPhone === "string"
      ? rawPhone
      : rawPhone && typeof rawPhone === "object"
      ? String(rawPhone.phone || rawPhone.number || "")
      : String(rawPhone || "");
  const cleanPhone = String(activePhone).replace(/[^0-9+]/g, "");

  // Build dynamic fallback content from live CMS data
  const buildReturnsFallback = () => {
    const summary = returnsData.boldPolicy1 || "";
    const finalSale = returnsData.finalSaleText || "";
    const combined = [summary, finalSale].filter(Boolean).join("\n\n");
    return { heading: "Returns", body: combined || "Please visit our returns page for the latest return policy details." };
  };

  const buildShippingFallback = () => {
    const rateLines = shippingRates.map(
      (r) => `${r.name}: ${r.price === 0 ? "Free" : `Rs. ${r.price}`} (${r.minDays}-${r.maxDays} business days)`
    );
    const body = rateLines.length > 0
      ? `Available shipping options:\n${rateLines.join("\n")}`
      : "Please visit our shipping page for the latest shipping information.";
    return { heading: "Shipping Policy", body };
  };

  const buildPrivacyFallback = () => {
    const intro = (privacyPolicyData.introParagraphs || []).join("\n\n");
    const firstSection = (privacyPolicyData.sections || [])[0];
    return {
      heading1: privacyPolicyData.lastUpdated || "",
      body1: intro,
      heading2: firstSection?.title || "",
      body2: (firstSection?.paragraphs || []).join("\n\n"),
    };
  };

  const buildTermsFallback = () => {
    const sections = termsOfServiceData.sections || [];
    const first = sections[0];
    const second = sections[1];
    return {
      heading1: first?.title || "",
      body1: (first?.paragraphs || []).join("\n\n"),
      heading2: second?.title || "",
      body2: (second?.paragraphs || []).join("\n\n"),
    };
  };

  const renderPolicySection = (h1, b1, h2, b2) => (
    <div className="space-y-6">
      {(h1 || b1) && (
        <div className="space-y-3">
          {h1 && <h3 className="font-bold text-[0.6875rem] uppercase tracking-[0.0001em] text-black">{h1}</h3>}
          {b1 && (
            <div className="space-y-3">
              {String(b1).split('\n').map((para, i) => para.trim() ? (
                <p key={i} className="leading-relaxed text-gray-700">{para}</p>
              ) : null)}
            </div>
          )}
        </div>
      )}
      {(h2 || b2) && (
        <div className="space-y-3 pt-4 border-t border-gray-200/60">
          {h2 && <h3 className="font-bold text-[0.6875rem] uppercase tracking-[0.0001em] text-black">{h2}</h3>}
          {b2 && (
            <div className="space-y-3">
              {String(b2).split('\n').map((para, i) => para.trim() ? (
                <p key={i} className="leading-relaxed text-gray-700">{para}</p>
              ) : null)}
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Resolve refund/returns content
  const renderRefund = () => {
    if (cs.dialogRefundHeading1 || cs.dialogRefundBody1) {
      return renderPolicySection(cs.dialogRefundHeading1, cs.dialogRefundBody1, cs.dialogRefundHeading2, cs.dialogRefundBody2);
    }
    if (cs.dialogRefundContent) {
      return <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(cs.dialogRefundContent) }} />;
    }
    const fb = buildReturnsFallback();
    return renderPolicySection(fb.heading, fb.body, "", "");
  };

  // Resolve terms content
  const renderTerms = () => {
    if (cs.dialogTermsHeading1 || cs.dialogTermsBody1) {
      return renderPolicySection(cs.dialogTermsHeading1, cs.dialogTermsBody1, cs.dialogTermsHeading2, cs.dialogTermsBody2);
    }
    if (cs.dialogTermsContent) {
      return <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(cs.dialogTermsContent) }} />;
    }
    const fb = buildTermsFallback();
    return renderPolicySection(fb.heading1, fb.body1, fb.heading2, fb.body2);
  };

  // Resolve privacy content
  const renderPrivacy = () => {
    if (cs.dialogPrivacyHeading1 || cs.dialogPrivacyBody1) {
      return renderPolicySection(cs.dialogPrivacyHeading1, cs.dialogPrivacyBody1, cs.dialogPrivacyHeading2, cs.dialogPrivacyBody2);
    }
    if (cs.dialogPrivacyContent) {
      return <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(cs.dialogPrivacyContent) }} />;
    }
    const fb = buildPrivacyFallback();
    return renderPolicySection(fb.heading1, fb.body1, fb.heading2, fb.body2);
  };

  // Resolve shipping content
  const renderShipping = () => {
    if (cs.dialogShippingHeading1 || cs.dialogShippingBody1) {
      return renderPolicySection(cs.dialogShippingHeading1, cs.dialogShippingBody1, cs.dialogShippingHeading2, cs.dialogShippingBody2);
    }
    if (cs.dialogShippingContent) {
      return <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(cs.dialogShippingContent) }} />;
    }
    const fb = buildShippingFallback();
    return renderPolicySection(fb.heading, fb.body, "", "");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-black/50 sm:items-center items-end">
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-lg rounded-t-lg shadow-xl max-h-[90vh] flex flex-col relative animate-fade-in-up">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-[1.1875rem] font-serif text-black uppercase tracking-wider">
            {popupContent === "refund" && (cs.dialogRefundTitle || "Returns")}
            {popupContent === "shipping" && (cs.dialogShippingTitle || "Shipping Policy")}
            {popupContent === "privacy" && (cs.dialogPrivacyTitle || "Privacy Policy")}
            {popupContent === "terms" && (cs.dialogTermsTitle || "Terms of Service")}
            {popupContent === "contact" && (cs.dialogContactTitle || "Contact")}
          </h2>
          <button
            onClick={() => setPopupContent(null)}
            className="text-gray-500 hover:text-black transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto font-sans text-[0.6875rem] text-gray-800 leading-relaxed">
          {popupContent === "refund" && renderRefund()}

          {popupContent === "contact" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-[0.6875rem] uppercase mb-1">
                  {cs.dialogContactHeading || cs.contactTitle || "CONTACT US"}
                </h3>
                <p className="text-gray-700">
                  Customer Service Hours
                  <br />
                  {cs.dialogContactServiceHours || cs.contactServiceHours || fd.contactServiceHours || "M-F, 10AM-6PM EST"}
                </p>
              </div>
              {activeEmail && (
                <div>
                  <h3 className="text-[0.6875rem] mb-1 font-semibold text-black">Email us</h3>
                  <a
                    href={`mailto:${activeEmail}`}
                    className="text-[#90134a] hover:underline"
                  >
                    {activeEmail}
                  </a>
                </div>
              )}
              {activePhone && cleanPhone && (
                <div>
                  <h3 className="text-[0.6875rem] mb-1 font-semibold text-black">Call or text us</h3>
                  <a
                    href={`tel:${cleanPhone}`}
                    className="text-[#90134a] hover:underline"
                  >
                    {activePhone}
                  </a>
                </div>
              )}
              <div>
                <h3 className="text-[0.6875rem] mb-1 font-semibold text-black">Returns</h3>
                <Link
                  to="/returns"
                  onClick={() => setPopupContent(null)}
                  className="text-[#90134a] hover:underline font-medium inline-block"
                >
                  Visit Returns Center
                </Link>
              </div>
            </div>
          )}

          {popupContent === "terms" && renderTerms()}
          {popupContent === "privacy" && renderPrivacy()}
          {popupContent === "shipping" && renderShipping()}
        </div>
      </div>
    </div>
  );
};
