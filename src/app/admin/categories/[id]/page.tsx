import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditCategoryForm from "@/components/EditCategoryForm";

export const metadata = { title: "Edit Category – Admin" };
export const revalidate = 0;

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const category = await prisma.category.findUnique({ where: { id: params.id } });
  if (!category) notFound();

  return <EditCategoryForm category={category} />;
}