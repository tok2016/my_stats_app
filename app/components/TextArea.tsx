'use client';

import { ChangeEvent, useRef } from 'react';

import { TextInputProps } from '@ts/ui/components-props';

type TextAreaProps = TextInputProps & {
  autoHeight?: boolean;
};

const TEXTAREA_ADDITION = 10;

export default function TextArea({
  label,
  id,
  value,
  placeholder,
  className,
  autoHeight = false,
  onChange
}: TextAreaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const onValueChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(evt.target.value);
    if (ref.current && autoHeight) {
      if (!evt.target.value) {
        ref.current.style.height = '40px';
      } else if (ref.current.clientHeight !== ref.current.scrollHeight) {
        ref.current.style.height = `${ref.current.scrollHeight + TEXTAREA_ADDITION}px`;
      } else {
        ref.current.style.height = `${ref.current.scrollHeight}px`;
      }
    }
  };

  return (
    <div className={`input-select-group ${className}`}>
      <label htmlFor={id}>{label}</label>

      <textarea
        ref={ref}
        id={id}
        placeholder={placeholder}
        value={value}
        className={autoHeight ? 'autoHeight' : ''}
        onChange={onValueChange}
      ></textarea>
    </div>
  );
}
