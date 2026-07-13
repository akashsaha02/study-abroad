"use client";

import { cn } from "@/lib/utils";
import { Select, type SelectProps } from "antd";

export interface AppSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface AppSelectSingleProps
  extends Omit<SelectProps, "options" | "onChange" | "value" | "mode"> {
  options: AppSelectOption[];
  placeholder?: string;
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  mode?: undefined;
}

interface AppSelectMultiProps
  extends Omit<SelectProps, "options" | "onChange" | "value" | "mode"> {
  options: AppSelectOption[];
  placeholder?: string;
  name?: string;
  value?: string[];
  onChange?: (value: string[]) => void;
  mode: "multiple";
}

export type AppSelectProps = AppSelectSingleProps | AppSelectMultiProps;

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
  mode,
  ...props
}: AppSelectProps) {
  if (mode === "multiple") {
    const multiValue = Array.isArray(value) ? value : [];
    return (
      <>
        {name
          ? multiValue.map((v, i) => (
              <input key={`${name}-${v}-${i}`} type="hidden" name={name} value={v} />
            ))
          : null}
        <Select
          id={id}
          mode="multiple"
          size={size}
          className={cn("w-full", className)}
          placeholder={placeholder}
          options={options}
          optionFilterProp="label"
          showSearch={showSearch ?? options.length > 8}
          value={multiValue}
          onChange={(next) => (onChange as AppSelectMultiProps["onChange"])?.(next ?? [])}
          allowClear={allowClear}
          {...props}
        />
      </>
    );
  }

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
        onChange={(next) => (onChange as AppSelectSingleProps["onChange"])?.(next ?? "")}
        allowClear={allowClear}
        {...props}
      />
    </>
  );
}
