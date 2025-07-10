import Image from "next/image";
import Link from "next/link";
import { FaLocationDot, FaXTwitter } from "react-icons/fa6";
import { HiPhone } from "react-icons/hi";
import { SiTiktok } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="bg-white bg-map-pattern bg-[length:auto_100%] bg-right bg-no-repeat text-black transition-colors duration-300 dark:bg-black dark:text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Top Grid Section */}
        <div className="mb-10 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {/* Logo + Contact */}
          <div>
            <Link href="/" className="mb-4 inline-block">
              <Image
                src="/light.png"
                alt="Rinors Light"
                width={120}
                height={40}
                priority
                className="dark:hidden"
              />
              <Image
                src="/dark.png"
                alt="Rinors Dark"
                width={120}
                height={40}
                priority
                className="hidden dark:block"
              />
            </Link>
            <div className="mt-4 space-y-2 text-sm font-medium">
              <p>
                <strong>Mail:</strong> contact@rinors.com
              </p>
              <p>
                <strong>Phone:</strong> 01312223452
              </p>
              <p>
                <strong>Address:</strong> 41/5 east badda Dhaka, Bangladesh
              </p>
            </div>
          </div>

          {/* Info */}
          <div>
            <h4 className="mb-4 text-base font-semibold">INFORMATION</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Career
                </Link>
              </li>
              <li>
                <Link href="/my-account" className="hover:underline">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/order-tracking" className="hover:underline">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:underline">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Shop */}
          <div>
            <h4 className="mb-4 text-base font-semibold">QUICK SHOP</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products?category=cmbb6pxmn000gpfkk10p0fv0l&page=0"
                  className="hover:underline"
                >
                  Home Electricals
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=cmbb6dq3y000epfkkjn0sie9j&page=0"
                  className="hover:underline"
                >
                  Energy Solutions
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=cmbb78cte000mpfkkt0cyt53d&page=0"
                  className="hover:underline"
                >
                  Smart Gadget
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=cmbb7dno0000opfkk9ttqrmxj&page=0"
                  className="hover:underline"
                >
                  Health and Fitness
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=cmbb6x8b3000ipfkkcas967g6&page=0"
                  className="hover:underline"
                >
                  Smart Appliances
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Services */}
          <div>
            <h4 className="mb-4 text-base font-semibold">CUSTOMER SERVICES</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faqs" className="hover:underline">
                  Orders FAQs
                </Link>
              </li>
              <li>
                <Link href="/pages/faqs" className="hover:underline">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/order-tracking" className="hover:underline">
                  Return & Refund
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 text-base font-semibold">Support</h4>

            {/* Phone Support */}
            <Link
              href="tel:01312223452"
              className="mb-4 flex items-center gap-4 rounded-2xl border border-[#ddd] bg-[#f2f4f8] p-4 transition hover:bg-[#e6e8ee] dark:border-[#333] dark:bg-[#1a1a1a] dark:hover:bg-[#2a2a2a]"
            >
              <HiPhone className="text-2xl text-[#081621] dark:text-white" />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  9 AM - 8 PM
                </p>
                <h5 className="text-lg font-bold text-[#081621] dark:text-white">
                  01312223452
                </h5>
              </div>
            </Link>

            {/* Store Locator */}
            <a
              href="https://g.co/kgs/MX7BqyL"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-[#ddd] bg-[#f2f4f8] p-4 transition hover:bg-[#e6e8ee] dark:border-[#333] dark:bg-[#1a1a1a] dark:hover:bg-[#2a2a2a]"
            >
              <FaLocationDot className="text-2xl text-[#081621] dark:text-white" />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Store Locator
                </p>
                <h5 className="text-lg font-bold text-[#081621] dark:text-white">
                  Find Our Store
                </h5>
              </div>
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between border-t border-[#ddd] pb-4 pt-6 text-sm dark:border-[#333] md:flex-row">
          <p className="text-secondary dark:text-white">
            ©2025 Rinors Corporation. All Rights Reserved.
          </p>
          <div className="mt-4 flex items-center gap-4 md:mt-0">
            <Link
              href="https://www.facebook.com/profile.php?id=61572946813700"
              target="_blank"
            >
              <div className="icon-facebook text-xl transition hover:text-[#1877f3]" />
            </Link>
            <Link
              href="https://www.instagram.com/rinors_electronic_store/"
              target="_blank"
            >
              <div className="icon-instagram text-xl transition hover:text-[#e4405f]" />
            </Link>
            <Link href="https://x.com/Rinors_Corpor" target="_blank">
              <FaXTwitter className="text-xl transition hover:text-[#1da1f2]" />
            </Link>
            <Link
              href="https://www.tiktok.com/@rinors_ecommerce"
              target="_blank"
            >
              <SiTiktok className="text-xl transition hover:text-[#010101]" />
            </Link>
            <Link
              href="https://www.youtube.com/@rinorsecommerce"
              target="_blank"
            >
              <div className="icon-youtube text-xl transition hover:text-[#ff0000]" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
