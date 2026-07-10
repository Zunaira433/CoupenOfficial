import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditBlogPostForm from "@/components/EditBlogPostForm";

export const metadata = { title: "Edit Blog Post – Admin" };
export const revalidate = 0;

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!post) notFound();

  return <EditBlogPostForm post={post} />;
}