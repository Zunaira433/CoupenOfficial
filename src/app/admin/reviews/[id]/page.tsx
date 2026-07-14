import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditReviewForm from "@/components/EditReviewForm";

export const metadata = { title: "Edit Review – Admin" };
export const revalidate = 0;

export default async function EditReviewPage({ params }: { params: { id: string } }) {
  const review = await prisma.review.findUnique({ where: { id: params.id } });
  if (!review) notFound();

  return <EditReviewForm review={review} />;
}