"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface CoverImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  imageClassName?: string;
  fallback?: React.ReactNode;
  sizes?: string;
  priority?: boolean;
}

export function CoverImage({
  src,
  alt,
  className,
  imageClassName,
  fallback,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
}: CoverImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={cn("flex items-center justify-center bg-muted/60", className)}>
        {fallback}
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-muted/40", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", imageClassName)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
