"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import blogData from "@/data/Blog.json";
import { useRouter } from "next/navigation";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import Menu from "@/components/store-components/Menu";
import BlogItem from "@/components/store-components/BlogItem";
import Breadcrumb from "@/components/store-components/Breadcrumb/Breadcrumb";
import HandlePagination from "@/components/store-components/HandlePagination";

const BlogDefault = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 3;
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

  const handleBlogClick = (blogId: string) => {
    // Go to blog detail with blogId selected
    router.push(`/blog/detail1?id=${blogId}`);
  };

  let filteredData = blogData.filter((blog) => {
    let isCategoryMatched = true;
    if (category) {
      isCategoryMatched =
        blog.category === category && blog.category !== "underwear";
    }

    return isCategoryMatched;
  });

  if (filteredData.length === 0) {
    filteredData = [
      {
        id: "no-data",
        category: "no-data",
        tag: "no-data",
        title: "no-data",
        date: "no-data",
        author: "no-data",
        avatar: "no-data",
        thumbImg: "",
        coverImg: "",
        subImg: ["", ""],
        shortDesc: "no-data",
        description: "no-data",
        slug: "no-data",
      },
    ];
  }

  const pageCount = Math.ceil(filteredData.length / productsPerPage);

  // If page number 0, set current page = 0
  if (pageCount === 0) {
    setCurrentPage(0);
  }

  const currentProducts = filteredData.slice(offset, offset + productsPerPage);

  const handlePageChange = (selected: number) => {
    setCurrentPage(selected);
  };

  return (
    <>
      <div id="header" className="relative w-full">
        <Menu props="bg-transparent" />
        <Breadcrumb heading="Blog Default" subHeading="Blog Default" />
      </div>
      <div className="blog default py-10 md:py-20">
        <div className="container">
          <div className="flex justify-between gap-y-12 max-md:flex-col">
            <div className="left pr-2 md:w-2/3 xl:w-3/4">
              <div className="list-blog flex flex-col gap-8 md:gap-10">
                {currentProducts.map((item) => (
                  <BlogItem key={item.id} data={item} type="style-default" />
                ))}
              </div>
              {pageCount > 1 && (
                <div className="list-pagination mt-6 flex w-full items-center justify-center md:mt-10">
                  <HandlePagination
                    pageCount={pageCount}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
            <div className="right md:w-1/3 md:pl-8 xl:w-1/4 xl:pl-[52px]">
              <form className="form-search relative h-12 w-full">
                <input
                  className="h-full w-full rounded-lg border border-line px-4 py-2"
                  type="text"
                  placeholder="Search"
                />
                <button>
                  <Icon.MagnifyingGlass className="heading6 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-secondary duration-300 hover:text-black" />
                </button>
              </form>
              <div className="recent mt-6 border-b border-line pb-8 md:mt-10">
                <div className="heading6">Recent Posts</div>
                <div className="list-recent pt-1">
                  {blogData.slice(12, 15).map((item) => (
                    <div
                      className="item mt-5 flex cursor-pointer gap-4"
                      key={item.id}
                      onClick={() => handleBlogClick(item.id)}
                    >
                      <Image
                        src={item.thumbImg}
                        width={500}
                        height={400}
                        alt={item.thumbImg}
                        className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
                      />
                      <div>
                        <div className="blog-tag bg-green text-button-uppercase inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-xs">
                          {item.tag}
                        </div>
                        <div className="text-title mt-1">{item.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="filter-category mt-6 border-b border-line pb-8 md:mt-10">
                <div className="heading6">Categories</div>
                <div className="list-cate pt-1">
                  <div
                    className={`cate-item mt-3 flex cursor-pointer items-center justify-between ${category === "fashion" ? "active" : ""}`}
                    onClick={() => handleCategory("fashion")}
                  >
                    <div className="has-line-before capitalize text-secondary hover:text-black">
                      Fashion
                    </div>
                    <div className="text-secondary2">
                      (
                      {
                        blogData.filter(
                          (dataItem) => dataItem.category === "fashion",
                        ).length
                      }
                      )
                    </div>
                  </div>
                  <div
                    className={`cate-item mt-3 flex cursor-pointer items-center justify-between ${category === "cosmetic" ? "active" : ""}`}
                    onClick={() => handleCategory("cosmetic")}
                  >
                    <div className="has-line-before capitalize text-secondary hover:text-black">
                      cosmetic
                    </div>
                    <div className="text-secondary2">
                      (
                      {
                        blogData.filter(
                          (dataItem) => dataItem.category === "cosmetic",
                        ).length
                      }
                      )
                    </div>
                  </div>
                  <div
                    className={`cate-item mt-3 flex cursor-pointer items-center justify-between ${category === "toys-kid" ? "active" : ""}`}
                    onClick={() => handleCategory("toys-kid")}
                  >
                    <div className="has-line-before capitalize text-secondary hover:text-black">
                      toys kid
                    </div>
                    <div className="text-secondary2">
                      (
                      {
                        blogData.filter(
                          (dataItem) => dataItem.category === "toys-kid",
                        ).length
                      }
                      )
                    </div>
                  </div>
                  <div
                    className={`cate-item mt-3 flex cursor-pointer items-center justify-between ${category === "yoga" ? "active" : ""}`}
                    onClick={() => handleCategory("yoga")}
                  >
                    <div className="has-line-before capitalize text-secondary hover:text-black">
                      yoga
                    </div>
                    <div className="text-secondary2">
                      (
                      {
                        blogData.filter(
                          (dataItem) => dataItem.category === "yoga",
                        ).length
                      }
                      )
                    </div>
                  </div>
                  <div
                    className={`cate-item mt-3 flex cursor-pointer items-center justify-between ${category === "organic" ? "active" : ""}`}
                    onClick={() => handleCategory("organic")}
                  >
                    <div className="has-line-before capitalize text-secondary hover:text-black">
                      organic
                    </div>
                    <div className="text-secondary2">
                      (
                      {
                        blogData.filter(
                          (dataItem) => dataItem.category === "organic",
                        ).length
                      }
                      )
                    </div>
                  </div>
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
    </>
  );
};

export default BlogDefault;
