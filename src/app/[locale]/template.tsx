export default function LocaleTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="animate-fade-in-up motion-reduce:animate-none">
      {children}
    </div>
  );
}
