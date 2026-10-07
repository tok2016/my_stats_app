'use client';

import { InputBaseProps, Option } from '@ts/ui/components-props';

import BinaryInput from './BinaryInput';
import Hint from './Hint';

type RadioCheckboxGroupType = 'radio' | 'checkbox' | undefined;

type ValueType<InputType extends RadioCheckboxGroupType> =
  InputType extends 'checkbox' ? string[] : string;

type RadioGroupProps<InputType extends RadioCheckboxGroupType> = Omit<
  InputBaseProps,
  'id'
> & {
  type?: InputType;
  options: Option[];
  required?: boolean;
  defaultValue?: ValueType<InputType>;
  value?: ValueType<InputType>;
  onChange?: <FuncInputType extends RadioCheckboxGroupType>(
    value: ValueType<FuncInputType>
  ) => void;
};

const isChecked = (current: string | string[] | undefined, value: string) =>
  typeof current === 'undefined' ? undefined : current.includes(value);

export default function RadioCheckboxGroup<
  InputType extends 'radio' | 'checkbox' | undefined
>({
  label,
  name,
  type = 'radio',
  className = '',
  options,
  defaultValue,
  value,
  hint,
  errorHint,
  required,
  onChange
}: RadioGroupProps<InputType>) {
  const onCheck = (id: string) =>
    typeof value === 'undefined'
      ? undefined
      : (checked: boolean) => {
          if (value && onChange && typeof value !== 'string') {
            onChange<'checkbox'>(
              checked ? [...value, id] : value.filter((val) => val !== id)
            );
          } else {
            onChange?.(id);
          }
        };

  return (
    <div className={`input-group ${className}`}>
      <label className='input-group__label' hidden={!label}>
        {label} {required && <span className='colored'>*</span>}
      </label>

      <div className='input-group__radio-checkbox'>
        {options.map((option) => (
          <BinaryInput
            key={option.value}
            type={type}
            id={option.value}
            name={name}
            label={option.label}
            defaultChecked={isChecked(defaultValue, option.value)}
            checked={isChecked(value, option.value)}
            onChange={onCheck(option.value)}
          />
        ))}
      </div>

      <Hint variant='error'>{errorHint}</Hint>
      <Hint>{hint}</Hint>
    </div>
  );
}
