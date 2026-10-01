import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSiteSettingsStore, DEFAULTS } from "../store/siteSettingsStore";
import ReturnRequestModal from "../components/ReturnRequestModal";

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost/backend';


const Returns = () => {
  const { storeName, returnsData, contactPhone, footerData } = useSiteSettingsStore();
  const name = storeName || DEFAULTS.storeName || "UnderPure";
  const data = returnsData || DEFAULTS.returnsData;
  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("return");

  const openModal = (type = "return") => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (location.state?.openModal) {
      openModal("return");
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      {/* Top Banner Image */}
      <div className="w-full relative h-[50vh] md:h-[71vh]">
        <img
          src={data.bannerImage}
          alt="Returns and Exchanges"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Content Section */}
      <div className="max-w-[810px] mx-auto px-4 md:px-8 py-16 md:py-8 text-center">
        <div className="space-y-4 text-[13px] md:text-[13px] leading-relaxed md:leading-[1.8] font-normal tracking-[0.01em]">
          
          <div className="whitespace-pre-wrap text-left md:text-center">
            {data.introText}
          </div>

          <p className="font-bold">
            {data.boldPolicy1}
          </p>

          <p className="font-bold">
            {data.finalSaleText}
          </p>

          <div className="whitespace-pre-wrap text-left md:text-center">
            {data.feeText}
          </div>

          <p className="font-bold">
            {data.outsideReturnsText}
          </p>

          <p className="font-bold">
            {data.noStoreReturnsText}
          </p>

          <p className="font-bold">
            For more information about Returns, visit our{" "}
            <Link
              to="/faqs"
              className="text-[#b26060] hover:opacity-80 transition-opacity"
            >
              FAQ
            </Link>
            .
          </p>
        </div>

        {/* Initiate Return Button */}
        <div className="my-14 flex justify-center">
          <button 
            onClick={() => openModal("return")}
            className="inline-block border border-black text-black bg-transparent hover:bg-black hover:text-white transition-colors text-[11px] md:text-[12px] font-bold uppercase tracking-[0.2em] px-12 py-4 w-full max-w-[400px]"
          >
            {data.buttonText}
          </button>
        </div>

        {/* Boutique Returns */}
        <div className="space-y-6 text-[13px] md:text-[14px] leading-relaxed md:leading-[1.8] font-medium mb-4">
          <h3 className="font-bold uppercase tracking-wider text-[12px] md:text-[13px] mb-2">
            {data.boutiqueReturnsHeading || "BOUTIQUE RETURNS"}
          </h3>
          <div className="text-[13px] tracking-[0.01em] whitespace-pre-wrap text-left md:text-center">
            {data.boutiqueReturnsText}
          </div>
        </div>

        {/* EU/EFTA Right of Withdrawal */}
        <div className="space-y-6 text-[13px] md:text-[14px] leading-relaxed md:leading-[1.8] font-medium">
          <h3 className="font-bold uppercase tracking-wider text-[12px] md:text-[13px] mb-4">
            {data.euWithdrawalHeading || "EU/EFTA RIGHT OF WITHDRAWAL"}
          </h3>
          <div className="text-[13px] tracking-[0.01em] whitespace-pre-wrap text-left md:text-center">
            {data.euWithdrawalText}
            
            <br /><br />
            <p>
              <button
                onClick={() => openModal("withdrawal")}
                className="text-[#b26060] hover:opacity-80 transition-opacity underline cursor-pointer font-medium"
              >
                {data.withdrawalLinkText || "Submit Withdrawal"}
              </button>
            </p>
            <br />

            <p className="pb-20">
              <span className="font-bold">
                {data.withdrawalFormNotePrefix ?? "EU Model Withdrawal Form can be accessed at this"}
              </span>{" "}
              <a
                href={data.withdrawalFormLink || "#"}
                className="text-[#b26060] hover:opacity-80 transition-opacity font-medium underline"
              >
                {data.withdrawalFormLinkText || "link"}
              </a>{" "}
              <span className="font-medium">
                {data.withdrawalFormNoteSuffix ?? "and can be completed and returned to us only if you wish to withdraw from the contract."}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Initiate Return Modal */}
      <ReturnRequestModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        modalType={modalType} 
      />
    </div>
  );
};

export default Returns;
