'use client';

import { ChevronDown, ChevronUp } from '@mynaui/icons-react';
import { type ChangeEvent, useRef } from 'react';

import { InputBaseProps } from '@ts/ui/components-props';

import Hint from './Hint';

type NumberInputProps = InputBaseProps & {
  required?: boolean;
  value?: number;
  defaultValue?: number;
  onChange?: (value?: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: number;
};

export default function NumberInput({
  id,
  name,
  label,
  value,
  defaultValue,
  min,
  max,
  step = 1,
  className = '',
  hint,
  errorHint,
  disabled,
  required,
  placeholder,
  onBlur,
  onFocus,
  onChange
}: NumberInputProps) {
  const ref = useRef<HTMLInputElement>(null);

  const onValueChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const parsedValue = Number(evt.target.value);
    onChange?.(Number.isNaN(parsedValue) ? undefined : parsedValue);
  };

  const onIncrement = (step: number) => () => {
    if (ref.current) {
      const parsedValue = Number(ref.current.value);
      const newValue = Number.isNaN(parsedValue) ? step : parsedValue + step;

      if (
        (typeof min === 'undefined' || newValue >= min)
        && (typeof max === 'undefined' || newValue <= max)
      ) {
        ref.current.value = newValue.toString();
        onChange?.(newValue);
      }
    }
  };

  return (
    <div className={`input-select-group number-input ${className}`}>
      <label hidden={!label} htmlFor={id}>
        {label}
        {!required || <span className='colored'>*</span>}
      </label>

      <div className='input-wrapper'>
        <input
          id={id}
          name={name}
          type='number'
          ref={ref}
          placeholder={placeholder?.toString()}
          defaultValue={defaultValue}
          value={value}
          min={min}
          max={max}
          disabled={disabled}
          onChange={onValueChange}
          onFocus={onFocus}
          onBlur={onBlur}
        />

        <div className='increment-buttons input-icon'>
          <ChevronUp onClick={onIncrement(step)} />
          <ChevronDown onClick={onIncrement(-step)} />
        </div>
      </div>

      <Hint variant='error'>{errorHint}</Hint>
      <Hint>{hint}</Hint>
    </div>
  );
}
