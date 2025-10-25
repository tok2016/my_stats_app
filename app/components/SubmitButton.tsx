'use client';

import { ReactNode } from 'react';

import Button from './Button';
import Hint from './Hint';

type SubmitButtonProps = {
  loading?: boolean;
  children?: ReactNode;
  errorHint?: ReactNode;
};

export default function SubmitButton({
  loading,
  children,
  errorHint
}: SubmitButtonProps) {
  return (
    <div className='button-group'>
      <Button variant='primary' type='submit' loading={loading}>
        {children}
      </Button>
      <Hint variant='error'>{errorHint}</Hint>
    </div>
  );
}
