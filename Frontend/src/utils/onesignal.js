export const initOneSignal = async () => {
  if (typeof window !== 'undefined' && window.location) {
    const { hostname } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.local')) {
      return;
    }
  }

  const appId = import.meta.env.VITE_ONESIGNAL_APP_ID;
  if (!appId || window.OneSignalInitialized) {
    return;
  }
  window.OneSignalInitialized = true;

  const loadSdk = () => {
    if (window._oneSignalScriptLoaded) return;
    window._oneSignalScriptLoaded = true;

    try {
      const script = document.createElement("script");
      script.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.OneSignalDeferred = window.OneSignalDeferred || [];
        window.OneSignalDeferred.push(async function (OneSignal) {
          try {
            await OneSignal.init({
              appId: appId,
              safari_web_id: import.meta.env.VITE_ONESIGNAL_SAFARI_WEB_ID || "",
              notifyButton: {
                enable: false,
                theme: "default",
                position: "bottom-right",
                size: "medium",
                showCredit: false,
              },
            });
          } catch (err) {
            console.warn("OneSignal initialization warning:", err);
          }
        });
      };
    } catch (error) {
      console.error("Error initializing OneSignal:", error);
    }
  };

  // Trigger on first user interaction or fallback timeout after 6 seconds
  const events = ["click", "scroll", "touchstart", "keydown"];
  const triggerOnInteraction = () => {
    loadSdk();
    events.forEach(e => window.removeEventListener(e, triggerOnInteraction));
  };

  events.forEach(e => window.addEventListener(e, triggerOnInteraction, { once: true, passive: true }));
  setTimeout(loadSdk, 6000);
};
