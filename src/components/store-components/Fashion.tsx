"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Product from "./Product/Product";
import { motion } from "framer-motion";
import { type ProductType } from "@/types/ProductType";

interface Props {
  data: Array<ProductType>;
  start: number;
  limit: number;
}

const MenFashion: React.FC<Props> = ({ data, start, limit }) => {
  const [activeTab, setActiveTab] = useState<string>("shirt");

  const handleTabClick = (type: string) => {
    setActiveTab(type);
  };

  return (
    <>
      <div className="tab-features-block pt-10 md:pt-20">
        <div className="container">
          <div className="heading flex flex-wrap items-center justify-between gap-5">
            <div className="heading3">men{String.raw`'s`} Fashion</div>
            <div className="menu-tab flex items-center gap-2 rounded-2xl bg-surface p-1">
              {["t-shirt", "shirt", "sweater", "outerwear"].map((type) => (
                <div
                  key={type}
                  className={`tab-item relative cursor-pointer px-5 py-2 text-secondary duration-500 hover:text-black ${activeTab === type ? "active" : ""}`}
                  onClick={() => handleTabClick(type)}
                >
                  {activeTab === type && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 rounded-2xl bg-white"
                    ></motion.div>
                  )}
                  <span className="text-button-uppercase relative z-[1]">
                    {type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="list-product hide-product-sold mt-6 grid grid-cols-2 gap-[20px] sm:gap-[30px] md:mt-10 lg:grid-cols-4">
            <Link
              href={"/shop/breadcrumb1"}
              className="banner relative flex items-center justify-center overflow-hidden rounded-[20px]"
            >
              <div className="heading4 text-center text-white">
                Fashion For <br />
                Men
              </div>
              <Image
                src={"/images/banner/13.png"}
                width={1000}
                height={1000}
                alt="banner13"
                className="absolute left-0 top-0 z-[-1] h-full w-full object-cover duration-500"
              />
            </Link>
            {data.slice(start, limit).map((prd, index) => (
              <Product
                key={index}
                data={prd}
                type="marketplace"
                style="style-1"
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MenFashion;
