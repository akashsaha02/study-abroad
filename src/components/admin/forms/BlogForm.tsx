"use client";

import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { BlogEditor } from "@/components/admin/BlogEditor";
import { SlugField } from "@/components/admin/SlugField";
import { parseApiError } from "@/components/admin/forms/api-error";
import { FormField } from "@/components/forms/FormField";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { STORAGE_BUCKETS } from "@/constants";
import { uploadPublicFile } from "@/lib/storage/upload";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  is_published: boolean;
}

interface BlogFormProps {
  initial?: BlogPost;
}

const FORM_ID = "blog-form";

export function BlogForm({ initial }: BlogFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(initial?.cover_image_url ?? "");
  const [metaTitle, setMetaTitle] = useState(initial?.meta_title ?? "");
  const [metaDescription, setMetaDescription] = useState(initial?.meta_description ?? "");
  const [isPublished, setIsPublished] = useState(initial?.is_published ?? false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const file = formData.get("cover_image") as File;
      let nextCoverUrl = coverImageUrl || null;

      if (file?.size) {
        const path = `${Date.now()}-${file.name}`;
        const { publicUrl } = await uploadPublicFile(
          STORAGE_BUCKETS.blogImages,
          file,
          path
        );
        nextCoverUrl = publicUrl;
        setCoverImageUrl(publicUrl);
      }

      const payload = {
        title,
        slug,
        excerpt: excerpt || null,
        content: content || null,
        cover_image_url: nextCoverUrl,
        meta_title: metaTitle || null,
        meta_description: metaDescription || null,
        is_published: isPublished,
      };

      const res = await fetch(
        isEdit ? `/api/admin/blog/${initial!.id}` : "/api/admin/blog",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(parseApiError(data, "Failed to save blog post"));

      toast.success(isEdit ? "Blog post updated" : "Blog post created");
      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminFormShell
      title={isEdit ? "Edit blog post" : "New blog post"}
      backHref="/admin/blog"
      formId={FORM_ID}
      saving={loading}
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="space-y-4 p-6">
            <FormField label="Title" htmlFor="title" required>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </FormField>
            <SlugField title={title} value={slug} onChange={setSlug} />
            <FormField label="Excerpt" htmlFor="excerpt">
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
              />
            </FormField>
            <FormField label="Content" htmlFor="content">
              <BlogEditor content={content} onChange={setContent} />
            </FormField>
            <FormField label="Cover image" htmlFor="cover_image">
              {coverImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverImageUrl}
                  alt="Cover"
                  className="mb-2 h-32 w-auto rounded-md border object-cover"
                />
              )}
              <Input id="cover_image" name="cover_image" type="file" accept="image/*" />
            </FormField>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
              Published
            </label>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="font-semibold">SEO</h2>
            <FormField label="Meta title" htmlFor="meta_title">
              <Input
                id="meta_title"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
              />
            </FormField>
            <FormField label="Meta description" htmlFor="meta_description">
              <Textarea
                id="meta_description"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={3}
              />
            </FormField>
          </CardContent>
        </Card>
      </form>
    </AdminFormShell>
  );
}
