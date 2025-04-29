"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

interface Props {
  props: string;
  slogan?: string; // Made optional since we're not using it anymore
}

export default function TopNav({ props }: Props) {
  const pathname = usePathname();
  
  return (
    <>
      <div className={`top-nav h-[30px] md:h-[44px] ${props}`}>
        <div className="mx-auto h-full w-full !max-w-[1322px] px-4">
          <div className="top-nav-main flex h-full justify-between">
            <div className="flex h-full items-center">
              <ul className="flex h-full items-center gap-5 text-white">
                <li className="h-full">
                  <Link
                    href="/products"
                    className="flex h-full items-center justify-center text-sm font-semibold uppercase leading-5 duration-300 hover:opacity-80 md:text-xs md:leading-4"
                  >
                    Products
                  </Link>
                </li>
                <li className="relative h-full">
                  <Link
                    href="/blog"
                    className="flex h-full items-center justify-center text-sm font-semibold uppercase leading-5 duration-300 hover:opacity-80 md:text-xs md:leading-4"
                  >
                    Blog
                  </Link>
                </li>
                <li className="h-full">
                  <Link
                    href="/about"
                    className="flex h-full items-center justify-center text-sm font-semibold uppercase leading-5 duration-300 hover:opacity-80 md:text-xs md:leading-4"
                  >
                    About Us
                  </Link>
                </li>
                <li className="h-full">
                  <Link
                    href="/faqs"
                    className="flex h-full items-center justify-center text-sm font-semibold uppercase leading-5 duration-300 hover:opacity-80 md:text-xs md:leading-4"
                  >
                    FAQ
                  </Link>
                </li>
                <li className="h-full">
                  <Link
                    href="/contact"
                    className={`flex h-full items-center justify-center text-sm font-semibold uppercase leading-5 duration-300 hover:opacity-80 md:text-xs md:leading-4 ${pathname?.includes("/pages") ? "active" : ""}`}
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div className="right-content flex items-center gap-5 text-white max-md:hidden">
              <Link href={"https://www.facebook.com/"} target="_blank">
                <FaFacebookF />
              </Link>
              <Link href={"https://www.instagram.com/"} target="_blank">
                <FaInstagram />
              </Link>
              <Link href={"https://www.youtube.com/"} target="_blank">
                <FaYoutube />
              </Link>
              <Link href={"https://twitter.com/"} target="_blank">
                <FaXTwitter />
              </Link>
              <Link href={"https://pinterest.com/"} target="_blank">
                <FaPinterestP />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
