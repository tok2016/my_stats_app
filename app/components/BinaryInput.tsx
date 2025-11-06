'use client';

import { ChangeEvent } from 'react';

import { InputBaseProps } from '@ts/ui/components-props';

import Hint from './Hint';

type SwitchProps = InputBaseProps & {
  type?: 'radio' | 'checkbox';
  name: string;
  isSwitch?: boolean;
  defaultValue?: boolean;
  value?: boolean;
  onChange?: (value: boolean) => void;
};

export default function BinaryInput({
  label,
  id,
  name,
  type = 'radio',
  isSwitch,
  className = '',
  defaultValue,
  value,
  errorHint,
  hint,
  onChange
}: SwitchProps) {
  const onSwitch = (evt: ChangeEvent<HTMLInputElement>) => {
    onChange?.(evt.target.checked);
  };

  return (
    <div className={`input-select-group ${className}`}>
      <div className='input-binary-group'>
        <input
          id={id}
          name={name}
          type={type}
          defaultChecked={defaultValue}
          checked={value}
          className={isSwitch ? 'switch' : ''}
          onChange={onSwitch}
        />
        <label htmlFor={id}>{label}</label>
      </div>

      <Hint variant='error'>{errorHint}</Hint>
      <Hint>{hint}</Hint>
    </div>
  );
}
