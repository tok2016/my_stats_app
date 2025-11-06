'use client';

import Link from 'next/link';

import Input from '@components/Input';
import { register } from '../actions';
import { getFormDataValue } from '@lib/utils';
import SubmitButton from '@components/SubmitButton';
import PasswordHint from '@components/password-form/PasswordHint';
import { useRedirectActionForm } from '@lib/hooks';

export default function RegisterPage() {
  const [state, action, isPending] = useRedirectActionForm(register, '/iam');

  return (
    <form className='card light' action={action} noValidate>
      <h1>Sign up</h1>
      <Input
        id='email'
        name='email'
        label='Email'
        type='email'
        placeholder='example@email.com'
        required
        errorHint={state.issues?.email}
        defaultValue={getFormDataValue('email', state.data)}
      />

      <Input
        id='username'
        name='username'
        label='Username'
        type='text'
        placeholder='user123'
        required
        errorHint={state.issues?.username}
        defaultValue={getFormDataValue('username', state.data)}
      />

      <Input
        id='password'
        name='password'
        label='Password'
        type='password'
        required
        defaultValue={getFormDataValue('password', state.data)}
        errorHint={state.issues?.password}
        hint={<PasswordHint />}
      />

      <Input
        id='repeatPassword'
        name='repeatPassword'
        label='Repeat password'
        type='password'
        required
        defaultValue={getFormDataValue('repeatPassword', state.data)}
        errorHint={state.issues?.repeatPassword}
      />

      <SubmitButton
        loading={isPending}
        error={state.error || !!state.issues}
        errorHint={state.message}
      >
        Sign up
      </SubmitButton>

      <span>
        Already have an account?{' '}
        <Link href='/login' className='bold colored underline'>
          Sign in!
        </Link>
      </span>
    </form>
  );
}
