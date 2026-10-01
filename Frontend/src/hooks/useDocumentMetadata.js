import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSiteSettingsStore } from "../store/siteSettingsStore";
import { initOneSignal } from "../utils/onesignal";

export function useDocumentMetadata() {
  const location = useLocation();
  const { storeName, favicon } = useSiteSettingsStore();
  const [pageName, setPageName] = useState("");

  // Dynamically connect and update Tab Favicon & PWA Web Manifest
  useEffect(() => {
    const activeFavicon = favicon || "/favicon.png";

    // 1. Update browser tab icons
    let iconLink = document.querySelector('link[rel="icon"]');
    if (!iconLink) {
      iconLink = document.createElement("link");
      iconLink.setAttribute("rel", "icon");
      document.head.appendChild(iconLink);
    }
    iconLink.setAttribute("href", activeFavicon);

    let appleLink = document.querySelector('link[rel="apple-touch-icon"]');
    if (appleLink) {
      appleLink.setAttribute(
        "href",
        activeFavicon.endsWith(".svg") ? "/apple-touch-icon.png" : activeFavicon
      );
    }

    // 2. Connect PWA Web Manifest file
    let manifestLink = document.querySelector('link[rel="manifest"]');
    if (!manifestLink) {
      manifestLink = document.createElement("link");
      manifestLink.setAttribute("rel", "manifest");
      document.head.appendChild(manifestLink);
    }
    manifestLink.setAttribute("href", "/site.webmanifest");
  }, [favicon, storeName]);

  useEffect(() => {
    let newPageName = "";
    if (location.pathname === "/" || location.pathname === "/home") {
      newPageName = "";
    } else if (location.pathname === "/cart") {
      newPageName = "Cart";
    } else if (location.pathname === "/checkout") {
      newPageName = "Checkout";
    } else if (location.pathname === "/login") {
      newPageName = "Login";
    } else if (location.pathname === "/signup") {
      newPageName = "Sign Up";
    } else if (location.pathname === "/about-us") {
      newPageName = "About Us";
    } else if (location.pathname === "/contact-us") {
      newPageName = "Contact Us";
    } else if (location.pathname === "/faqs") {
      newPageName = "FAQs";
    } else if (location.pathname === "/size-guide") {
      newPageName = "Size Guide";
    } else if (location.pathname === "/loyalty-program") {
      newPageName = "Loyalty Program";
    } else if (location.pathname === "/account") {
      newPageName = "Account";
    } else if (location.pathname.startsWith("/pages/")) {
      newPageName = location.pathname.split("/")[2].replace(/-/g, " ");
      newPageName = newPageName.replace(/\b\w/g, (l) => l.toUpperCase());
    }

    setPageName(newPageName);

    if (favicon) {
      let links = document.querySelectorAll("link[rel~='icon']");
      if (links.length === 0) {
        let link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
        link.href = favicon;
      } else {
        links.forEach((link) => (link.href = favicon));
      }

      let appleLink = document.querySelector("link[rel='apple-touch-icon']");
      if (appleLink) {
        appleLink.href = favicon;
      }
    }
  }, [location.pathname, favicon]);

  useEffect(() => {
    // Defer push notification SDK loading so initial page render speed is maximum
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => initOneSignal(), { timeout: 6000 });
    } else {
      setTimeout(() => initOneSignal(), 5000);
    }
  }, []);

  return { pageName };
}
