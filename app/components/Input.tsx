'use client';

import { Eye, EyeSlash } from '@mynaui/icons-react';
import type {
  ChangeEvent,
  DetailedHTMLProps,
  InputHTMLAttributes
} from 'react';
import { useReducer } from 'react';

import { InputExpandedProps } from '@ts/ui/components-props';
import { InputType } from '@ts/ui/components-variants';

import Hint from './Hint';

type InputProps = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'onChange' | 'type'
>
  & InputExpandedProps & {
    type?: InputType;
    icon?: React.ReactNode;
    onChange?: (value: string) => void;
  };

export default function Input({
  label,
  id,
  type = 'text',
  className = '',
  required,
  icon,
  hint,
  errorHint,
  onChange,
  ...props
}: InputProps) {
  const [isShown, show] = useReducer((value) => !value, false);

  const isPassword = type === 'password';

  const onValueChange = (
    evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => onChange?.(evt.target.value);

  return (
    <div className={`input-group ${className}`}>
      <label hidden={!label} htmlFor={id} className='input-group__label'>
        {label}
        {required && <span className='colored'>*</span>}
      </label>

      <div className='input-group__field'>
        <input
          {...props}
          required={false}
          className='input-group__field__input'
          type={isShown ? 'text' : type}
          autoComplete={type === 'password' ? 'off' : 'on'}
          onChange={onValueChange}
        />

        {isPassword || icon}

        {!isPassword
          || (isShown ? (
            <EyeSlash className='input-group__field__icon' onClick={show} />
          ) : (
            <Eye className='input-group__field__icon' onClick={show} />
          ))}
      </div>

      <Hint variant='error'>{errorHint}</Hint>
      <Hint>{hint}</Hint>
    </div>
  );
}
