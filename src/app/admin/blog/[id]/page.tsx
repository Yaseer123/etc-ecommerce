import RenderBlog from "@/components/RenderBlog";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return (
    <div className="min-h-50 p-4 md:p-10">
      <RenderBlog id={id} />
    </div>
  );
}
