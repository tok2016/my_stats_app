'use client';

import { TextInputProps } from '@ts/ui/components-props';
import { InputType } from '@ts/ui/components-variants';

import Input from './Input';

type DoubleInputProps = {
  type?: InputType;
  leftInput: TextInputProps;
  rightInput: TextInputProps;
};

export default function DoubleInput({
  type = 'text',
  leftInput,
  rightInput
}: DoubleInputProps) {
  return (
    <div className='input-select-group'>
      {leftInput.label && (
        <label htmlFor={leftInput.id}>{leftInput.label}</label>
      )}
      <div className='double-input'>
        <Input {...leftInput} type={type} label={undefined} />
        <label htmlFor={rightInput.id}>
          {rightInput.label ? rightInput.label : '—'}
        </label>
        <Input {...rightInput} type={type} label={undefined} />
      </div>
    </div>
  );
}
