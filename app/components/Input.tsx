'use client';

import { EyeSlash, Eye } from '@mynaui/icons-react';
import { ChangeEvent, HTMLInputTypeAttribute, useReducer } from 'react';

import { TextInputProps } from '@ts/ui/components-props';

import Hint from './Hint';

type InputType = Extract<
  HTMLInputTypeAttribute,
  'text' | 'password' | 'date' | 'email'
>;

type InputProps = TextInputProps & {
  type?: InputType;
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
  hint,
  errorHint,
  defaultValue,
  onChange
}: InputProps) {
  const [isShown, show] = useReducer((value) => !value, false);

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
          type={isShown ? 'text' : type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          value={value}
          autoComplete={type === 'password' ? 'off' : 'on'}
          onChange={onValueChange}
        />

        {type !== 'password'
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
