import { AntdProvider } from "@/components/providers/AntdProvider";
import { LocaleAttributes } from "@/components/providers/LocaleAttributes";
import { SiteBackground } from "@/components/common/SiteBackground";
import { routing, type Locale } from "@/i18n/routing";
import { hasLocale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

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
    <>
      <SiteBackground />
      <NextIntlClientProvider key={locale} messages={messages}>
        <LocaleAttributes locale={locale} />
        <AntdProvider locale={locale as Locale}>{children}</AntdProvider>
      </NextIntlClientProvider>
    </>
  );
}
