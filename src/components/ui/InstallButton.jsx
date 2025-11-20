"use client";

import { Smartphone } from "lucide-react";
import Button from "@/components/ui/Button";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { useToast } from "@/providers/toast-provider";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function InstallButton({ variant = "outline", fullWidth = false }) {
  const { triggerInstall, isInstalled } = usePWAInstall();
  const { showToast } = useToast();
  
  const [animate, setAnimate] = useState(true);
  const [pulseCount, setPulseCount] = useState(0);

  useEffect(() => {
    if (pulseCount >= 3) setAnimate(false); // Stop after 3 animations
  }, [pulseCount]);

  if (isInstalled) return null;

  const handleInstall = async () => {
    const accepted = await triggerInstall();
    if (accepted) {
      showToast("📱 App installed successfully!", "success");
    } else {
      showToast("⚠ Installation canceled", "warning");
    }
  };

  return (
    <motion.div
      animate={animate ? { scale: [1, 1.06, 1] } : {}}
      transition={{ duration: 1.6, repeat: animate ? 1 : 0 }}
      onAnimationComplete={() => setPulseCount(prev => prev + 1)}
    >
      <Button 
        variant={variant}
        size="sm"
        fullWidth={fullWidth}
        className="gap-2 bg-white/50 dark:bg-gray-900/40 backdrop-blur-md shadow-sm hover:shadow-lg"
        onClick={handleInstall}
      >
        <Smartphone size={16} className="text-purple-600 dark:text-purple-400" />
        Install App
      </Button>
    </motion.div>
  );
}
