'use client';

import Link from 'next/link';

import { FormAction } from '@ts/ui/form-state';
import { UserAccess, UserLogin } from '@ts/users/user';

import AxiosInstanse from '@lib/axios-instanse';
import { useRedirectActionForm } from '@lib/hooks';
import { getErrorFormState, getFormDataValue } from '@lib/utils';

import Input from '@components/Input';
import SubmitButton from '@components/SubmitButton';

/**
 * Sends input credentials to authenticate.
 * @param _state - Previous state.
 * @param formData - New form data.
 * @returns Updated form state.
 */
const login: FormAction<UserLogin> = async (_state, formData) => {
  try {
    const body = Object.fromEntries(formData.entries());
    const response = await AxiosInstanse.post<UserAccess>('/api/login', body);

    return {
      error: false,
      message: response.statusText,
      data: formData
    };
  } catch (err) {
    return getErrorFormState(err, formData);
  }
};

/**
 * @returns Page with login form.
 */
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
        id='apassword'
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
