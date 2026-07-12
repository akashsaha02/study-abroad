export function SiteBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      <div className="absolute inset-0 bg-mesh opacity-80" />
      <div className="site-texture-mask absolute inset-0 bg-dot-6-s-1-foreground/5" />
      <div className="site-texture-mask absolute inset-0 bg-grid-12-s-1-foreground/4" />
    </div>
  );
}
