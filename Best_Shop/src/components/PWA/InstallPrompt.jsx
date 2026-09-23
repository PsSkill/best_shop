import React, { useState, useEffect } from "react";
import GetAppIcon from "@mui/icons-material/GetApp";
import CloseIcon from "@mui/icons-material/Close";
import IosShareIcon from "@mui/icons-material/IosShare";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import StorefrontIcon from "@mui/icons-material/Storefront";
import "./install_prompt.css";

// Helper to determine if current device is a mobile or tablet
const isMobileOrTabletDevice = () => {
  if (typeof window === "undefined" || !window.navigator) return false;
  const ua = window.navigator.userAgent.toLowerCase();
  const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|tablet|mobile|silk|kindle/i.test(ua);
  const isIPadOS = navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /macintosh/i.test(ua);
  const isTouchScreen = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const isSmallViewport = window.innerWidth <= 1024; // tablets and mobiles

  return isMobileUA || isIPadOS || (isTouchScreen && isSmallViewport);
};

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Only enable for mobile and tablet devices
    const isMobileDevice = isMobileOrTabletDevice();
    setIsMobile(isMobileDevice);

    if (!isMobileDevice) {
      return; // Do not show install prompts on desktop / PCs
    }

    // Check if app is already running in standalone mode (installed)
    const isAppStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true ||
      document.referrer.includes("android-app://");

    if (isAppStandalone) {
      setIsStandalone(true);
      return;
    }

    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem("bestshop_pwa_dismissed");

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent) || (navigator.maxTouchPoints > 2 && /macintosh/.test(userAgent));
    setIsIOS(isAppleDevice);

    if (isAppleDevice && !isAppStandalone && !isDismissed) {
      // Show install prompt on mobile iOS browsers after a brief delay
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2500);
      return () => clearTimeout(timer);
    }

    // Handle beforeinstallprompt for Android / Mobile Chrome
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      window.deferredPWAInstallPrompt = e;

      if (!isDismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Listen for custom manual install trigger from mobile menu
    const handleManualTrigger = () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
      } else if (isAppleDevice) {
        setShowIOSModal(true);
      } else {
        setShowBanner(true);
      }
    };
    window.addEventListener("open-pwa-install", handleManualTrigger);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("open-pwa-install", handleManualTrigger);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowBanner(false);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem("bestshop_pwa_dismissed", "true");
  };

  // Do not render on desktop / PCs or standalone installed app
  if (!isMobile || isStandalone || !showBanner) {
    return null;
  }

  return (
    <>
      {/* Floating Bottom Install Banner (Mobiles & Tablets Only) */}
      <div className="pwa-install-banner">
        <div className="pwa-app-icon-wrap">
          <StorefrontIcon style={{ fontSize: 26 }} />
        </div>

        <div className="pwa-banner-content">
          <h4 className="pwa-banner-title">Install Best Shop App</h4>
          <p className="pwa-banner-desc">
            {isIOS
              ? "Add to your home screen for quick mobile POS access."
              : "Install on mobile/tablet for fast, fullscreen stock management."}
          </p>
        </div>

        <div className="pwa-banner-actions">
          <button className="pwa-btn-install" onClick={handleInstallClick}>
            <GetAppIcon style={{ fontSize: 16 }} />
            Install
          </button>
          <button
            className="pwa-btn-dismiss"
            onClick={handleDismiss}
            title="Dismiss"
          >
            <CloseIcon style={{ fontSize: 18 }} />
          </button>
        </div>
      </div>

      {/* iOS Instructions Modal */}
      {showIOSModal && (
        <div
          className="pwa-ios-modal-backdrop"
          onClick={() => setShowIOSModal(false)}
        >
          <div className="pwa-ios-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="pwa-app-icon-wrap" style={{ width: 36, height: 36 }}>
                  <StorefrontIcon style={{ fontSize: 20 }} />
                </div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                  Install Best Shop on iPhone / iPad
                </h3>
              </div>
              <button
                className="pwa-btn-dismiss"
                onClick={() => setShowIOSModal(false)}
              >
                <CloseIcon />
              </button>
            </div>

            <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.4 }}>
              Safari on iOS lets you add Best Shop directly to your Home Screen just like a native app:
            </p>

            <div className="pwa-ios-steps">
              <div className="pwa-ios-step">
                <div className="pwa-ios-step-num">1</div>
                <span>
                  Tap the <strong>Share</strong> button <IosShareIcon style={{ fontSize: 18, verticalAlign: "middle", color: "#0ea5e9" }} /> in the Safari toolbar.
                </span>
              </div>
              <div className="pwa-ios-step">
                <div className="pwa-ios-step-num">2</div>
                <span>
                  Scroll down and tap <strong>Add to Home Screen</strong> <AddBoxOutlinedIcon style={{ fontSize: 18, verticalAlign: "middle", color: "#0ea5e9" }} />.
                </span>
              </div>
              <div className="pwa-ios-step">
                <div className="pwa-ios-step-num">3</div>
                <span>
                  Tap <strong>Add</strong> in the top-right corner to finish.
                </span>
              </div>
            </div>

            <button
              className="pwa-btn-install"
              style={{ width: "100%", justifyContent: "center", padding: "12px" }}
              onClick={() => setShowIOSModal(false)}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
