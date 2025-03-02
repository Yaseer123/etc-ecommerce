import AddCategoryForm from "@/components/admin-components/AddCategory";
import CategoryAccordionManager from "@/components/admin-components/CategoryAccordionManager";
import { HydrateClient } from "@/trpc/server";

export default function Categories() {
  return (
    <HydrateClient>
      <div className="flex min-h-[80vh] flex-wrap items-start justify-center gap-x-10 gap-y-5 p-10">
        <CategoryAccordionManager />
        <AddCategoryForm />
      </div>
    </HydrateClient>
  );
}
