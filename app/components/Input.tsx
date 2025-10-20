'use client';

import { ChangeEvent, HTMLInputTypeAttribute } from 'react';

import { TextInputProps } from '@ts/ui/components-props';

type InputProps = TextInputProps & {
  type?: Extract<
    HTMLInputTypeAttribute,
    'text' | 'password' | 'date' | 'email'
  >;
};

export default function Input({
  label,
  id,
  value,
  placeholder,
  type = 'text',
  className = '',
  onChange
}: InputProps) {
  const onValueChange = (
    evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => onChange?.(evt.target.value);

  return (
    <div className={`input-select-group ${className}`}>
      <label hidden={!label} htmlFor={id}>
        {label}
      </label>

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onValueChange}
      />
    </div>
  );
}
