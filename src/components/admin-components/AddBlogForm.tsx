"use client";

import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import RichEditor from "../rich-editor";
import { Input } from "../ui/input";

export default function AddBlogForm({ userId }: { userId: string }) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [pending, setPending] = useState(false);
  const [imageId] = useState(uuid());
  const router = useRouter();

  useEffect(() => {
    const name = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    setSlug(name);
  }, [setSlug, title]);

  const utils = api.useUtils();
  const addPost = api.post.add.useMutation({
    onSuccess: async () => {
      await utils.post.getAll.invalidate();
      router.push("/admin/blog");
    },
    onError: ({ message }) => {
      console.log(message);
    },
    onSettled: () => {
      setPending(false);
    },
  });
  const handleSubmit = (content: string) => {
    setPending(true);

    addPost.mutate({
      imageId: imageId,
      title: title,
      content: content,
      slug: slug,
      createdBy: userId,
    });
  };
  return (
    <RichEditor
      content=""
      handleSubmit={handleSubmit}
      imageId={imageId}
      pending={pending}
      submitButtonText="Create New Post"
    >
      <div className="flex gap-4">
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
      </div>
    </RichEditor>
  );
}
