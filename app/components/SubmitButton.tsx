'use client';

import { ReactNode } from 'react';

import Button from './Button';
import Hint from './Hint';

type SubmitButtonProps = {
  loading?: boolean;
  error?: boolean;
  children?: ReactNode;
  errorHint?: ReactNode;
};

export default function SubmitButton({
  loading,
  error,
  children,
  errorHint
}: SubmitButtonProps) {
  return (
    <div className='button-group'>
      <Button variant='primary' type='submit' loading={loading}>
        {children}
      </Button>
      {error || <Hint variant='error'>{errorHint}</Hint>}
    </div>
  );
}
