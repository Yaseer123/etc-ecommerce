import CategoryAttributesManager from "@/components/admin-components/CategoryAttributesManager";
import { HydrateClient } from "@/trpc/server";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <HydrateClient>
      <div className="min-h-[80vh] p-10">
        <CategoryAttributesManager categoryId={id} />
      </div>
    </HydrateClient>
  );
}
