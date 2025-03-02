"use client";
import Link from "next/link";
import { useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import * as Icon from "@phosphor-icons/react/dist/ssr";
interface Props {
  props: string;
  slogan: string;
}
export default function TopNav({ props, slogan }: Props) {
  const [isOpenLanguage, setIsOpenLanguage] = useState(false);
  const [isOpenCurrency, setIsOpenCurrency] = useState(false);
  const [language, setLanguage] = useState("English");
  const [Currency, setCurrency] = useState("USD");

  return (
    <>
      <div className={`top-nav h-[30px] md:h-[44px] ${props}`}>
        <div className="container mx-auto h-full">
          <div className="top-nav-main flex h-full justify-between max-md:justify-center">
            <div className="left-content flex items-center gap-5 max-md:hidden">
              <div
                className="choose-type choose-language flex items-center gap-1.5"
                onClick={() => {
                  setIsOpenLanguage(!isOpenLanguage);
                  setIsOpenCurrency(false);
                }}
              >
                <div className="select relative">
                  <p className="selected caption2 text-white">{language}</p>
                  <ul
                    className={`list-option bg-white ${isOpenLanguage ? "open" : ""}`}
                  >
                    {["English", "Espana", "France"].map((item, index) => (
                      <li
                        key={index}
                        className="caption2"
                        onClick={() => setLanguage(item)}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <Icon.CaretDown size={12} color="#fff" />
              </div>
              <div
                className="choose-type choose-currency flex items-center gap-1.5"
                onClick={() => {
                  setIsOpenCurrency(!isOpenCurrency);
                  setIsOpenLanguage(false);
                }}
              >
                <div className="select relative">
                  <p className="selected caption2 text-white">{Currency}</p>
                  <ul
                    className={`list-option bg-white ${isOpenCurrency ? "open" : ""}`}
                  >
                    {["USD", "EUR", "GBP"].map((item, index) => (
                      <li
                        key={index}
                        className="caption2"
                        onClick={() => setCurrency(item)}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <Icon.CaretDown size={12} color="#fff" />
              </div>
            </div>
            <div className="text-button-uppercase flex items-center text-center text-white">
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
