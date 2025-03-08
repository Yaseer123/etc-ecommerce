"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Footer from "@/components/store-components/Footer";
import { useRouter } from "next/navigation";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import Breadcrumb from "@/components/store-components/Breadcrumb/Breadcrumb";
import BlogItem from "@/components/store-components/Blog/BlogItem";
import HandlePagination from "@/components/store-components/HandlePagination";
import { api } from "@/trpc/react";

const BlogsPage = () => {
  const [blogPosts] = api.post.getAllPretty.useSuspenseQuery();
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 4;
  const offset = currentPage * productsPerPage;
  const router = useRouter();
  const searchParams = useSearchParams();
  const dataCategory = searchParams.get("category");
  const [category, setCategory] = useState<string | null>(dataCategory);

  const handleCategory = (category: string) => {
    setCategory((prevCategory) =>
      prevCategory === category ? null : category,
    );
  };

  const handleBlogClick = (blogId: string, slug: string) => {
    router.push(`/blog/${slug}?id=${blogId}`);
  };

  const pageCount = Math.ceil(blogPosts.length / productsPerPage);

  useEffect(() => {
    if (pageCount === 0 && currentPage !== 0) {
      setCurrentPage(0);
    }
  }, [pageCount, currentPage]);

  const currentBlogs = blogPosts.slice(offset, offset + productsPerPage);

  const handlePageChange = (selected: number) => {
    setCurrentPage(selected);
  };
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Categories", href: "/categories" },
  ];
  return (
    <>
      <div id="header" className="relative w-full">
        <Breadcrumb items={breadcrumbItems} pageTitle="Blogs" />
      </div>
      <div className="blog list py-10 md:py-20">
        <div className="container">
          <div className="flex justify-between gap-y-12 max-xl:flex-col">
            <div className="left xl:w-3/4 xl:pr-2">
              <div className="list-blog flex flex-col gap-8 xl:gap-10">
                {currentBlogs.map((item) => (
                  <BlogItem key={item.id} data={item} />
                ))}
              </div>
              {pageCount > 1 && (
                <div className="list-pagination mt-6 flex w-full items-center md:mt-10">
                  <HandlePagination
                    pageCount={pageCount}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
            <div className="right xl:w-1/4 xl:pl-[52px]">
              <form className="form-search relative h-12 w-full">
                <input
                  className="h-full w-full rounded-lg border border-line px-4 py-2"
                  type="text"
                  placeholder="Search"
                />
                <button type="submit">
                  <Icon.MagnifyingGlass className="heading6 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-secondary duration-300 hover:text-black" />
                </button>
              </form>
              <div className="recent mt-6 border-b border-line pb-8 md:mt-10">
                <div className="heading6">Recent Posts</div>
                <div className="list-recent pt-1">
                  {blogPosts.slice(0, 3).map((item) => (
                    <div
                      className="item mt-5 flex cursor-pointer gap-4"
                      key={item.id}
                      onClick={() => handleBlogClick(item.id, item.slug)}
                    >
                      <Image
                        src={item.coverImageUrl}
                        width={500}
                        height={400}
                        alt="blog cover image"
                        className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
                      />
                      <div>
                        <div className="blog-tag text-button-uppercase inline-block whitespace-nowrap rounded-full bg-green px-2 py-0.5 text-xs">
                          {item.tags.join(", ")}
                        </div>
                        <div className="text-title mt-1">{item.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="filter-tags mt-6 md:mt-10">
                <div className="heading6">Tags Cloud</div>
                <div className="list-tags mt-4 flex flex-wrap items-center gap-3">
                  <div
                    className={`tags text-button-uppercase cursor-pointer rounded-full border border-line bg-white px-4 py-1.5 text-secondary duration-300 hover:bg-black hover:text-white ${category === "fashion" ? "active" : ""}`}
                    onClick={() => handleCategory("fashion")}
                  >
                    fashion
                  </div>
                  <div
                    className={`tags text-button-uppercase cursor-pointer rounded-full border border-line bg-white px-4 py-1.5 text-secondary duration-300 hover:bg-black hover:text-white ${category === "cosmetic" ? "active" : ""}`}
                    onClick={() => handleCategory("cosmetic")}
                  >
                    cosmetic
                  </div>
                  <div
                    className={`tags text-button-uppercase cursor-pointer rounded-full border border-line bg-white px-4 py-1.5 text-secondary duration-300 hover:bg-black hover:text-white ${category === "toy-kid" ? "active" : ""}`}
                    onClick={() => handleCategory("toys-kid")}
                  >
                    toys kid
                  </div>
                  <div
                    className={`tags text-button-uppercase cursor-pointer rounded-full border border-line bg-white px-4 py-1.5 text-secondary duration-300 hover:bg-black hover:text-white ${category === "yoga" ? "active" : ""}`}
                    onClick={() => handleCategory("yoga")}
                  >
                    yoga
                  </div>
                  <div
                    className={`tags text-button-uppercase cursor-pointer rounded-full border border-line bg-white px-4 py-1.5 text-secondary duration-300 hover:bg-black hover:text-white ${category === "organic" ? "active" : ""}`}
                    onClick={() => handleCategory("organic")}
                  >
                    organic
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogsPage;
