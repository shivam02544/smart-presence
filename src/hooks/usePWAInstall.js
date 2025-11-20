import { useEffect, useState } from "react";

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });
  }, []);

  const triggerInstall = async () => {
    if (!deferredPrompt) return false;

    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    return result.outcome === "accepted";
  };

  return { triggerInstall, isInstalled };
}
