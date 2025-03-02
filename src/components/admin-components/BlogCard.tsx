import React from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

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

  const handleEdit = () => {
    router.push(`/admin/blog/edit/${blogId}`);
  };

  const handleDelete = () => {
    deleteBlog.mutate({ userId, blogId });
  };

  return (
    <div className="w-full max-w-[400px] space-y-3 rounded-md bg-gray-100 p-4 shadow">
      <div className="flex items-center justify-between">
        <Link href={`/admin/blog/${blogId}`} className="flex flex-col pr-10">
          <p>{title}</p>
          <p>{createdAt}</p>
        </Link>
        <div className="space-x-3">
          <Button onClick={handleEdit}>Edit</Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  blog from the database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default BlogBanner;
