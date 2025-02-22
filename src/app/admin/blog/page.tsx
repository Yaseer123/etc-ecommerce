import AllBlogPosts from "@/components/AllPosts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth } from "@/server/auth";
import Link from "next/link";

export default async function BlogPosts() {
  const session = await auth();
  if (!session) {
    return null;
  }

  return (
    <div className="space-y-7 p-4 md:p-10">
      <div className="mx-auto flex max-w-[600px] gap-5">
        <Input type="text" />
        <Button asChild>
          <Link href="/admin/blog/create">Create new</Link>
        </Button>
      </div>
      <AllBlogPosts userId={session.user.id} />
    </div>
  );
}
