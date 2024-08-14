import React, { ReactNode } from "react";
import { RadioGroup } from "@radix-ui/themes";

interface Props {
  options: Array<{ label: ReactNode; value: string }>;
  value: any;
  onChange: (val: any) => void;
}

export const ButtonGroup = ({ options, value, onChange }: Props) => (
  <RadioGroup.Root
    value={value}
    onValueChange={onChange}
    className="inline-flex bg-white rounded-md shadow-md items-center flex-row gap-0"
  >
    {options.map((option, index) => (
      <RadioGroup.Item
        key={option.value}
        value={option.value}
        className={`
          px-2 py-2 text-xs font-sm transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          radix-state-unchecked:text-gray-700 radix-state-unchecked:bg-white
          radix-state-checked:bg-blue-600 radix-state-checked:text-white
          hover:bg-blue-100 radix-state-checked:hover:bg-blue-700
          ${index === 0 ? "rounded-l-md" : ""}
          ${index === options.length - 1 ? "rounded-r-md" : ""}
          ${value === option.value ? "bg-blue-200" : ""}
          [&>button]:hidden
          cursor-pointer
        `}
      >
        {option.label}
      </RadioGroup.Item>
    ))}
  </RadioGroup.Root>
);
