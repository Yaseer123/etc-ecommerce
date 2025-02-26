import EditProductForm from "@/components/EditProduct";
import { HydrateClient } from "@/trpc/server";

export default async function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return (
    <HydrateClient>
      <div className="flex min-h-[80vh] items-center justify-center p-10">
        <EditProductForm productId={id} />
      </div>
    </HydrateClient>
  );
}
