"use client";

import { api } from "@/trpc/react";
import BlogBanner from "./BlogCard";

export default function AllBlogPosts({ userId }: { userId: string }) {
  const [post] = api.post.getAll.useSuspenseQuery();

  return (
    <div className="flex flex-col gap-y-4">
      {post.map((p) => (
        // <Link href={`/admin/blog/${p.id}`} key={p.id}>
        //   <h1>{p.title}</h1>
        // </Link>
        <BlogBanner
          key={p.id}
          userId={userId}
          blogId={p.id}
          createdAt={p.createdAt.toLocaleDateString()}
          title={p.title}
        />
      ))}
    </div>
  );
}
