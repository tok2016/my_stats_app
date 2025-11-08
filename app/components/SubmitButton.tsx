'use client';

import Button from './Button';
import Hint from './Hint';

type SubmitButtonProps = {
  loading?: boolean;
  error?: boolean;
  children?: React.ReactNode;
  errorHint?: React.ReactNode;
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
