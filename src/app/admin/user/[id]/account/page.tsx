import { getUserById } from "@/utils/getUser";
import { notFound } from "next/navigation";
import MyAccountView from "./MyAccountView";

export default async function AdminUserAccountPage({
  params,
}: {
  params: { id: string };
}) {
  // TODO: Add admin authentication/authorization check
  const user = await getUserById(params.id);
  if (!user) return notFound();
  return <MyAccountView user={user} />;
}
