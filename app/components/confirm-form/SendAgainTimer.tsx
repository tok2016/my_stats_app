'use client';

import { useEffect, useState } from 'react';

import Button from '../Button';
import Hint from '../Hint';
import { MILLISECONDS } from '@lib/utils';

const SECONDS_UNAVAILABLE = 60;
const SECONDS_IN_MINUTE = 60;

const formatSeconds = (seconds: number) => {
  const minutes = Math.floor(seconds / SECONDS_IN_MINUTE);
  const secondsModules = Math.round(seconds % SECONDS_IN_MINUTE);

  return `${minutes}:${secondsModules}`;
};

export default function SendAgainTimer() {
  const [seconds, setSeconds] = useState<number>(SECONDS_UNAVAILABLE);

  useEffect(() => {
    const timer = setTimeout(
      () => setSeconds((value) => (value > 0 ? value - 1 : value)),
      MILLISECONDS
    );

    console.log(seconds);

    return () => {
      clearTimeout(timer);
    };
  }, [seconds]);

  return (
    <>
      <p className='colored bold'>{formatSeconds(seconds)}</p>

      <div className='button-group'>
        <Hint>Haven’t got a code yet?</Hint>
        <Button variant='secondary' disabled={seconds > 0}>
          Send again
        </Button>
      </div>
    </>
  );
}
