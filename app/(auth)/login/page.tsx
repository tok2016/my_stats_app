'use client';

import Link from 'next/link';

import Input from '@components/Input';
import { getFormDataValue } from '@lib/utils';
import { login } from '../actions';
import SubmitButton from '@components/SubmitButton';
import { useRedirectActionForm } from '@lib/hooks';

export default function LoginPage() {
  const [state, action, isPending] = useRedirectActionForm(login, '/iam');

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
        type='password'
        id='password'
        name='password'
        label='Password'
        errorHint={state.issues?.password}
        hint={
          <Link href='/reset-password' className='colored bold underline'>
            Forgot password?
          </Link>
        }
        defaultValue={getFormDataValue('password', state.data)}
      />

      <SubmitButton
        loading={isPending}
        error={state.error || !!state.issues}
        errorHint={state.message}
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
