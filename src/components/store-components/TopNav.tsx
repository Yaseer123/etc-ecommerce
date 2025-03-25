"use client";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
interface Props {
  props: string;
  slogan: string;
}
export default function TopNav({ props, slogan }: Props) {
  return (
    <>
      <div className={`top-nav h-[30px] md:h-[44px] ${props}`}>
        <div className="mx-auto h-full w-full !max-w-[1322px] px-4">
          <div className="top-nav-main flex h-full justify-between max-md:justify-center">
            <div className="flex items-center text-center text-sm font-semibold uppercase leading-5 text-white md:text-xs md:leading-4">
              {slogan}
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
