export function SiteBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-mesh opacity-80" />
      <div
        className="bg-blob-primary absolute -left-32 top-1/4 size-[28rem] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--primary) 40%, transparent), transparent 70%)",
        }}
      />
      <div
        className="bg-blob-success absolute -right-24 bottom-1/4 size-[24rem] rounded-full opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--success) 35%, transparent), transparent 70%)",
        }}
      />
      <div className="site-texture-mask absolute inset-0 bg-dot-6-s-1-foreground/5" />
      <div className="site-texture-mask absolute inset-0 bg-grid-12-s-1-foreground/4" />
    </div>
  );
}
