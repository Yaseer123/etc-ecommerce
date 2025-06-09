import EditProductForm from "@/components/admin-components/EditProduct";
import { HydrateClient } from "@/trpc/server";

export default async function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return (
    <HydrateClient>
      <div className="flex min-h-[80vh] items-center justify-center p-4 sm:p-10">
        <div className="w-full max-w-md">
          <EditProductForm productId={id} />
        </div>
      </div>
    </HydrateClient>
  );
}
