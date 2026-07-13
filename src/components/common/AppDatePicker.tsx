"use client";

import { cn } from "@/lib/utils";
import { DatePicker, type DatePickerProps } from "antd";
import dayjs, { type Dayjs } from "dayjs";

export interface AppDatePickerProps
  extends Omit<DatePickerProps, "value" | "onChange"> {
  /** ISO date string (YYYY-MM-DD) or datetime-local fragment */
  value?: string;
  onChange?: (value: string) => void;
  /** Syncs value into a hidden input for native form submission */
  name?: string;
  /** When true, value/onChange use datetime-local format */
  showTime?: boolean;
}

function parseValue(value?: string, withTime?: boolean): Dayjs | null {
  if (!value) return null;
  const parsed = withTime ? dayjs(value) : dayjs(value, "YYYY-MM-DD");
  return parsed.isValid() ? parsed : null;
}

function formatValue(date: Dayjs | null, withTime?: boolean): string {
  if (!date) return "";
  return withTime ? date.format("YYYY-MM-DDTHH:mm") : date.format("YYYY-MM-DD");
}

export function AppDatePicker({
  value,
  onChange,
  name,
  className,
  showTime,
  size = "large",
  ...props
}: AppDatePickerProps) {
  const pickerValue = parseValue(value, showTime);

  return (
    <>
      {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}
      <DatePicker
        className={cn("w-full", className)}
        size={size}
        value={pickerValue}
        showTime={showTime ? { format: "HH:mm" } : false}
        format={showTime ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD"}
        onChange={(date) => {
          const value = Array.isArray(date) ? date[0] ?? null : date;
          onChange?.(formatValue(value, showTime));
        }}
        {...props}
      />
    </>
  );
}
