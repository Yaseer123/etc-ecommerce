"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import DOMPurify from "dompurify";

export default function BlogDetailsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const blogId = searchParams.get("id");
  if (blogId === null) {
    return router.push("/blog");
  }

  const [blogMain] = api.post.getOne.useSuspenseQuery({ id: blogId });

  if (blogMain === null) {
    return router.push("/blog");
  }

  // const handleBlogClick = (category: string) => {
  //   // Go to blog detail with category selected
  //   router.push(`/blog/default?category=${category}`);
  // };

  // const handleBlogDetail = (id: string) => {
  //   // Go to blog detail with id selected
  //   router.push(`/blog/detail1?id=${id}`);
  // };
  return (
    <div className="blog detail1">
      <div className="bg-img mt-14 md:mt-[74px]">
        <Image
          src={blogMain.coverImageUrl}
          width={5000}
          height={4000}
          alt="Blog cover image"
          className="h-[260px] w-full object-cover sm:h-[380px] lg:h-[520px] xl:h-[640px] min-[1600px]:h-[800px]"
        />
      </div>
      <div className="container pt-10 md:pt-20">
        <div className="blog-content flex items-center justify-center">
          <div className="main w-full md:w-5/6">
            <div className="blog-tag text-button-uppercase inline-block rounded-full bg-green px-2.5 py-1">
              {blogMain.tags.join(", ")}
            </div>
            <div className="heading3 mt-3">{blogMain.title}</div>
            <div className="author mt-4 flex items-center gap-4">
              {/* <div className="avatar h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                <Image
                  src=
                  width={200}
                  height={200}
                  alt="avatar"
                  className="h-full w-full object-cover"
                />
              </div> */}
              <div className="flex items-center gap-2">
                <div className="caption1 text-secondary">
                  by {blogMain.createdBy.name}
                </div>
                <div className="line h-px w-5 bg-secondary"></div>
                <div className="caption1 text-secondary">
                  {new Date(blogMain.updatedAt)
                    .toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                    .toUpperCase()}
                </div>
              </div>
            </div>
            <div className="content mt-5 md:mt-8">
              <div className="body1">{blogMain.shortDescription}</div>
              {/* <div className="body1 mt-3">{blogMain.content}</div> */}
              <div
                className="body1 prose prose-sm mt-3 outline-none sm:prose-base lg:prose-lg xl:prose-2xl"
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(blogMain.content),
                }}
              />
            </div>
            <div className="action mt-5 flex w-full items-center justify-end p-4 md:mt-8">
              <div className="right ml-auto flex flex-wrap items-center gap-3">
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
          </div>
        </div>
      </div>
      {/* <div className="pb-10 md:pb-20">
        <NewsInsight data={blogData} start={0} limit={3} />
      </div> */}
    </div>
  );
}
