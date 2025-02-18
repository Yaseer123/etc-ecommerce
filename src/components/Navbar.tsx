import Link from "next/link";
import { Button } from "./ui/button";
import { auth } from "@/server/auth";

export default async function Navbar() {
  const session = await auth();
  return (
    <div className="flex items-center justify-between bg-gray-100 px-7 py-3 shadow-md">
      <p className="text-lg font-bold">Admin Panel</p>
      <div className="flex items-center gap-x-4">
        <Button asChild variant="outline">
          <Link href="/admin/users">Users</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/categories">Categories</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/products">Products</Link>
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
