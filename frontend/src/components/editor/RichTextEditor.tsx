"use client";

import { cn } from "@/lib/utils";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Heading01Icon,
  ImageAdd02Icon,
  LeftToRightListBulletIcon,
  Link01Icon,
  ListViewIcon,
  QuoteDownIcon,
  TextBoldIcon,
  TextItalicIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { useCallback, useEffect, useRef, useState } from "react";

export interface RichTextEditorProps {
  content: string;
  onChange: (html: string, text?: string) => void;
  placeholder?: string;
  minHeight?: number;
  /** Upload images to storage and return a public URL. Falls back to base64 when omitted. */
  onImageUpload?: (file: File) => Promise<string>;
  className?: string;
}

interface SlashCommand {
  title: string;
  hint: string;
  icon: IconSvgElement;
  run: (editor: Editor) => void;
}

const SLASH_COMMANDS: SlashCommand[] = [
  {
    title: "Heading 1",
    hint: "Large section title",
    icon: Heading01Icon,
    run: (e) => e.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    title: "Heading 2",
    hint: "Medium section title",
    icon: Heading01Icon,
    run: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    title: "Bullet list",
    hint: "Simple bulleted list",
    icon: ListViewIcon,
    run: (e) => e.chain().focus().toggleBulletList().run(),
  },
  {
    title: "Numbered list",
    hint: "Ordered list",
    icon: LeftToRightListBulletIcon,
    run: (e) => e.chain().focus().toggleOrderedList().run(),
  },
  {
    title: "Quote",
    hint: "Capture a quotation",
    icon: QuoteDownIcon,
    run: (e) => e.chain().focus().toggleBlockquote().run(),
  },
];

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing… press '/' for blocks",
  minHeight = 420,
  onImageUpload,
  className,
}: RichTextEditorProps) {
  const [slash, setSlash] = useState<{
    open: boolean;
    x: number;
    y: number;
    query: string;
  }>({ open: false, x: 0, y: 0, query: "" });
  const [activeIndex, setActiveIndex] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);

  const filtered = SLASH_COMMANDS.filter((c) =>
    c.title.toLowerCase().includes(slash.query.toLowerCase())
  );
  const menuCommands = filtered.length ? filtered : SLASH_COMMANDS;
  const clampedActive = Math.min(activeIndex, menuCommands.length - 1);

  const bridge = useRef<{
    open: boolean;
    commands: SlashCommand[];
    activeIndex: number;
    onChange: RichTextEditorProps["onChange"];
    detectSlash: (ed: Editor) => void;
    runSlashCommand: (cmd: SlashCommand) => void;
    closeSlash: () => void;
  }>({
    open: false,
    commands: SLASH_COMMANDS,
    activeIndex: 0,
    onChange,
    detectSlash: () => {},
    runSlashCommand: () => {},
    closeSlash: () => {},
  });

  const closeSlash = useCallback(() => {
    setSlash((s) => ({ ...s, open: false, query: "" }));
    setActiveIndex(0);
  }, []);

  const detectSlash = useCallback((ed: Editor) => {
    const { selection } = ed.state;
    if (!selection.empty) {
      setSlash((s) => (s.open ? { ...s, open: false } : s));
      return;
    }
    const { $from } = selection;
    const text = $from.parent.textContent;
    if ($from.parent.type.name === "paragraph" && text.startsWith("/")) {
      const coords = ed.view.coordsAtPos($from.pos);
      setActiveIndex(0);
      setSlash({
        open: true,
        x: coords.left,
        y: coords.bottom + 6,
        query: text.slice(1),
      });
    } else {
      setSlash((s) => (s.open ? { ...s, open: false } : s));
    }
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-primary underline underline-offset-2" },
      }),
      Image.configure({ inline: false, allowBase64: !onImageUpload }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "prose-editor max-w-none px-6 py-5 outline-none",
        style: `min-height: ${minHeight}px`,
      },
      handleKeyDown: (_view, event) => {
        const st = bridge.current;
        if (!st.open) return false;
        const list = st.commands;
        if (event.key === "ArrowDown") {
          setActiveIndex((i) => (i + 1) % list.length);
          return true;
        }
        if (event.key === "ArrowUp") {
          setActiveIndex((i) => (i - 1 + list.length) % list.length);
          return true;
        }
        if (event.key === "Enter") {
          const cmd = list[st.activeIndex];
          if (cmd) {
            st.runSlashCommand(cmd);
            return true;
          }
        }
        if (event.key === "Escape") {
          st.closeSlash();
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor: ed }) => {
      bridge.current.onChange(ed.getHTML(), ed.getText());
      bridge.current.detectSlash(ed);
    },
    onSelectionUpdate: ({ editor: ed }) => bridge.current.detectSlash(ed),
  });

  const runSlashCommand = useCallback(
    (cmd: SlashCommand) => {
      if (!editor) return;
      const { $from } = editor.state.selection;
      editor
        .chain()
        .focus()
        .deleteRange({ from: $from.start(), to: $from.pos })
        .run();
      cmd.run(editor);
      closeSlash();
    },
    [editor, closeSlash]
  );

  const insertImage = useCallback(() => {
    if (!editor) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      setUploadingImage(true);
      try {
        let src: string;
        if (onImageUpload) {
          src = await onImageUpload(file);
        } else {
          src = await readFileAsDataUrl(file);
        }
        editor.chain().focus().setImage({ src, alt: file.name }).run();
      } catch {
        // Caller should toast; keep editor usable.
      } finally {
        setUploadingImage(false);
      }
    };
    input.click();
  }, [editor, onImageUpload]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previousUrl ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  useEffect(() => {
    bridge.current = {
      open: slash.open,
      commands: menuCommands,
      activeIndex: clampedActive,
      onChange,
      detectSlash,
      runSlashCommand,
      closeSlash,
    };
  });

  // Sync external content when editing an existing post.
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (content !== current && content !== normalizeHtml(current)) {
      editor.commands.setContent(content || "", { emitUpdate: false });
    }
  }, [content, editor]);

  useEffect(() => {
    return () => editor?.destroy();
  }, [editor]);

  if (!editor) {
    return (
      <div
        className={cn(
          "animate-pulse rounded-2xl border bg-muted/30 ring-1 ring-foreground/5",
          className
        )}
        style={{ minHeight }}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-card ring-1 ring-foreground/5",
        className
      )}
    >
      <Toolbar
        editor={editor}
        onInsertImage={insertImage}
        onSetLink={setLink}
        uploadingImage={uploadingImage}
      />
      <EditorContent editor={editor} />

      {slash.open && (
        <SlashMenu
          x={slash.x}
          y={slash.y}
          commands={menuCommands}
          activeIndex={clampedActive}
          onSelect={runSlashCommand}
          onHover={setActiveIndex}
        />
      )}
    </div>
  );
}

function normalizeHtml(html: string): string {
  return html === "<p></p>" ? "" : html;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function Toolbar({
  editor,
  onInsertImage,
  onSetLink,
  uploadingImage,
}: {
  editor: Editor;
  onInsertImage: () => void;
  onSetLink: () => void;
  uploadingImage: boolean;
}) {
  return (
    <div className="sticky top-0 z-20 flex flex-wrap items-center gap-1 border-b bg-card/95 p-2 backdrop-blur supports-backdrop-filter:bg-card/70">
      <ToolbarButton
        icon={TextBoldIcon}
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        icon={TextItalicIcon}
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        icon={Link01Icon}
        label="Link"
        active={editor.isActive("link")}
        onClick={onSetLink}
      />
      <Divider />
      <ToolbarButton
        icon={Heading01Icon}
        label="Heading 1"
        active={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      />
      <ToolbarButton
        icon={Heading01Icon}
        label="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        small
      />
      <Divider />
      <ToolbarButton
        icon={ListViewIcon}
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        icon={LeftToRightListBulletIcon}
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <ToolbarButton
        icon={QuoteDownIcon}
        label="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />
      <Divider />
      <ToolbarButton
        icon={ImageAdd02Icon}
        label={uploadingImage ? "Uploading…" : "Insert image"}
        active={false}
        onClick={onInsertImage}
        disabled={uploadingImage}
      />
    </div>
  );
}

function ToolbarButton({
  icon,
  label,
  active,
  onClick,
  small,
  disabled,
}: {
  icon: IconSvgElement;
  label: string;
  active: boolean;
  onClick: () => void;
  small?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      className={cn(
        "flex size-8 items-center justify-center rounded-lg transition-colors disabled:opacity-50",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <HugeiconsIcon icon={icon} className={small ? "size-3.5" : "size-4"} />
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-border" />;
}

function SlashMenu({
  x,
  y,
  commands,
  activeIndex,
  onSelect,
  onHover,
}: {
  x: number;
  y: number;
  commands: SlashCommand[];
  activeIndex: number;
  onSelect: (cmd: SlashCommand) => void;
  onHover: (index: number) => void;
}) {
  return (
    <div
      className="fixed z-50 w-64 origin-top overflow-hidden rounded-xl border bg-popover p-1.5 shadow-lg"
      style={{ left: x, top: y }}
    >
      <p className="px-2 py-1 text-xs font-medium text-muted-foreground">
        Basic blocks
      </p>
      {commands.map((cmd, i) => (
        <button
          key={cmd.title}
          type="button"
          onMouseEnter={() => onHover(i)}
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(cmd);
          }}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors",
            i === activeIndex ? "bg-muted" : "hover:bg-muted/60"
          )}
        >
          <span className="flex size-8 items-center justify-center rounded-md border bg-background text-foreground">
            <HugeiconsIcon icon={cmd.icon} className="size-4" />
          </span>
          <span>
            <span className="block text-sm font-medium">{cmd.title}</span>
            <span className="block text-xs text-muted-foreground">{cmd.hint}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
