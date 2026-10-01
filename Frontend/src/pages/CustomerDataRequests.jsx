import React from "react";
import { useSiteSettingsStore, DEFAULTS } from "../store/siteSettingsStore";
import SEO from "../components/SEO";
import { toast } from "sonner";

const CustomerDataRequests = () => {
  const { customerDataRequests } = useSiteSettingsStore();
  const data = customerDataRequests || DEFAULTS.customerDataRequests || {};

  const handleRequest = (action) => {
    toast.success(
      `Your request for "${action}" has been received. Our team will contact you shortly.`,
    );
  };

  return (
    <div className="bg-white pb-10">
      <SEO title={data.heading || "Customer Data Requests"} />
      <div className="max-w-[1440px] mx-auto px-2 md:px-12 lg:px-[20px] pt-6 lg:pt-6">
        {data.heading && (
          <h1 className="text-[42px] md:text-[55px] font-serif text-black mb-6 md:mb-14 tracking-normal md:tracking-tight leading-[1.3] md:leading-tight">
            {data.heading}
          </h1>
        )}

        <div className="space-y-4 md:space-y-5 px-2">
          {data.sections?.map((section, index) => (
            <div key={index} className="max-w-3xl px-0 md:px-2">
              <h3 className="text-[20px] font-serif text-black tracking-normal md:tracking-relaxed mb-0 md:mb-1">
                {section.title}
              </h3>
              <p className="text-[13px] md:text-[13px] text-black mb-0 md:mb-2 font-sans tracking-normal md:tracking-relaxed leading-[1.6] md:leading-tight">
                {section.description}
              </p>
              <button
                onClick={() => handleRequest(section.title)}
                className="text-[14px] md:text-[14px] text-black font-sans hover:opacity-70 transition-opacity tracking-normal md:tracking-tight text-left"
              >
                {section.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerDataRequests;
