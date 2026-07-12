import { AntdProvider } from "@/components/providers/AntdProvider";
import { SiteBackground } from "@/components/common/SiteBackground";
import { routing, type Locale } from "@/i18n/routing";
import { Hind_Siliguri, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { hasLocale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans-en",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["latin", "bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans-bn",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`h-full antialiased font-sans ${plusJakarta.variable} ${hindSiliguri.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <SiteBackground />
        <NextIntlClientProvider key={locale} messages={messages}>
          <AntdProvider locale={locale as Locale}>{children}</AntdProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
