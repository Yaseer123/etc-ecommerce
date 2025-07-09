"use client";

import { useEffect, useState } from "react";
import SlideNavbar from "./SlideNavbar";
import CategoryNav from "./CategoryNav";
import { type Session } from "next-auth"; // ✅ Use proper type

interface StickyHeaderProps {
  session: Session | null;
}

export default function StickyHeader({ session }: StickyHeaderProps) {
  const [isSticky, setIsSticky] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768); // md breakpoint
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsSticky(scrollY > 60); // Adjust threshold as needed
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    if (isDesktop) {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("resize", checkScreenSize);
      window.removeEventListener("scroll", handleScroll);
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
