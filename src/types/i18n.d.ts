import type bn from "@/messages/bn.json";

declare global {
  type IntlMessages = typeof bn;
}

declare module "next-intl" {
  interface AppConfig {
    Messages: typeof bn;
  }
}
