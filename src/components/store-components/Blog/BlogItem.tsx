"use client";

import React from "react";
import Image from "next/image";
import { type BlogType } from "@/types/BlogType";
import { useRouter } from "next/navigation";

interface BlogProps {
  data: BlogType;
}

const BlogItem: React.FC<BlogProps> = ({ data }) => {
  const router = useRouter();
  const handleBlogClick = (blogId: string, slug: string) => {
    // Go to blog detail with blogId selected
    router.push(`/blog/${slug}?id=${blogId}`);
  };

  return (
    <div
      className="blog-item style-list h-full cursor-pointer"
      onClick={() => handleBlogClick(data.id, data.slug)}
    >
      <div className="blog-main flex h-full gap-6 max-md:flex-col md:items-center md:gap-9">
        <div className="blog-thumb w-full flex-shrink-0 overflow-hidden rounded-[20px] md:w-1/2">
          <Image
            src={data.coverImageUrl}
            width={2000}
            height={1500}
            alt="blog-img"
            className="w-full flex-shrink-0 duration-500"
          />
        </div>
        <div className="blog-infor">
          <div className="blog-tag text-button-uppercase inline-block rounded-full bg-green px-2.5 py-1">
            {data.tags.join(", ")}
          </div>
          <div className="heading6 blog-title mt-3 duration-300">
            {data.title}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="blog-author caption1 text-secondary">
              by {data.createdBy.name}
            </div>
            <span className="h-[1px] w-[20px] bg-black"></span>
            <div className="blog-date caption1 text-secondary">
              {" "}
              {new Date(data.updatedAt)
                .toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
                .toUpperCase()}
            </div>
          </div>
          <div className="body1 mt-4 text-secondary">
            {data.shortDescription}
          </div>
          <div className="text-button mt-4 underline">Read More</div>
        </div>
      </div>
    </div>
  );
};

export default BlogItem;
