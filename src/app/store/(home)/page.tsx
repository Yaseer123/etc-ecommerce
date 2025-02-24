import Banner from "@/components/store-components/Banner";
import Benefit from "@/components/store-components/Benefit";
import MenFashion from "@/components/store-components/MenFashion";
import Menu from "@/components/store-components/Menu";
import NewsInsight from "@/components/store-components/NewsInsight";
import Slider from "@/components/store-components/Slider";
import TopNav from "@/components/store-components/TopNav";
import TrendingNow from "@/components/store-components/TrendingNow";
import WomenFashion from "@/components/store-components/WomenFashion";
import productData from "@/data/Product.json";
import blogData from "@/data/Blog.json";
export default function page() {
  return (
    <div>
      {" "}
      <TopNav
        props="style-one bg-black"
        slogan="New customers save 10% with the code GET10"
      />
      <div id="header" className="relative w-full">
        <Menu />
        <Slider />
      </div>
      <TrendingNow />
      <MenFashion data={productData} start={0} limit={3} />
      <Banner />
      <WomenFashion data={productData} start={0} limit={3} />
      <Benefit props="md:mt-20 mt-10 py-10 px-2.5 bg-surface rounded-[32px]" />
      <NewsInsight data={blogData} start={0} limit={3} />
      {/*
      <Brand />
      <Newsletter />
      <Footer />
      <ModalNewsletter /> */}
    </div>
  );
}
