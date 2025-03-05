"use client";

import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RichEditor from "../rich-editor";
import { Input } from "../ui/input";

export default function EditBlogForm({
  userId,
  blogId,
}: {
  userId: string;
  blogId: string;
}) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const [post] = api.post.getOne.useSuspenseQuery({ id: blogId });

  useEffect(() => {
    if (!post) return;
    const { title, slug } = post;
    setTitle(title);
    setSlug(slug);
  }, [post]);

  if (!post) return null;

  const utils = api.useUtils();
  const editPost = api.post.edit.useMutation({
    onSuccess: async () => {
      await utils.post.getOne.invalidate({ id: blogId });
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

    editPost.mutate({
      id: post.id,
      imageId: post.imageId,
      title: title,
      content: content,
      slug: slug,
      createdBy: userId,
    });
  };
  return (
    <RichEditor
      content={post.content}
      handleSubmit={handleSubmit}
      imageId={post.imageId}
      pending={pending}
      submitButtonText="Update Post"
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
