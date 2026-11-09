"use client";

import { Label, ListBox, Select } from "@heroui/react";

interface ProfileSelectProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange?: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
}

export function ProfileSelect({
  label,
  value,
  options,
  onChange,
  placeholder = "Select an option",
  isDisabled = false,
}: ProfileSelectProps) {
  return (
    <Select.Root
      selectedKey={value || null}
      isDisabled={isDisabled}
      placeholder={placeholder}
      onSelectionChange={(key) => onChange?.(String(key ?? ""))}
      fullWidth
    >
      <Label>{label}</Label>
      <Select.Trigger className="rounded-lg border border-zinc-300 px-3 py-2">
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {options.map((option) => (
            <ListBox.Item key={option.value} id={option.value}>{option.label}</ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select.Root>
  );
}
