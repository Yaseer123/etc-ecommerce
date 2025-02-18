import AddCategoryForm from "@/components/AddCategory";
import CategoryAccordionManager from "@/components/CategoryAccordionManager";

export default function Categories() {
  return (
    <div className="flex flex-wrap min-h-[80vh] items-center justify-center gap-x-10 gap-y-5 p-10">
      <CategoryAccordionManager />
      <AddCategoryForm />
    </div>
  );
}
