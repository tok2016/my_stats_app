'use client';

import { ChangeEvent, HTMLInputTypeAttribute } from 'react';

import { InputTheme } from '@ts/ui/components-variants';

type InputProps = {
  label?: string;
  id: string;
  placeholder?: string;
  value?: string;
  theme?: InputTheme;
  type?: Extract<
    HTMLInputTypeAttribute,
    'text' | 'password' | 'date' | 'email' | 'search'
  >;
  className?: string;
  onChange?: (value: string) => void;
};

export default function Input({
  label,
  id,
  value,
  placeholder,
  theme = 'light',
  type = 'text',
  className,
  onChange
}: InputProps) {
  const onValueChange = (evt: ChangeEvent<HTMLInputElement>) =>
    onChange?.(evt.target.value);

  return (
    <div className={`input-select-group ${className}`}>
      <label htmlFor={id} className={theme}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        className={theme}
        onChange={onValueChange}
      />
    </div>
  );
}
