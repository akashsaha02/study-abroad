"use client";

import { Button } from "antd";
import { cn } from "@/lib/utils";

interface SubmitButtonProps
  extends React.ComponentProps<typeof Button> {
  loading?: boolean;
  loadingText?: string;
}

export function SubmitButton({
  loading,
  loadingText = "Please wait...",
  children,
  disabled,
  className,
  type = "primary",
  htmlType = "submit",
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      type={type}
      htmlType={htmlType}
      loading={loading}
      disabled={disabled || loading}
      className={cn(className)}
      {...props}
    >
      {loading ? loadingText : children}
    </Button>
  );
}
