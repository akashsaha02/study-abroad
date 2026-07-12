"use client";

import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { SlugField } from "@/components/admin/SlugField";
import { parseApiError } from "@/components/admin/forms/api-error";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { SeoPreview } from "@/components/editor/SeoPreview";
import { FormField } from "@/components/forms/FormField";
import { PanelCard } from "@/components/common/PanelCard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { STORAGE_BUCKETS } from "@/constants";
import { uploadPublicFile } from "@/lib/storage/upload";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
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
  const [plainText, setPlainText] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState(initial?.cover_image_url ?? "");
  const [metaTitle, setMetaTitle] = useState(initial?.meta_title ?? "");
  const [metaDescription, setMetaDescription] = useState(initial?.meta_description ?? "");
  const [isPublished, setIsPublished] = useState(initial?.is_published ?? false);

  const wordCount = useMemo(
    () => (plainText.trim() ? plainText.trim().split(/\s+/).length : 0),
    [plainText]
  );

  const uploadBlogImage = useCallback(async (file: File) => {
    const path = `content/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { publicUrl } = await uploadPublicFile(
      STORAGE_BUCKETS.blogImages,
      file,
      path
    );
    return publicUrl;
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Add a title before saving");
      return;
    }
    if (!content.trim() || content === "<p></p>") {
      toast.error("Add some content to your post");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const file = formData.get("cover_image") as File;
      let nextCoverUrl = coverImageUrl || null;

      if (file?.size) {
        const path = `covers/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const { publicUrl } = await uploadPublicFile(
          STORAGE_BUCKETS.blogImages,
          file,
          path
        );
        nextCoverUrl = publicUrl;
        setCoverImageUrl(publicUrl);
      }

      const payload = {
        title: title.trim(),
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
      <form id={FORM_ID} onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <PanelCard title="Post details">
            <div className="space-y-4">
              <FormField label="Title" htmlFor="title" required>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Your post title"
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
                  placeholder="Short summary shown on the blog listing page"
                />
              </FormField>
            </div>
          </PanelCard>

          <PanelCard title="Content" description="Use the toolbar or type '/' for blocks">
            <RichTextEditor
              content={content}
              onChange={(html, text) => {
                setContent(html);
                if (text !== undefined) setPlainText(text);
              }}
              onImageUpload={async (file) => {
                try {
                  return await uploadBlogImage(file);
                } catch {
                  toast.error("Failed to upload image");
                  throw new Error("upload failed");
                }
              }}
              placeholder="Write your blog post…"
              minHeight={480}
            />
          </PanelCard>

          <PanelCard title="Cover image">
            {coverImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverImageUrl}
                alt="Cover"
                className="mb-4 h-40 w-full rounded-xl border object-cover"
              />
            )}
            <FormField label="Upload cover" htmlFor="cover_image">
              <Input id="cover_image" name="cover_image" type="file" accept="image/*" />
            </FormField>
            <label className="mt-4 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
              Publish immediately
            </label>
          </PanelCard>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <SeoPreview
            title={metaTitle || title}
            metaDescription={metaDescription || excerpt}
            slug={slug}
            wordCount={wordCount}
          />
          <PanelCard title="SEO">
            <div className="space-y-4">
              <FormField label="Meta title" htmlFor="meta_title">
                <Input
                  id="meta_title"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder={title || "Defaults to post title"}
                />
              </FormField>
              <FormField label="Meta description" htmlFor="meta_description">
                <Textarea
                  id="meta_description"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={4}
                  placeholder="Shown in Google search results"
                />
              </FormField>
            </div>
          </PanelCard>
        </aside>
      </form>
    </AdminFormShell>
  );
}
