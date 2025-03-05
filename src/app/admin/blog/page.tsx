import AllBlogPosts from "@/components/admin-components/AllPosts";
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
    <div className="space-y-14 p-4 md:p-10">
      <div className="mx-auto flex max-w-[600px] gap-5">
        <Input type="text" placeholder="Search blogs by title" />
        <Button asChild>
          <Link href="/admin/blog/create">Create new</Link>
        </Button>
      </div>
      <AllBlogPosts userId={session.user.id} />
    </div>
  );
}
