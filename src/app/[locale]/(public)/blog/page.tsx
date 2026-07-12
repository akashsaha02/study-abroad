import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { PageLayout } from "@/components/common/PageLayout";
import { BlogCard } from "@/components/public/BlogCard";
import { buildMetadata } from "@/components/seo/PageSEO";
import { getPublishedBlogPosts } from "@/lib/services/content";
import { BookOpen01Icon } from "@hugeicons/core-free-icons";

export const metadata = buildMetadata({
  title: "Blog",
  description: "Study abroad tips, guides, and news from Abroadly.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Insights"
        eyebrowIcon={BookOpen01Icon}
        title="Blog"
        description="Tips, guides, and insights for your study abroad journey."
      />
      {posts.length === 0 ? (
        <EmptyState
          title="No posts yet"
          description="Blog articles will appear here soon."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              slug={post.slug!}
              title={post.title}
              excerpt={post.excerpt}
            />
          ))}
        </div>
      )}
    </PageLayout>
  );
}
