import { Container } from "@/components/common/Container";
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
    <Container className="py-12">
      <article className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold">{post.title}</h1>
        {post.published_at && (
          <p className="mt-2 text-sm text-muted-foreground">
            {new Date(post.published_at).toLocaleDateString()}
          </p>
        )}
        <div
          className="prose prose-neutral mt-8 max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
        />
      </article>
    </Container>
  );
}
