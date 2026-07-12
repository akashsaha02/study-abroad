"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App, ConfigProvider } from "antd";
import bnBD from "antd/locale/bn_BD";
import enUS from "antd/locale/en_US";
import type { Locale } from "@/i18n/routing";

const antdLocales = { bn: bnBD, en: enUS } as const;

export function AntdProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <AntdRegistry>
      <ConfigProvider
        locale={antdLocales[locale]}
        theme={{
          token: {
            fontFamily: "var(--font-sans), sans-serif",
            colorPrimary: "#3b5bdb",
            borderRadius: 10,
            controlHeight: 40,
            controlHeightLG: 44,
            controlHeightSM: 32,
          },
          components: {
            Select: {
              controlHeight: 40,
              controlHeightLG: 44,
              controlHeightSM: 32,
            },
            Input: {
              controlHeight: 40,
              controlHeightLG: 44,
            },
          },
        }}
      >
        <App>{children}</App>
      </ConfigProvider>
    </AntdRegistry>
  );
}
