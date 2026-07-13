"use client";

import { AppSelect, type AppSelectOption } from "@/components/common/AppSelect";
import { countryOptionLabel } from "@/lib/countries/flags";
import { useMemo } from "react";

export interface CountryOption {
  id: string;
  name: string;
  slug?: string;
}

interface CountrySelectBaseProps {
  countries: CountryOption[];
  placeholder?: string;
  id?: string;
  size?: "small" | "middle" | "large";
  disabled?: boolean;
}

interface SingleCountrySelectProps extends CountrySelectBaseProps {
  multiple?: false;
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
}

interface MultiCountrySelectProps extends CountrySelectBaseProps {
  multiple: true;
  value?: string[];
  onChange?: (value: string[]) => void;
  name?: string;
}

export type CountrySelectProps = SingleCountrySelectProps | MultiCountrySelectProps;

function buildOptions(countries: CountryOption[]): AppSelectOption[] {
  return countries.map((c) => ({
    value: c.id,
    label: countryOptionLabel(c.name, c.slug),
  }));
}

export function CountrySelect(props: CountrySelectProps) {
  const { countries, placeholder = "Select country…", id, size, disabled } = props;
  const options = useMemo(() => buildOptions(countries), [countries]);

  if (props.multiple) {
    return (
      <AppSelect
        id={id}
        mode="multiple"
        options={options}
        placeholder={placeholder}
        value={props.value ?? []}
        onChange={props.onChange}
        name={props.name}
        size={size}
        disabled={disabled}
      />
    );
  }

  return (
    <AppSelect
      id={id}
      options={options}
      placeholder={placeholder}
      value={props.value ?? ""}
      onChange={props.onChange}
      name={props.name}
      size={size}
      disabled={disabled}
    />
  );
}
