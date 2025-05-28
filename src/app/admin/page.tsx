import AdminDashboard from "@/components/admin-components/AdminDashboard";
import Link from "next/link";

export default async function AdminPage() {
  return (
    <div className="flex min-h-[90vh] items-center justify-center">
      <AdminDashboard />
      <p className="text-center text-2xl font-semibold">Product Information</p>
      <div className="mt-4 flex justify-center">
        <Link
          href="/admin/orders"
          className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          Go to Orders Management
        </Link>
      </div>
    </div>
  );
}
