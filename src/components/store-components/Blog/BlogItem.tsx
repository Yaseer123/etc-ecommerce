"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { type BlogType } from "@/types/BlogType";
import { useRouter } from "next/navigation";

interface BlogProps {
  data: BlogType;
  type: string;
}

const BlogItem: React.FC<BlogProps> = ({ data, type }) => {
  const router = useRouter();
  const handleBlogClick = (blogId: string) => {
    // Go to blog detail with blogId selected
    router.push(`/blog/detail1?id=${blogId}`);
  };

  return (
    <div
      className="blog-item style-one h-full cursor-pointer"
      onClick={() => handleBlogClick(data.id)}
    >
      <div className="blog-main block h-full">
        <div className="blog-thumb overflow-hidden rounded-[20px]">
          <Image
            src={data.coverImageUrl}
            width={960}
            height={640}
            alt="blog-img"
            className="h-[640px] w-[960px] duration-500"
          />
        </div>
        <div className="blog-infor mt-7">
          <div className="blog-tag bg-green text-button-uppercase inline-block rounded-full px-2.5 py-1">
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
              {new Date(data.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogItem;
