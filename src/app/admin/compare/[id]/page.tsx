import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditComparisonForm from "@/components/EditComparisonForm";

export const metadata = { title: "Edit Comparison – Admin" };
export const revalidate = 0;

export default async function EditComparePage({ params }: { params: { id: string } }) {
  const comparison = await prisma.comparison.findUnique({ where: { id: params.id } });
  if (!comparison) notFound();

  return <EditComparisonForm comparison={comparison} />;
}