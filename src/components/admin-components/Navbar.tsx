"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const session = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { href: "/admin/user", label: "Users" },
    { href: "/admin/category", label: "Categories" },
    { href: "/admin/product", label: "Products" },
    { href: "/admin/blog", label: "Blogs" },
    { href: "/admin/slider", label: "Slider" },
  ];

  return (
    <div className="relative">
      <div className="flex items-center justify-between bg-gray-100 px-7 py-3 shadow-md">
        <Link href="/admin" className="text-lg font-bold">
          Admin Panel
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-x-4 md:flex">
          {navLinks.map((link) => (
            <Button key={link.href} asChild variant="outline">
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}

          {session && (
            <Button asChild variant="default">
              <Link href="/api/auth/signout">Sign out</Link>
            </Button>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="p-2 md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="absolute left-0 right-0 top-full z-50 bg-gray-100 px-5 py-3 shadow-md md:hidden">
          <div className="flex flex-col gap-y-3">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                asChild
                variant="outline"
                className="w-full justify-start"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}

            {session && (
              <Button
                asChild
                variant="default"
                className="w-full justify-start"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link href="/api/auth/signout">Sign out</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
