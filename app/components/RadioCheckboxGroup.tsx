'use client';

import { InputBaseProps, Option } from '@ts/ui/components-props';

import BinaryInput from './BinaryInput';

type RadioGroupProps = Omit<InputBaseProps, 'id'> & {
  type?: 'radio' | 'checkbox';
  name: string;
  options: Option[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
};

export default function RadioCheckboxGroup({
  label,
  name,
  type = 'radio',
  className = '',
  options,
  value,
  onChange
}: RadioGroupProps) {
  const onCheck = (id: string) =>
    typeof value === 'undefined'
      ? undefined
      : (checked: boolean) => {
          if (value && typeof value !== 'string') {
            onChange?.(
              checked ? [...value, id] : value.filter((val) => val !== id)
            );
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
            value={value ? value === option.value : undefined}
            onChange={onCheck(option.value)}
          />
        ))}
      </div>
    </div>
  );
}
