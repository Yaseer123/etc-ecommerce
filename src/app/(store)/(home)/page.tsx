import Banner from "@/components/store-components/Banner";
import Benefit from "@/components/store-components/Benefit";
import Brand from "@/components/store-components/Brand";
import Footer from "@/components/store-components/Footer";
import ModalNewsletter from "@/components/store-components/Modal/ModalNewsletter";
import NewsInsight from "@/components/store-components/NewsInsight";
import Newsletter from "@/components/store-components/Newsletter";
import Slider from "@/components/store-components/Slider";
import TrendingNow from "@/components/store-components/TrendingNow";
import React, { Suspense } from "react";
import productData from "@/data/Product.json";
import MenFashion from "@/components/store-components/Fashion";

export default function HomeEleven() {
  return (
    <>
      <div id="header" className="relative w-full">
        <Slider />
      </div>
      <TrendingNow />
      <MenFashion data={productData} start={0} limit={3} />
      <Banner />
      <Benefit props="md:mt-20 mt-10 py-10 px-2.5 bg-surface rounded-[32px]" />
      <Suspense>
        <NewsInsight start={0} limit={3} />
      </Suspense>
      <Brand />
      <Newsletter />
      <Footer />
      <ModalNewsletter />
    </>
  );
}
