'use client';

import { ChangeEvent } from 'react';

import { InputBaseProps } from '@ts/ui/components-props';

type SwitchProps = InputBaseProps & {
  type?: 'radio' | 'checkbox';
  name: string;
  isSwitch?: boolean;
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
  value,
  onChange
}: SwitchProps) {
  const onSwitch = (evt: ChangeEvent<HTMLInputElement>) => {
    onChange?.(evt.target.checked);
  };

  return (
    <div className={`input-binary-group ${className}`}>
      <input
        id={id}
        name={name}
        type={type}
        checked={value}
        className={isSwitch ? 'switch' : ''}
        onChange={onSwitch}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}
