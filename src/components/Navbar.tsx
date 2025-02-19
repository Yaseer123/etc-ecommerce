import Link from "next/link";
import { Button } from "./ui/button";
import { auth } from "@/server/auth";

export default async function Navbar() {
  const session = await auth();
  return (
    <div className="flex items-center justify-between bg-gray-100 px-7 py-3 shadow-md">
      <Link href="/admin" className="text-lg font-bold">
        Admin Panel
      </Link>
      <div className="flex items-center gap-x-4">
        <Button asChild variant="outline">
          <Link href="/admin/user">Users</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/category">Categories</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/product">Products</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/blog">Blogs</Link>
        </Button>
        {session && (
          <Button asChild variant="default">
            <Link href="/api/auth/signout">Sign out</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
