import { BrandLoader } from "@/components/common/BrandLoader";
import { getTranslations } from "next-intl/server";

export default async function Loading() {
  const t = await getTranslations("common");

  return <BrandLoader fullScreen label={t("loading")} />;
}
