'use client';

import { useEffect, useState } from 'react';

import Button from '../Button';
import Hint from '../Hint';
import { MILLISECONDS } from '@lib/utils';

const SECONDS_UNAVAILABLE = 60;
const SECONDS_IN_MINUTE = 60;

const MIN_TIME_DIGITS = 2;

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
        <Button variant='outlined' disabled={seconds > 0} type='button'>
          Send again
        </Button>
      </div>
    </div>
  );
}
