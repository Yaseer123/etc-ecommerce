"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import blogData from "@/data/Blog.json";
import { useRouter } from "next/navigation";
import NewsInsight from "@/components/store-components/NewsInsight";

export default function BlogDetailsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  let blogId = searchParams.get("id");
  if (blogId === null) {
    blogId = "14";
  }

  const blogMain = blogData[Number(blogId) - 1];

  const handleBlogClick = (category: string) => {
    // Go to blog detail with category selected
    router.push(`/blog/default?category=${category}`);
  };

  const handleBlogDetail = (id: string) => {
    // Go to blog detail with id selected
    router.push(`/blog/detail1?id=${id}`);
  };
  return (
    <div className="blog detail1">
      <div className="bg-img mt-14 md:mt-[74px]">
        <Image
          src={blogMain.thumbImg}
          width={5000}
          height={4000}
          alt={blogMain.thumbImg}
          className="h-[260px] w-full object-cover sm:h-[380px] lg:h-[520px] xl:h-[640px] min-[1600px]:h-[800px]"
        />
      </div>
      <div className="container pt-10 md:pt-20">
        <div className="blog-content flex items-center justify-center">
          <div className="main w-full md:w-5/6">
            <div className="blog-tag bg-green text-button-uppercase inline-block rounded-full px-2.5 py-1">
              {blogMain.tag}
            </div>
            <div className="heading3 mt-3">{blogMain.title}</div>
            <div className="author mt-4 flex items-center gap-4">
              <div className="avatar h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                <Image
                  src={blogMain.avatar}
                  width={200}
                  height={200}
                  alt="avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="caption1 text-secondary">
                  by {blogMain.author}
                </div>
                <div className="line h-px w-5 bg-secondary"></div>
                <div className="caption1 text-secondary">{blogMain.date}</div>
              </div>
            </div>
            <div className="content mt-5 md:mt-8">
              <div className="body1">{blogMain.description}</div>
              <div className="body1 mt-3">
                I’ve always been passionate about underwear and shapewear and
                have a huge collection from over the years! When it came to
                shapewear, I could never find exactly what I was looking for and
                I would cut up pieces and sew them together to create the style
                and compression I needed.
              </div>
              <div className="mt-5 grid gap-[30px] sm:grid-cols-2 md:mt-8">
                {blogMain.subImg.map((item, index) => (
                  <Image
                    key={index}
                    src={item}
                    width={3000}
                    height={2000}
                    alt={item}
                    className="w-full rounded-3xl"
                  />
                ))}
              </div>
              <div className="heading4 mt-5 md:mt-8">How did SKIMS start?</div>
              <div className="body1 mt-4">
                This is such a hard question! Honestly, every time we drop a new
                collection I get obsessed with it. The pieces that have been my
                go-tos though are some of our simplest styles that we launched
                with. I wear our Fits Everybody Thong every single day – it is
                the only underwear I have now, it’s so comfortable and stretchy
                and light enough that you can wear anything over it.
              </div>
              <div className="body1 mt-4">
                For bras, I love our Cotton Jersey Scoop Bralette – it’s lined
                with this amazing power mesh so you get great support and is so
                comfy I can sleep in it. I also love our Seamless Sculpt
                Bodysuit – it’s the perfect all in one sculpting, shaping and
                smoothing shapewear piece with different levels of support woven
                throughout.
              </div>
            </div>
            <div className="action mt-5 flex flex-wrap items-center justify-between gap-5 md:mt-8">
              <div className="left flex flex-wrap items-center gap-3">
                <p>Tag:</p>
                <div className="list flex flex-wrap items-center gap-3">
                  <div
                    className={`tags text-button-uppercase cursor-pointer rounded-full bg-surface px-4 py-1.5 duration-300 hover:bg-black hover:text-white`}
                    onClick={() => handleBlogClick("fashion")}
                  >
                    fashion
                  </div>
                  <div
                    className={`tags text-button-uppercase cursor-pointer rounded-full bg-surface px-4 py-1.5 duration-300 hover:bg-black hover:text-white`}
                    onClick={() => handleBlogClick("yoga")}
                  >
                    yoga
                  </div>
                  <div
                    className={`tags text-button-uppercase cursor-pointer rounded-full bg-surface px-4 py-1.5 duration-300 hover:bg-black hover:text-white`}
                    onClick={() => handleBlogClick("organic")}
                  >
                    organic
                  </div>
                </div>
              </div>
              <div className="right flex flex-wrap items-center gap-3">
                <p>Share:</p>
                <div className="list flex flex-wrap items-center gap-3">
                  <Link
                    href={"https://www.facebook.com/"}
                    target="_blank"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-surface duration-300 hover:bg-black hover:text-white"
                  >
                    <div className="icon-facebook duration-100"></div>
                  </Link>
                  <Link
                    href={"https://www.instagram.com/"}
                    target="_blank"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-surface duration-300 hover:bg-black hover:text-white"
                  >
                    <div className="icon-instagram duration-100"></div>
                  </Link>
                  <Link
                    href={"https://www.twitter.com/"}
                    target="_blank"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-surface duration-300 hover:bg-black hover:text-white"
                  >
                    <div className="icon-twitter duration-100"></div>
                  </Link>
                  <Link
                    href={"https://www.youtube.com/"}
                    target="_blank"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-surface duration-300 hover:bg-black hover:text-white"
                  >
                    <div className="icon-youtube duration-100"></div>
                  </Link>
                  <Link
                    href={"https://www.pinterest.com/"}
                    target="_blank"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-surface duration-300 hover:bg-black hover:text-white"
                  >
                    <div className="icon-pinterest duration-100"></div>
                  </Link>
                </div>
              </div>
            </div>
            <div className="next-pre mt-5 flex items-center justify-between border-y border-line py-6 md:mt-8">
              {blogId === "1" ? (
                <>
                  <div
                    className="left cursor-pointer"
                    onClick={() => handleBlogDetail(String(blogData.length))}
                  >
                    <div className="text-button-uppercase text-secondary2">
                      Previous
                    </div>
                    <div className="text-title mt-2">
                      {blogData[blogData.length - 1].title}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="left cursor-pointer"
                    onClick={() =>
                      handleBlogDetail(blogData[Number(blogId) - 2].id)
                    }
                  >
                    <div className="text-button-uppercase text-secondary2">
                      Previous
                    </div>
                    <div className="text-title mt-2">
                      {blogData[Number(blogId) - 2].title}
                    </div>
                  </div>
                </>
              )}
              {Number(blogId) === blogData.length ? (
                <>
                  <div
                    className="right cursor-pointer text-right"
                    onClick={() => handleBlogDetail("1")}
                  >
                    <div className="text-button-uppercase text-secondary2">
                      Next
                    </div>
                    <div className="text-title mt-2">{blogData[0].title}</div>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="right cursor-pointer text-right"
                    onClick={() =>
                      handleBlogDetail(blogData[Number(blogId)].id)
                    }
                  >
                    <div className="text-button-uppercase text-secondary2">
                      Next
                    </div>
                    <div className="text-title mt-2">
                      {blogData[Number(blogId)].title}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="pb-10 md:pb-20">
        <NewsInsight data={blogData} start={0} limit={3} />
      </div>
    </div>
  );
}
