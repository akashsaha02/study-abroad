import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { buildMetadata } from "@/components/seo/PageSEO";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/constants";
import { getPublishedBlogPosts } from "@/lib/services/content";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Blog",
  description: "Study abroad tips, guides, and news from Abroadly.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <Container className="py-12">
      <PageHeader
        title="Blog"
        description="Tips, guides, and insights for your study abroad journey."
      />
      {posts.length === 0 ? (
        <EmptyState
          title="No posts yet"
          description="Blog articles will appear here soon."
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`${ROUTES.blog}/${post.slug}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <h3 className="font-semibold">{post.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {post.excerpt}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
