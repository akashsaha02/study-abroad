"use client";

import { ieltsApi } from "@/features/ielts/api";
import { useRouter } from "@/i18n/navigation";
import { App, Button } from "antd";
import { useState } from "react";

export function StartTestButton({ testId }: { testId: string }) {
  const router = useRouter();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  return (
    <Button
      type="primary"
      loading={loading}
      onClick={async () => {
        setLoading(true);
        try {
          const data = (await ieltsApi.startTest(testId)) as { attempt: { id: string } };
          router.push(`/dashboard/ielts/attempts/${data.attempt.id}`);
        } catch (err) {
          message.error(err instanceof Error ? err.message : "Could not start");
        } finally {
          setLoading(false);
        }
      }}
    >
      Start test
    </Button>
  );
}
