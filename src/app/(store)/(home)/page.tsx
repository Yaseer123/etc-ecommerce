import HomeAnimatedContent from "@/components/store-components/HomeAnimatedContent";
import NewsInsight from "@/components/store-components/NewsInsight";
import Slider from "@/components/store-components/Slider";

const page = () => {
  return (
    <>
      <div id="header" className="relative w-full">
        <Slider />
      </div>
      <HomeAnimatedContent newsInsight={<NewsInsight start={0} limit={3} />} />
    </>
  );
};

export default page;
