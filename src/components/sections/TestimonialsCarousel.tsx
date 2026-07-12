"use client";

import type { Testimonial } from "@/types";
import { QuoteUpIcon, StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Avatar, Button, Tag } from "antd";
import Image from "next/image";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

function initials(name?: string) {
  if (!name) return "S";
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function TestimonialCard({ t }: { t: Testimonial }) {
  const university =
    (t as { universities?: { name?: string } }).universities?.name ??
    t.university_name ??
    "University";
  const country =
    (t as { countries?: { name?: string } }).countries?.name ??
    t.destination_country ??
    "Abroad";

  return (
    <figure
      className={cn(
        "flex w-[min(100%,320px)] shrink-0 snap-start flex-col rounded-2xl border bg-card p-6 ring-1 ring-foreground/5",
        "transition-shadow duration-200 hover:shadow-lg"
      )}
    >
      <HugeiconsIcon icon={QuoteUpIcon} className="size-7 text-primary/25" />
      <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground/90">
        {t.quote}
      </blockquote>
      <div className="mt-5 flex items-center gap-3 border-t pt-4">
        {t.image_url ? (
          <Image
            src={t.image_url}
            alt={t.student_name ?? "Student"}
            width={40}
            height={40}
            className="size-10 rounded-full object-cover"
          />
        ) : (
          <Avatar size={40} className="bg-primary/10 font-semibold text-primary">
            {initials(t.student_name)}
          </Avatar>
        )}
        <figcaption className="min-w-0">
          <p className="truncate text-sm font-semibold">{t.student_name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {university} · {country}
          </p>
        </figcaption>
        <Tag className="ml-auto gap-1">
          <HugeiconsIcon icon={StarIcon} className="size-3 text-amber-500" />
          {t.rating ?? 5}.0
        </Tag>
      </div>
    </figure>
  );
}

export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollBy(direction: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === "left" ? -340 : 340;
    el.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div className="mb-4 hidden justify-end gap-2 md:flex">
        <Button size="small" onClick={() => scrollBy("left")} aria-label="Scroll left">
          ←
        </Button>
        <Button size="small" onClick={() => scrollBy("right")} aria-label="Scroll right">
          →
        </Button>
      </div>
      <div
        ref={scrollRef}
        className="scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2"
      >
        {testimonials.map((t) => (
          <TestimonialCard key={t.id} t={t} />
        ))}
      </div>
    </div>
  );
}
