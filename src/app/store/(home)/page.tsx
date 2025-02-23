import Menu from "@/components/store-components/Menu";
import TopNav from "@/components/store-components/TopNav";

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
        {/* <Slider /> */}
      </div>
      {/* <TrendingNow />
      <MenFashion data={productData} start={0} limit={3} />
      <Banner />
      <WomenFashion data={productData} start={0} limit={3} />
      <Benefit props="md:mt-20 mt-10 py-10 px-2.5 bg-surface rounded-[32px]" />
      <NewsInsight data={blogData} start={0} limit={3} />
      <Brand />
      <Newsletter />
      <Footer />
      <ModalNewsletter /> */}
    </div>
  );
}
