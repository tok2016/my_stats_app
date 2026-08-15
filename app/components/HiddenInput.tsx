'use client';

import { useState } from 'react';

import BinaryInput from './BinaryInput';

type HiddenInputProps = {
  label: string;
  name: string;
  id: string;
  defaultValue?: boolean;
  children: React.ReactNode;
};

export default function HiddenInput({
  label,
  name,
  id,
  defaultValue,
  children
}: HiddenInputProps) {
  const [isOpened, setOpened] = useState(defaultValue);

  return (
    <div className='hidden-input'>
      <BinaryInput
        type='checkbox'
        isSwitch
        id={id}
        name={name}
        label={label}
        onChange={setOpened}
        defaultValue={defaultValue}
      />
      {isOpened && children}
    </div>
  );
}
