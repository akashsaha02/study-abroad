import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export type AdminFormVariant = "page" | "modal";

export interface AdminFormBaseProps {
  variant?: AdminFormVariant;
  onSuccess?: () => void;
  onClose?: () => void;
  onSavingChange?: (saving: boolean) => void;
}

type RouterLike = Pick<AppRouterInstance, "push" | "refresh">;

export function finishAdminSave(
  router: RouterLike,
  options: {
    variant?: AdminFormVariant;
    onSuccess?: () => void;
    onClose?: () => void;
    backHref: string;
  }
) {
  if (options.variant === "modal") {
    options.onSuccess?.();
    options.onClose?.();
    router.refresh();
    return;
  }
  router.push(options.backHref);
  router.refresh();
}
