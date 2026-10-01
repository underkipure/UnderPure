import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSiteSettingsStore, DEFAULTS } from "../../store/siteSettingsStore";
import BackToTopButton from "./components/BackToTopButton";
import ChatTriggerButton from "./components/ChatTriggerButton";
import ChatPopupWidget from "./components/ChatPopupWidget";

const FloatingButtons = () => {
  const location = useLocation();
  const chatWidgetData = useSiteSettingsStore((s) => s.chatWidgetData);
  const contactPhone = useSiteSettingsStore((s) => s.contactPhone);
  const footerData = useSiteSettingsStore((s) => s.footerData);
  const chatData = chatWidgetData || DEFAULTS.chatWidgetData || {};

  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const isCollection = location.pathname.startsWith("/collections");
  const isAdmin = location.pathname.startsWith("/admin");
  const isCheckout = location.pathname === "/checkout";
  const isAuth =
    location.pathname === "/login" || location.pathname === "/signup";

  // Don't show on admin, checkout, or auth pages
  if (isAdmin || isCheckout || isAuth) return null;

  const showChat = true;
  const showBackToTopButton = isCollection;

  useEffect(() => {
    const handleOpenChat = () => setIsChatOpen(true);
    window.addEventListener("open-chat-widget", handleOpenChat);
    return () => window.removeEventListener("open-chat-widget", handleOpenChat);
  }, []);

  useEffect(() => {
    if (!showBackToTopButton) return;

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showBackToTopButton]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChatClick = () => {
    setIsChatOpen(!isChatOpen);
    if (isChatOpen) {
      setSelectedQuestion(null);
      setSearchQuery("");
    }
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setSelectedQuestion(null);
    setSearchQuery("");
  };

  const handleWhatsApp = () => {
    const rawPhone =
      chatData.whatsappNumber ||
      contactPhone ||
      footerData?.contactPhone ||
      "";
    if (!rawPhone) return;
    let cleanNumber = rawPhone.replace(/[^0-9]/g, "");
    if (cleanNumber.startsWith("0")) {
      cleanNumber = "92" + cleanNumber.slice(1);
    }
    window.open(`https://wa.me/${cleanNumber}`, "_blank");
  };

  if (!showChat && !showBackToTopButton) return null;

  return (
    <div className="fixed bottom-2 right-1 md:bottom-4 md:right-4 z-[90] flex flex-col items-end gap-3">
      {/* Chat Popup Widget */}
      {isChatOpen && (
        <ChatPopupWidget
          chatData={chatData}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedQuestion={selectedQuestion}
          setSelectedQuestion={setSelectedQuestion}
          onClose={handleCloseChat}
          handleWhatsApp={handleWhatsApp}
        />
      )}

      <div className="flex flex-col items-center gap-3">
        {/* Back to Top Button — only on Collection page */}
        {showBackToTopButton && (
          <BackToTopButton
            showBackToTop={showBackToTop}
            scrollToTop={scrollToTop}
          />
        )}

        {/* Chat / Message Button */}
        {showChat && (
          <ChatTriggerButton
            isChatOpen={isChatOpen}
            handleChatClick={handleChatClick}
          />
        )}
      </div>
    </div>
  );
};

export default FloatingButtons;
