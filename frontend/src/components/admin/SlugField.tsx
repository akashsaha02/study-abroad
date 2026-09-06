"use client";

import { Input } from "antd";
import { useEffect, useState } from "react";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface SlugFieldProps {
  title: string;
  value: string;
  onChange: (slug: string) => void;
  disabled?: boolean;
}

export function SlugField({ title, value, onChange, disabled }: SlugFieldProps) {
  const [manual, setManual] = useState(false);

  useEffect(() => {
    if (!manual && title) {
      onChange(slugify(title));
    }
  }, [title, manual, onChange]);

  return (
    <div className="space-y-2">
      <label htmlFor="slug">Slug</label>
      <Input
        id="slug"
        value={value}
        disabled={disabled}
        onChange={(e) => {
          setManual(true);
          onChange(slugify(e.target.value));
        }}
      />
    </div>
  );
}
