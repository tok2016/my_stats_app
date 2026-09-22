'use client';

import { FormEvent } from 'react';

import { InputBaseProps, Option } from '@ts/ui/components-props';

import BinaryInput from './BinaryInput';
import Hint from './Hint';

type RadioGroupProps = Omit<InputBaseProps, 'id'> & {
  type?: 'radio' | 'checkbox';
  options: Option[];
  defaultValue?: string | string[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  onInput?: (evt: FormEvent<HTMLInputElement>) => void;
};

const isChecked = (current: string | string[] | undefined, value: string) =>
  typeof current === 'undefined' ? undefined : current.includes(value);

export default function RadioCheckboxGroup({
  label,
  name,
  type = 'radio',
  className = '',
  options,
  defaultValue,
  value,
  hint,
  errorHint,
  onChange,
  onInput
}: RadioGroupProps) {
  const onCheck = (id: string) => (checked: boolean) => {
    if (value && typeof value !== 'string') {
      onChange?.(checked ? [...value, id] : value.filter((val) => val !== id));
    } else {
      onChange?.(id);
    }
  };

  return (
    <div className={`input-select-group ${className}`}>
      <label>{label}</label>

      <div className='radio-checkbox-group'>
        {options.map((option) => (
          <BinaryInput
            key={option.value}
            type={type}
            id={option.value}
            name={name}
            label={option.label}
            defaultValue={isChecked(defaultValue, option.value)}
            value={isChecked(value, option.value)}
            onChange={onCheck(option.value)}
            onInput={onInput}
          />
        ))}
      </div>

      <Hint variant='error'>{errorHint}</Hint>
      <Hint>{hint}</Hint>
    </div>
  );
}
