import React from "react";

import { type BlogType } from "@/types/BlogType";
import BlogItem from "./BlogItem";

interface Props {
  data: Array<BlogType>;
  start: number;
  limit: number;
}
export default function NewsInsight({ data, start, limit }: Props) {
  return (
    <>
      <div className="news-block pt-10 md:pt-20">
        <div className="mx-auto w-full !max-w-[1322px] px-4">
          <div className="text-center text-[36px] font-semibold capitalize leading-[40px] md:text-[20px] md:leading-[28px] lg:text-[30px] lg:leading-[38px]">
            News insight
          </div>
          <div className="list-blog mt-6 grid gap-[30px] md:mt-10 md:grid-cols-3">
            {data.slice(start, limit).map((prd, index) => (
              <BlogItem key={index} data={prd} type="style-one" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
