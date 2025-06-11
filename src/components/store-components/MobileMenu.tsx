import { CaretRight, X } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MobileSearch from "./MobileSearch";
import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";
import { SiTiktok } from "react-icons/si";

interface MobileMenuProps {
  openMenuMobile: boolean;
  handleMenuMobile: () => void;
}

const MobileMenu = ({ openMenuMobile, handleMenuMobile }: MobileMenuProps) => {
  const router = useRouter();

  // Function to handle navigation and close menu
  const handleNavigation = (path: string) => {
    handleMenuMobile(); // First close the menu
    router.push(path); // Then navigate to the path
  };

  return (
    <div id="menu-mobile" className={`${openMenuMobile ? "open" : ""}`}>
      <div className="menu-w-full mx-auto h-full !max-w-[1322px] bg-white px-4">
        <div className="mx-auto h-full w-full !max-w-[1322px] px-4">
          <div className="menu-main h-full overflow-hidden">
            <div className="heading relative flex items-center justify-center py-2">
              <div
                className="close-menu-mobile-btn absolute left-0 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-surface"
                onClick={handleMenuMobile}
              >
                <X size={14} />
              </div>
              <div
                onClick={() => handleNavigation("/")}
                className="logo cursor-pointer text-center"
              >
                <Image
                  src="/images/brand/RINORS.png"
                  alt="Rinors Logo"
                  width={120}
                  height={40}
                  priority
                  className="mx-auto h-auto w-[120px] object-contain"
                />
              </div>
            </div>
            <MobileSearch />

            <div className="list-nav mt-6">
              <ul>
                <li>
                  <div
                    onClick={() => handleNavigation("/products")}
                    className="mt-5 flex cursor-pointer items-center justify-between text-xl font-semibold"
                  >
                    Products
                    <span className="text-right">
                      <CaretRight size={20} />
                    </span>
                  </div>
                </li>
                <li>
                  <div
                    onClick={() => handleNavigation("/blog")}
                    className="mt-5 flex cursor-pointer items-center justify-between text-xl font-semibold"
                  >
                    Blog
                    <span className="text-right">
                      <CaretRight size={20} />
                    </span>
                  </div>
                </li>
                <li>
                  <div
                    onClick={() => handleNavigation("/about")}
                    className="mt-5 flex cursor-pointer items-center justify-between text-xl font-semibold"
                  >
                    About Us
                    <span className="text-right">
                      <CaretRight size={20} />
                    </span>
                  </div>
                </li>
                <li>
                  <div
                    onClick={() => handleNavigation("/faqs")}
                    className="mt-5 flex cursor-pointer items-center justify-between text-xl font-semibold"
                  >
                    FAQ
                    <span className="text-right">
                      <CaretRight size={20} />
                    </span>
                  </div>
                </li>
                <li>
                  <div
                    onClick={() => handleNavigation("/contact")}
                    className="mt-5 flex cursor-pointer items-center justify-between text-xl font-semibold"
                  >
                    Contact Us
                    <span className="text-right">
                      <CaretRight size={20} />
                    </span>
                  </div>
                  <div className="list-social mt-4 flex items-center gap-6">
                    <Link
                      href={
                        "https://www.facebook.com/profile.php?id=61572946813700"
                      }
                      target="_blank"
                    >
                      <div className="icon-facebook text-2xl text-black"></div>
                    </Link>
                    <Link
                      href={
                        "https://www.instagram.com/rinors_electronic_store/"
                      }
                      target="_blank"
                    >
                      <div className="icon-instagram text-2xl text-black"></div>
                    </Link>
                    <Link href={"https://x.com/Rinors_Corpor"} target="_blank">
                      <FaXTwitter className="text-xl text-black" />
                    </Link>
                    <Link
                      href={"https://www.tiktok.com/@rinors_ecommerce"}
                      target="_blank"
                    >
                      <SiTiktok className="text-xl text-black" />
                    </Link>
                    <Link
                      href={"https://www.youtube.com/@rinorsgreenenergy"}
                      target="_blank"
                    >
                      <div className="icon-youtube text-3xl text-black"></div>
                    </Link>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
