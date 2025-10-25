'use client';

import { useActionState } from 'react';
import Link from 'next/link';

import Input from '@components/Input';
import { defaultFormState, getFormDataValue } from '@lib/utils';
import { login } from '../actions';
import SubmitButton from '@components/SubmitButton';

export default function LoginPage() {
  const [state, action, isPending] = useActionState(login, defaultFormState());

  return (
    <form className='card light' action={action} noValidate>
      <h1>Sign in</h1>

      <Input
        type='text'
        id='credential'
        name='credential'
        label='Username or email'
        placeholder='user123'
        errorHint={state.issues?.credential}
        defaultValue={getFormDataValue('credential', state.data)}
      />

      <Input
        type='text'
        id='password'
        name='password'
        label='Password'
        errorHint={state.issues?.password}
        hint={
          <Link href='/confirm-login' className='colored bold underline'>
            Forgot password?
          </Link>
        }
        defaultValue={getFormDataValue('password', state.data)}
      />

      <SubmitButton
        loading={isPending}
        errorHint={state.issues ? undefined : state.message}
      >
        Sign in
      </SubmitButton>

      <span>
        Don’t have an account?{' '}
        <Link href='/register' className='bold colored underline'>
          Sign up!
        </Link>
      </span>
    </form>
  );
}
