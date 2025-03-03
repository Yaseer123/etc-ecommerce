"use client";

import React from "react";
import Image from "next/image";
import { type BlogType } from "@/types/BlogType";
import { useRouter } from "next/navigation";

interface BlogProps {
  data: BlogType;
  type: string;
}
export default function BlogItem({ data, type }: BlogProps) {
  const router = useRouter();
  const handleBlogClick = (blogId: string) => {
    // Go to blog detail with blogId selected
    router.push(`/blog/detail1?id=${blogId}`);
  };
  return (
    <>
      {type === "style-one" ? (
        <div
          className="blog-item style-one h-full cursor-pointer"
          onClick={() => handleBlogClick(data.id)}
        >
          <div className="blog-main block h-full">
            <div className="blog-thumb overflow-hidden rounded-[20px]">
              <Image
                src={data.thumbImg}
                width={2000}
                height={1500}
                alt="blog-img"
                className="w-full duration-500"
              />
            </div>
            <div className="blog-infor mt-7">
              <div className="blog-tag text-button-uppercase inline-block rounded-full bg-green_custom px-2.5 py-1">
                {data.tag}
              </div>
              <div className="heading6 blog-title mt-3 duration-300">
                {data.title}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="blog-author caption1 text-secondary">
                  by {data.author}
                </div>
                <span className="h-[1px] w-[20px] bg-black"></span>
                <div className="blog-date caption1 text-secondary">
                  {data.date}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {type === "style-list" ? (
            <div
              className="blog-item style-list h-full cursor-pointer"
              onClick={() => handleBlogClick(data.id)}
            >
              <div className="blog-main flex h-full gap-6 max-md:flex-col md:items-center md:gap-9">
                <div className="blog-thumb w-full flex-shrink-0 overflow-hidden rounded-[20px] md:w-1/2">
                  <Image
                    src={data.thumbImg}
                    width={2000}
                    height={1500}
                    alt="blog-img"
                    className="w-full flex-shrink-0 duration-500"
                  />
                </div>
                <div className="blog-infor">
                  <div className="blog-tag text-button-uppercase inline-block rounded-full bg-green_custom px-2.5 py-1">
                    {data.tag}
                  </div>
                  <div className="heading6 blog-title mt-3 duration-300">
                    {data.title}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="blog-author caption1 text-secondary">
                      by {data.author}
                    </div>
                    <span className="h-[1px] w-[20px] bg-black"></span>
                    <div className="blog-date caption1 text-secondary">
                      {data.date}
                    </div>
                  </div>
                  <div className="body1 mt-4 text-secondary">
                    {data.shortDesc}
                  </div>
                  <div className="text-button mt-4 underline">Read More</div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {type === "style-default" && (
                <div
                  className="blog-item style-default h-full cursor-pointer"
                  onClick={() => handleBlogClick(data.id)}
                >
                  <div className="blog-main block h-full border-b border-line pb-8">
                    <div className="blog-thumb overflow-hidden rounded-[20px]">
                      <Image
                        src={data.thumbImg}
                        width={2000}
                        height={1500}
                        alt="blog-img"
                        className="w-full duration-500"
                      />
                    </div>
                    <div className="blog-infor mt-7">
                      <div className="blog-tag text-button-uppercase inline-block rounded-full bg-green_custom px-2.5 py-1">
                        {data.tag}
                      </div>
                      <div className="heading6 blog-title mt-3 duration-300">
                        {data.title}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="blog-author caption1 text-secondary">
                          by {data.author}
                        </div>
                        <span className="h-[1px] w-[20px] bg-black"></span>
                        <div className="blog-date caption1 text-secondary">
                          {data.date}
                        </div>
                      </div>
                      <div className="body1 mt-4 text-secondary">
                        {data.shortDesc}
                      </div>
                      <div className="text-button mt-4 underline">
                        Read More
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
