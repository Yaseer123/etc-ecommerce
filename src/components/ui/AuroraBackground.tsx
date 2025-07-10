"use client";
import React, { useMemo } from "react";

interface AuroraBackgroundProps {
  children: React.ReactNode;
  disableAnimation?: boolean;
}

export default function AuroraBackground({
  children,
  disableAnimation = false,
}: AuroraBackgroundProps) {
  // Memoize the animated background layers to avoid unnecessary re-renders
  const backgroundLayers = useMemo(() => {
    if (disableAnimation) return null;
    return (
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="animate-spin-slower absolute left-1/2 top-1/2 h-[60vw] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-purple-400 via-blue-400 to-pink-400 opacity-20 blur-xl will-change-transform" />
        <div className="animate-spin-reverse-slowest absolute left-1/3 top-1/3 h-[40vw] w-[40vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-pink-400 via-blue-400 to-purple-400 opacity-10 blur-lg will-change-transform" />
      </div>
    );
  }, [disableAnimation]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {backgroundLayers}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
