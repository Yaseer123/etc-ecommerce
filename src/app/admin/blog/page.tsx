import ContentForm from "@/components/BlogEditor";

export default function BlogPage() {
  return (
    <div className="min-h-50 flex flex-col items-center justify-center gap-4 p-4 md:p-10">
      <h2 className="text-2xl font-bold">Blog page</h2>
      <div className="prose">
        <ContentForm />
      </div>
    </div>
  );
}
