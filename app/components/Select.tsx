'use client';

import { useReducer, useState } from 'react';

import { InputVariant, Module } from '@ts/ui/components-variants';

type Option = {
  value: string;
  label: string;
};

type SelectProps = {
  label?: string;
  name: string;
  module: Module;
  options: Option[];
  values: string[];
  variant: InputVariant;
  className?: string;
  onSelect?: (value: string) => void;
};

export default function Select({
  label,
  name,
  options,
  variant,
  className,
  onSelect
}: SelectProps) {
  const [value, setValue] = useState<string>('');
  const [expanded, expand] = useReducer((prev) => !prev, false);

  const onOptionClick = (value: string) => {
    setValue(value);
    if (onSelect) {
      onSelect(value);
    }
  };

  return (
    <div className={className}>
      <label htmlFor={name}>{label}</label>
      <select
        name={name}
        value={value}
        className={`${variant} ${module} ${expanded ? 'expanded' : ''}`}
        onClick={expand}
      >
        {options.map((option) => (
          <option
            selected={option.value === value}
            disabled
            hidden
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      <ul className={`options ${expanded ? 'expanded' : ''}`}>
        {options.map((option) => (
          <li
            key={option.value}
            className={`option ${option.value === value ? 'selected' : ''}`}
            onClick={() => onOptionClick(option.value)}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
