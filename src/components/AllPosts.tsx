"use client";

import { api } from "@/trpc/react";
import Link from "next/link";

export default function AllBlogPosts() {
  const [post] = api.post.getAll.useSuspenseQuery();
  return (
    <div className="flex flex-col gap-y-4">
      {post.map((p) => (
        <Link href={`/admin/blog/${p.id}`} key={p.id}>
          <h1>{p.title}</h1>
        </Link>
      ))}
    </div>
  );
}
