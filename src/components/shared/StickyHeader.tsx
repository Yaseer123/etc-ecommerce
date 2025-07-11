"use client";

import { type Session } from "next-auth"; // ✅ Use proper type
import { useEffect, useRef, useState } from "react";
import CategoryNav from "./CategoryNav";
import SlideNavbar from "./SlideNavbar";

interface StickyHeaderProps {
  session: Session | null;
}

export default function StickyHeader({ session }: StickyHeaderProps) {
  const [isSticky, setIsSticky] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const throttleTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768); // md breakpoint
    };

    const handleScroll = () => {
      if (throttleTimeout.current) return;
      throttleTimeout.current = setTimeout(() => {
        const scrollY = window.scrollY;
        setIsSticky(scrollY > 60); // Adjust threshold as needed
        throttleTimeout.current = null;
      }, 16); // ~60fps
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    if (isDesktop) {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("resize", checkScreenSize);
      window.removeEventListener("scroll", handleScroll);
      if (throttleTimeout.current) {
        clearTimeout(throttleTimeout.current);
        throttleTimeout.current = null;
      }
    };
  }, [isDesktop]);

  return (
    <div className="flex flex-col">
      {/* SlideNavbar: Sticky on mobile only */}
      <div
        className={`z-50 w-full bg-transparent dark:bg-black ${
          isDesktop ? "relative" : "fixed top-0"
        }`}
      >
        <SlideNavbar isAuthenticated={!!session?.user} />
      </div>

      {/* CategoryNav: Hidden on mobile, sticky on scroll for desktop */}
      {isDesktop && (
        <div
          className={`z-40 w-full bg-white transition-all duration-300 dark:bg-black ${
            isSticky ? "fixed top-0 shadow-md" : "relative"
          }`}
        >
          <CategoryNav />
        </div>
      )}
    </div>
  );
}
