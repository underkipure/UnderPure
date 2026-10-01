import React from "react";

const FooterBigLogo = ({ fd, storeName }) => {
  if (!fd.bigLogoEnabled) return null;

  return (
    <div className="w-full flex justify-center mb-[4vw] md:mb-[0vw] pt-[2vw] overflow-hidden">
      <h2
        className="text-[14.5vw] md:text-[13vw] text-black font-dala-roman uppercase leading-[0.8] w-full text-center tracking-normal scale-x-[1.05]"
      >
        {fd.bigLogoText
          ? fd.bigLogoText.toUpperCase()
          : storeName
          ? storeName.toUpperCase()
          : "UNDERPURE"}
      </h2>
    </div>
  );
};

export default FooterBigLogo;
