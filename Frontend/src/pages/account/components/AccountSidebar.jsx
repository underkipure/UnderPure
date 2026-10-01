import React from "react";

export default function AccountSidebar({ tabs, activeTab, setActiveTab, navigate }) {
  return (
    <div className="w-full lg:w-[160px] shrink-0">
      {/* Mobile Navigation Horizontal Tabs */}
      <nav className="flex lg:hidden flex-row gap-5 mb-5 md:mb-0 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          if (tab.id === "admin_portal") {
            return (
              <button
                key={tab.id}
                onClick={() => navigate("/admin")}
                className="text-[16px] md:text-[14px] font-serif uppercase tracking-wider text-blue-600 hover:text-blue-800 transition-colors whitespace-nowrap"
              >
                {tab.label}
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                navigate(`/account?tab=${tab.id}`, { replace: true });
              }}
              className={`text-[16px] md:text-[14px] font-serif uppercase tracking-wider transition-colors whitespace-nowrap ${
                isActive ? "text-black" : "text-gray-400 hover:text-black"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Desktop Navigation Sidebar */}
      <nav className="hidden lg:flex flex-col sticky top-[12px]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          if (tab.id === "admin_portal") {
            return (
              <button
                key={tab.id}
                onClick={() => navigate("/admin")}
                className="text-[17px] font-serif uppercase tracking-[0.0002em] text-blue-600 hover:text-blue-800 transition-colors text-left whitespace-nowrap"
              >
                {tab.label}
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                navigate(`/account?tab=${tab.id}`, { replace: true });
              }}
              className={`text-[15px] lg:text-[17px] font-serif font-medium uppercase tracking-[0.0002em] transition-colors whitespace-nowrap text-left ${
                isActive ? "text-black" : "text-gray-500 hover:text-black"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
