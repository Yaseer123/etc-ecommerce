import React from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface BlogBannerProps {
  userId: string;
  blogId: string;
  title: string;
  createdAt: string;
}

const BlogBanner: React.FC<BlogBannerProps> = ({
  userId,
  blogId,
  title,
  createdAt,
}) => {
  const router = useRouter();

  const utils = api.useUtils();
  const deleteBlog = api.post.delete.useMutation({
    onSuccess: async () => {
      toast.success("The post is deleted successfully");
      await utils.post.getAll.invalidate();
    },
  });

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    router.push(`/admin/blog/edit/${blogId}`);
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    deleteBlog.mutate({ userId, blogId });
  };

  return (
    <Link
      href={`/admin/blog/${blogId}`}
      className="w-full max-w-[400px] space-y-3 rounded-md bg-gray-100 p-4 shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <p>{title}</p>
          <p>{createdAt}</p>
        </div>
        <div className="space-x-3">
          <Button onClick={handleEdit}>Edit</Button>
          <Button onClick={handleDelete}>Delete</Button>
        </div>
      </div>
    </Link>
  );
};

export default BlogBanner;
