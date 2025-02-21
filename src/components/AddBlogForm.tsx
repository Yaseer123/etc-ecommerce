"use client";

import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import RichEditor from "./rich-editor";

export default function AddBlogForm({ userId }: { userId: string }) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [pending, setPending] = useState(false);
  const [imageId] = useState(uuid());
  const router = useRouter();

  const addPost = api.post.add.useMutation({
    onSuccess: () => {
      setTitle("");
      setSlug("");
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
      title={title}
      content=""
      handleSubmit={handleSubmit}
      imageId={imageId}
      pending={pending}
      setSlug={setSlug}
      setTitle={setTitle}
      slug={slug}
    />
  );
}
