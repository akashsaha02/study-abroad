"use client";

import { ROUTES } from "@/constants";
import { useRouter } from "@/i18n/navigation";
import {
  Calculator01Icon,
  Calendar01Icon,
  Message01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { FloatButton } from "antd";
import { useEffect, useState } from "react";

/**
 * Public-site quick actions using Ant Design FloatButton.
 * @see https://ant.design/components/float-button
 */
export function FloatingActionMenu() {
  const router = useRouter();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let prev = 0;
    function onScroll() {
      const y = window.scrollY;
      setVisible(y < 80 || y < prev);
      prev = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <FloatButton.Group
      trigger="click"
      type="primary"
      style={{ insetInlineEnd: 24, bottom: 24 }}
      icon={<HugeiconsIcon icon={Calculator01Icon} className="size-4" />}
      tooltip="Quick actions"
    >
      <FloatButton
        icon={<HugeiconsIcon icon={Calculator01Icon} className="size-4" />}
        tooltip="Eligibility"
        onClick={() => router.push(ROUTES.eligibilityChecker)}
      />
      <FloatButton
        icon={<HugeiconsIcon icon={Calendar01Icon} className="size-4" />}
        tooltip="Consultation"
        onClick={() => router.push(ROUTES.bookConsultation)}
      />
      <FloatButton
        icon={<HugeiconsIcon icon={Message01Icon} className="size-4" />}
        tooltip="Contact"
        onClick={() => router.push(ROUTES.contact)}
      />
    </FloatButton.Group>
  );
}
