import React, { useEffect } from "react";
import { useSiteSettingsStore, DEFAULTS } from "../store/siteSettingsStore";

const ContactUs = () => {
  const { contactEmail, contactPhone, footerData, contactUsData = DEFAULTS.contactUsData } = useSiteSettingsStore();
  const cs = contactUsData?.clientServices || DEFAULTS.contactUsData.clientServices || {};
  const oi = contactUsData?.otherInquiries || DEFAULTS.contactUsData.otherInquiries || {};

  const rawEmail = cs.email || contactEmail || footerData?.contactEmail || "";
  const rawPhone = cs.phone || contactPhone || footerData?.contactPhone || "";
  const activeEmail = typeof rawEmail === "string" ? rawEmail : String(rawEmail || "");
  const activePhone =
    typeof rawPhone === "string"
      ? rawPhone
      : rawPhone && typeof rawPhone === "object"
      ? String(rawPhone.phone || rawPhone.number || "")
      : String(rawPhone || "");
  const cleanPhone = String(activePhone).replace(/[^0-9+]/g, "");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full bg-white font-sans text-center px-1 md:px-8 pt-6 pb-24 md:py-5 max-w-[1200px] mx-auto">
      {/* Page Title */}
      <h1
        className="text-[32px] md:text-[42px] font-dala-roman tracking-wide text-black mb-0 md:mb-0"
      >
        contact us
      </h1>

      {/* Client Services Section */}
      <div className="max-w-[750px] mx-auto mb-16 md:mb-16">
        <h2
          className="text-[19px] md:text-[22px] font-dala-roman tracking-wide text-black mb-3 md:mb-4"
        >
          {cs.title || "client services"}
        </h2>

        <p className="text-[13px] md:text-[13px] text-[#111] leading-[1.7] md:leading-relaxed mb-5 md:mb-4 font-medium tracking-[0.01em] whitespace-pre-line">
          {cs.introText || "UnderPure's Client Services team would be happy to assist you with your online order. Contact us for fit and style advice, delivery inquiries and returns or exchanges. We'll even help you pick out that perfect gift."}
        </p>

        <p className="text-[13px] md:text-[13px] text-[#111] leading-[1.7] md:leading-tight mb-8 font-medium tracking-[0.01em]">
          {cs.hoursText || "UnderPure Client Services representatives are available Monday through Friday, 10AM-6PM EST."}
        </p>

        <div className="text-[13px] md:text-[13px] text-black leading-[1] font-bold tracking-[0.01em] mb-8 md:mb-0">
          <p className="mb-1">
            Chat:{" "}
            <span className="font-medium text-[#111]">
              {cs.chatText || "See Chat icon in lower right hand corner"}
            </span>
          </p>
          {activeEmail && (
            <p className="mb-1">
              Email:{" "}
              <a
                href={`mailto:${activeEmail}`}
                className="text-[#b26060] font-medium hover:opacity-80 transition-opacity"
              >
                {activeEmail}
              </a>
            </p>
          )}
          {activePhone && cleanPhone && (
            <p>
              Call or Text/WhatsApp:{" "}
              <a
                href={`tel:${cleanPhone}`}
                className="text-[#b26060] font-medium hover:opacity-80 transition-opacity"
              >
                {activePhone}
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Our Stores Section */}
      <div className="mb-10 md:mb-16">
        <h2
          className="text-[20px] md:text-[22px] font-dala-roman tracking-wide text-black mb-4 md:mb-8"
        >
          our stores
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-6 md:gap-y-6 max-w-[750px] mx-auto">
          {contactUsData?.stores?.map((store) => (
            <div key={store.id} className="flex flex-col items-center">
              <div className="w-[92vw] max-w-[255px] aspect-square md:w-full md:max-w-[255px] md:aspect-square mb-6 md:mb-6 bg-gray-100">
                {store.image ? (
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-400 text-xs">
                    {store.name}
                  </div>
                )}
              </div>
              <div className="text-[12px] md:text-[13px] text-[#111] tracking-[0.01em]">
                <p className="font-bold text-[13px] md:text-[14px] text-black mb-0 md:mb-0.5">
                  {store.name}
                </p>
                <div className="font-medium leading-tight">
                  <p>{store.addressLine1}</p>
                  <p>{store.addressLine2}</p>
                  <p>Phone: {store.phone}</p>
                  <p className="whitespace-pre-line">Hours: {store.hours}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Other Inquiries Section */}
      {oi.enabled !== false && (
        <div className="max-w-[700px] mx-auto pb-10 md:pb-24">
          <h2 className="text-[20px] md:text-[22px] font-dala-roman tracking-wide text-black mb-4 md:mb-6">
            {oi.title || "other inquiries"}
          </h2>

          <div className="text-[13px] md:text-[13px] text-black leading-[1.5] tracking-[0.01em] font-medium space-y-1">
            {oi.socialEnabled !== false && (oi.socialText || oi.socialHandle) && (
              <p>
                {oi.socialText || "Share what you love. Love what you share:"}{" "}
                <a
                  href={oi.socialUrl || "#"}
                  target={oi.socialUrl && oi.socialUrl !== "#" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="text-[#b26060] font-medium hover:opacity-80 transition-opacity"
                >
                  {oi.socialHandle || "@underpurenyc"}
                </a>
              </p>
            )}

            {/* Dynamic Inquiries Directory */}
            {Array.isArray(oi.items) ? (
              oi.items.map((item) => {
                if (!item || (!item.label && !item.email)) return null;
                return (
                  <p key={item.id}>
                    {item.label ? `${item.label}: ` : ""}
                    {item.email ? (
                      <a
                        href={`mailto:${item.email}`}
                        className="text-[#b26060] font-medium hover:opacity-80 transition-opacity"
                      >
                        {item.email}
                      </a>
                    ) : null}
                  </p>
                );
              })
            ) : (
              <>
                {oi.generalEmail && (
                  <p>
                    General inquiries:{" "}
                    <a
                      href={`mailto:${oi.generalEmail}`}
                      className="text-[#b26060] font-medium hover:opacity-80 transition-opacity"
                    >
                      {oi.generalEmail}
                    </a>
                  </p>
                )}
                {oi.pressEmail && (
                  <p>
                    Press inquiries:{" "}
                    <a
                      href={`mailto:${oi.pressEmail}`}
                      className="text-[#b26060] font-medium hover:opacity-80 transition-opacity"
                    >
                      {oi.pressEmail}
                    </a>
                  </p>
                )}
                {oi.wholesaleEmail && (
                  <p>
                    Wholesale inquiries:{" "}
                    <a
                      href={`mailto:${oi.wholesaleEmail}`}
                      className="text-[#b26060] font-medium hover:opacity-80 transition-opacity"
                    >
                      {oi.wholesaleEmail}
                    </a>
                  </p>
                )}
                {oi.marketingEmail && (
                  <p>
                    Marketing, Partnerships and Affiliate inquiries:{" "}
                    <a
                      href={`mailto:${oi.marketingEmail}`}
                      className="text-[#b26060] font-medium hover:opacity-80 transition-opacity"
                    >
                      {oi.marketingEmail}
                    </a>
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactUs;
