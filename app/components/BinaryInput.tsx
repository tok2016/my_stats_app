'use client';

import type {
  ChangeEvent,
  DetailedHTMLProps,
  InputHTMLAttributes
} from 'react';

import { InputExpandedProps } from '@ts/ui/components-props';

import Hint from './Hint';

type SwitchProps = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'onChange' | 'value' | 'type' | 'defaultValue'
>
  & InputExpandedProps & {
    type?: 'radio' | 'checkbox';
    isSwitch?: boolean;
    onChange?: (value: boolean) => void;
  };

export default function BinaryInput({
  label,
  id,
  type = 'radio',
  isSwitch,
  className = '',
  errorHint,
  hint,
  required,
  onChange,
  ...props
}: SwitchProps) {
  const onSwitch = (evt: ChangeEvent<HTMLInputElement>) => {
    onChange?.(evt.target.checked);
  };

  return (
    <div className={`input-group ${className}`}>
      <div className='input-group__binary'>
        <input
          {...props}
          required={false}
          type={type}
          className={`input-group__binary__input ${isSwitch ? 'switch' : ''}`}
          onChange={onSwitch}
        />

        <label
          hidden={!label}
          htmlFor={id}
          className='input-group__binary__label'
        >
          {label} {required && <span className='colored'>*</span>}
        </label>
      </div>

      <Hint variant='error'>{errorHint}</Hint>
      <Hint>{hint}</Hint>
    </div>
  );
}
