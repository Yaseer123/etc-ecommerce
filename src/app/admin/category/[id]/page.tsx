import CategoryAttributesManager from "@/components/admin-components/CategoryAttributesManager";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={<div className="p-10">Loading category...</div>}>
      <HydrateClient>
        <div className="min-h-[80vh] p-10">
          <CategoryAttributesManager categoryId={id} />
        </div>
      </HydrateClient>
    </Suspense>
  );
}
