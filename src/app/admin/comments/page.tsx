import { prisma } from "@/lib/prisma";
import CommentModerationRow from "@/components/CommentModerationRow";
import { MessageCircle } from "lucide-react";

export const metadata = { title: "Manage Comments – Admin" };
export const revalidate = 0;

export default async function AdminCommentsPage() {
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      blogPost: { select: { title: true, slug: true } },
      comparison: { select: { title: true, slug: true } }
    }
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <MessageCircle className="w-7 h-7 text-primary" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Comments</h1>
      </div>

      {comments.length === 0 ? (
        <p className="text-center text-gray-400 dark:text-gray-600 py-12">No comments yet.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => {
            const source = c.blogPost
              ? { title: c.blogPost.title, href: `/blog/${c.blogPost.slug}` }
              : c.comparison
              ? { title: c.comparison.title, href: `/compare/${c.comparison.slug}` }
              : { title: "Deleted content", href: "#" };

            return (
              <CommentModerationRow
                key={c.id}
                id={c.id}
                body={c.body}
                adminReply={c.adminReply}
                userName={c.user.name || c.user.email}
                postTitle={source.title}
                postHref={source.href}
                createdAt={c.createdAt.toISOString()}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}