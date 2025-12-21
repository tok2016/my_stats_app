'use client';

import { ButtonStyle } from '@ts/ui/components-props';

import Button from './Button';
import Hint from './Hint';

type SubmitButtonProps = {
  buttonStyle?: ButtonStyle;
  loading?: boolean;
  error?: boolean;
  children?: React.ReactNode;
  errorHint?: React.ReactNode;
  reset?: React.ReactNode;
  onSubmit?: () => void;
};

export default function SubmitButton({
  buttonStyle,
  loading,
  error,
  children,
  errorHint,
  reset,
  onSubmit
}: SubmitButtonProps) {
  return (
    <div className='button-group'>
      <div className='buttons-flex-box'>
        <div>
          <Button
            type='submit'
            loading={loading}
            onClick={onSubmit}
            {...buttonStyle}
          >
            {children}
          </Button>
        </div>

        {!reset || <div>{reset}</div>}
      </div>
      {!error || <Hint variant='error'>{errorHint}</Hint>}
    </div>
  );
}
