"use client";

import { cn } from "@/lib/utils";
import { Select, type SelectProps } from "antd";

export interface AppSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface AppSelectProps
  extends Omit<SelectProps, "options" | "onChange" | "value"> {
  options: AppSelectOption[];
  placeholder?: string;
  /** Syncs value into a hidden input for native form submission. */
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function AppSelect({
  options,
  placeholder = "Select…",
  className,
  name,
  value,
  onChange,
  showSearch,
  allowClear = true,
  id,
  size = "large",
  ...props
}: AppSelectProps) {
  const selectValue = value === "" || value === undefined ? undefined : value;

  return (
    <>
      {name ? <input type="hidden" name={name} value={selectValue ?? ""} /> : null}
      <Select
        id={id}
        size={size}
        className={cn("w-full", className)}
        placeholder={placeholder}
        options={options}
        optionFilterProp="label"
        showSearch={showSearch ?? options.length > 8}
        value={selectValue}
        onChange={(next) => onChange?.(next ?? "")}
        allowClear={allowClear}
        {...props}
      />
    </>
  );
}
