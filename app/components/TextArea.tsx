'use client';

import {
  ChangeEvent,
  DetailedHTMLProps,
  TextareaHTMLAttributes,
  useRef
} from 'react';

import { InputExpandedProps } from '@ts/ui/components-props';

import Hint from './Hint';

type TextAreaProps = Omit<
  DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >,
  'defaultValue' | 'value' | 'onChange'
>
  & InputExpandedProps & {
    autoHeight?: boolean;
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
  };

const TEXTAREA_ADDITION = 10;

export default function TextArea({
  label,
  id,
  className = '',
  autoHeight = false,
  hint,
  errorHint,
  required,
  onChange,
  ...props
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
    <div className={`input-group ${className}`}>
      <label htmlFor={id} hidden={!label} className='input-group__label'>
        {label}
        {required && <span className='colored'>*</span>}
      </label>

      <textarea
        {...props}
        required={false}
        ref={ref}
        id={id}
        className={`input-group__textarea ${autoHeight ? 'input-group__textarea--auto-height' : ''}`}
        onChange={onValueChange}
      ></textarea>

      <Hint variant='error'>{errorHint}</Hint>
      <Hint>{hint}</Hint>
    </div>
  );
}
