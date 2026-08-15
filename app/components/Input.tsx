'use client';

import { Eye, EyeSlash } from '@mynaui/icons-react';
import { type ChangeEvent, type Ref, useReducer } from 'react';

import { TextInputProps } from '@ts/ui/components-props';
import { InputType } from '@ts/ui/components-variants';

import Hint from './Hint';

type InputProps = TextInputProps & {
  ref?: Ref<HTMLInputElement>;
  type?: InputType;
  icon?: React.ReactNode;
};

export default function Input({
  label,
  id,
  name,
  value,
  placeholder = '',
  type = 'text',
  className = '',
  required = false,
  disabled = false,
  icon,
  hint,
  errorHint,
  defaultValue,
  ref,
  onChange,
  onBlur,
  onFocus
}: InputProps) {
  const [isShown, show] = useReducer((value) => !value, false);

  const isPassword = type === 'password';

  const onValueChange = (
    evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => onChange?.(evt.target.value);

  return (
    <div className={`input-select-group ${className}`}>
      <label hidden={!label} htmlFor={id}>
        {label}
        {!required || <span className='colored'>*</span>}
      </label>

      <div className='input-wrapper'>
        <input
          id={id}
          name={name}
          ref={ref}
          type={isShown ? 'text' : type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          value={value}
          disabled={disabled}
          autoComplete={type === 'password' ? 'off' : 'on'}
          onChange={onValueChange}
          onFocus={onFocus}
          onBlur={onBlur}
        />

        {isPassword || icon}

        {!isPassword
          || (isShown ? (
            <EyeSlash className='input-icon' onClick={show} />
          ) : (
            <Eye className='input-icon' onClick={show} />
          ))}
      </div>

      <Hint variant='error'>{errorHint}</Hint>
      <Hint>{hint}</Hint>
    </div>
  );
}
