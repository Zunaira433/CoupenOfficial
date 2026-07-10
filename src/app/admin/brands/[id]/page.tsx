import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditBrandForm from "@/components/EditBrandForm";

export const metadata = { title: "Edit Brand – Admin" };
export const revalidate = 0;

export default async function EditBrandPage({ params }: { params: { id: string } }) {
  const brand = await prisma.brand.findUnique({ where: { id: params.id } });
  if (!brand) notFound();

  return <EditBrandForm brand={brand} />;
}