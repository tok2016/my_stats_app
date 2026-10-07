'use client';

import { ChevronDown, ChevronUp } from '@mynaui/icons-react';
import {
  type ChangeEvent,
  DetailedHTMLProps,
  InputHTMLAttributes,
  type MouseEvent,
  useRef
} from 'react';

import { InputExpandedProps } from '@ts/ui/components-props';

import Hint from './Hint';

type NumberInputProps = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'value' | 'onChange' | 'defaultValue' | 'type' | 'placeholder'
>
  & InputExpandedProps & {
    min?: number;
    max?: number;
    step?: number;
    value?: number;
    defaultValue?: number;
    placeholder?: number;
    onChange?: (value?: number) => void;
  };

export default function NumberInput({
  id,
  label,
  min,
  max,
  step = 1,
  className = '',
  hint,
  errorHint,
  required,
  placeholder,
  onChange,
  ...props
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

  const onIncrementDown = (evt: MouseEvent) => {
    if (evt.detail > 1) evt.preventDefault();
  };

  return (
    <div className={`input-group input-group--number ${className}`}>
      <label hidden={!label} htmlFor={id}>
        {label}
        {!required || <span className='colored'>*</span>}
      </label>

      <div className='input-group__field'>
        <input
          {...props}
          placeholder={placeholder?.toString()}
          required={false}
          id={id}
          type='number'
          ref={ref}
          min={min}
          max={max}
          onChange={onValueChange}
        />

        <div className='input-group__field__increment input-group__field__icon'>
          <ChevronUp
            onClick={onIncrement(step)}
            onMouseDown={onIncrementDown}
          />
          <ChevronDown
            onClick={onIncrement(-step)}
            onMouseDown={onIncrementDown}
          />
        </div>
      </div>

      <Hint variant='error'>{errorHint}</Hint>
      <Hint>{hint}</Hint>
    </div>
  );
}
