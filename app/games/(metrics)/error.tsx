'use client';

import Button from '@components/Button';
import ErrorMessage from '@components/ErrorMessage';

export default function MetricError({
  error,
  reset
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <ErrorMessage error={error} className='stretch-error'>
      <Button variant='secondary' onClick={reset}>
        Try again
      </Button>
    </ErrorMessage>
  );
}
