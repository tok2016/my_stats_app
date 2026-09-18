'use client';

import { useEffect, useState } from 'react';

import FormState from '@ts/ui/form-state';

import AxiosInstanse from '@lib/axios-instanse';
import { useAction, useConfirm } from '@lib/hooks';
import { MILLISECONDS, defaultFormState, getErrorFormState } from '@lib/utils';

import Button from '../Button';
import Hint from '../Hint';

const SECONDS_UNAVAILABLE = 60;
const SECONDS_IN_MINUTE = 60;

const MIN_TIME_DIGITS = 2;

const sendCodeAgain = async (
  operationId: string = ''
): Promise<FormState<never>> => {
  try {
    await AxiosInstanse.put(`/api/confirm/${operationId}`);
    return { error: false, message: '' };
  } catch (err) {
    return getErrorFormState(err);
  }
};

const formatSeconds = (seconds: number) => {
  const minutes = Math.floor(seconds / SECONDS_IN_MINUTE).toLocaleString(
    'en-US',
    { minimumIntegerDigits: MIN_TIME_DIGITS }
  );

  const secondsModules = Math.round(seconds % SECONDS_IN_MINUTE).toLocaleString(
    'en-US',
    { minimumIntegerDigits: MIN_TIME_DIGITS }
  );

  return `${minutes}:${secondsModules}`;
};

export default function SendAgainTimer() {
  const [seconds, setSeconds] = useState<number>(SECONDS_UNAVAILABLE);
  const { confirmation } = useConfirm();
  const [state, changeCode, isPending] = useAction<FormState<unknown>, string>(
    sendCodeAgain,
    defaultFormState()
  );

  useEffect(() => {
    const timer = setTimeout(
      () => setSeconds((value) => (value > 0 ? value - 1 : value)),
      MILLISECONDS
    );

    return () => {
      clearTimeout(timer);
    };
  }, [seconds]);

  return (
    <div className='send-again-timer'>
      <p className='colored bold'>{formatSeconds(seconds)}</p>

      <div className='button-group'>
        <Hint>Haven’t got a code yet?</Hint>
        <Button
          variant='outlined'
          disabled={seconds > 0}
          loading={isPending}
          type='button'
          onClick={() => changeCode(confirmation.id)}
        >
          Send again
        </Button>
        <Hint variant='error'>{state.error ? state.message : ''}</Hint>
      </div>
    </div>
  );
}
