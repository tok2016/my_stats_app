'use client';

import { ChangeEvent, HTMLInputTypeAttribute } from 'react';

type InputProps = {
  label?: string;
  id: string;
  placeholder?: string;
  value?: string;
  type?:
    | Extract<
        HTMLInputTypeAttribute,
        'text' | 'password' | 'date' | 'email' | 'search'
      >
    | 'textarea';
  className?: string;
  onChange?: (value: string) => void;
};

export default function Input({
  label,
  id,
  value,
  placeholder,
  type = 'text',
  className,
  onChange
}: InputProps) {
  const onValueChange = (
    evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => onChange?.(evt.target.value);

  return (
    <div className={`input-select-group ${className}`}>
      <label htmlFor={id}>{label}</label>

      {type === 'textarea' ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onValueChange}
        ></textarea>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onValueChange}
        />
      )}
    </div>
  );
}
