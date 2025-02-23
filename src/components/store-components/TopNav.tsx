"use client";
import Link from "next/link";
import { useState } from "react";
import * as Icon from "@phosphor-icons/react";
interface Props {
  props: string;
  slogan: string;
}
export default function TopNav({ props, slogan }: Props) {
  const [isOpenLanguage, setIsOpenLanguage] = useState(false);
  const [isOpenCurrence, setIsOpenCurrence] = useState(false);
  const [language, setLanguage] = useState("English");
  const [currence, setCurrence] = useState("USD");

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
                  setIsOpenCurrence(false);
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
                  setIsOpenCurrence(!isOpenCurrence);
                  setIsOpenLanguage(false);
                }}
              >
                <div className="select relative">
                  <p className="selected caption2 text-white">{currence}</p>
                  <ul
                    className={`list-option bg-white ${isOpenCurrence ? "open" : ""}`}
                  >
                    {["USD", "EUR", "GBP"].map((item, index) => (
                      <li
                        key={index}
                        className="caption2"
                        onClick={() => setCurrence(item)}
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
            <div className="right-content flex items-center gap-5 max-md:hidden">
              <Link href={"https://www.facebook.com/"} target="_blank">
                <i className="icon-facebook text-white"></i>
              </Link>
              <Link href={"https://www.instagram.com/"} target="_blank">
                <i className="icon-instagram text-white"></i>
              </Link>
              <Link href={"https://www.youtube.com/"} target="_blank">
                <i className="icon-youtube text-white"></i>
              </Link>
              <Link href={"https://twitter.com/"} target="_blank">
                <i className="icon-twitter text-white"></i>
              </Link>
              <Link href={"https://pinterest.com/"} target="_blank">
                <i className="icon-pinterest text-white"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
