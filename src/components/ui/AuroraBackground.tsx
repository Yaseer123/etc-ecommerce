"use client";
import React from "react";

export default function AuroraBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="animate-spin-slow absolute left-1/2 top-1/2 h-[60vw] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-purple-400 via-blue-400 to-pink-400 opacity-30 blur-3xl" />
        <div className="animate-spin-reverse-slower absolute left-1/3 top-1/3 h-[40vw] w-[40vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-pink-400 via-blue-400 to-purple-400 opacity-20 blur-2xl" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
