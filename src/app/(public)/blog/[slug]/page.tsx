import { PageLayout } from "@/components/common/PageLayout";
import { SurfaceCard } from "@/components/common/SurfaceCard";
import { buildMetadata } from "@/components/seo/PageSEO";
import { getBlogPostBySlug } from "@/lib/services/content";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return buildMetadata({
    title: post.meta_title ?? post.title,
    description: post.meta_description ?? post.excerpt ?? "",
    path: `/blog/${slug}`,
    image: post.cover_image_url ?? undefined,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <PageLayout>
      <article className="mx-auto max-w-3xl">
        <SurfaceCard hover={false} padding="lg" className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-3 text-lg text-muted-foreground">{post.excerpt}</p>
          )}
          {post.published_at && (
            <p className="mt-4 text-sm text-muted-foreground">
              Published {new Date(post.published_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </SurfaceCard>

        <SurfaceCard hover={false} padding="lg">
          <div
            className="prose prose-neutral max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
          />
        </SurfaceCard>
      </article>
    </PageLayout>
  );
}
