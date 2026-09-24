'use client';

import Link from 'next/link';

import { FormAction } from '@ts/ui/form-state';
import { NewCredentials } from '@ts/users/credentials';
import { UserAccess } from '@ts/users/user';

import AxiosInstanse from '@lib/axios-instanse';
import { useRedirectActionForm } from '@lib/hooks';
import { getErrorFormState, getFormDataValue } from '@lib/utils';

import Input from '@components/Input';
import SubmitButton from '@components/SubmitButton';
import PasswordHint from '@components/password-form/PasswordHint';

/**
 * Sends new user's data to register.
 * @param _state - Previous state.
 * @param formData - New data.
 * @returns Updated form state.
 */
const register: FormAction<NewCredentials> = async (_state, formData) => {
  try {
    const body = Object.fromEntries(formData.entries());
    const response = await AxiosInstanse.post<UserAccess>('/api/user', body);

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
 * @returns Page with register form.
 */
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
        id='apassword'
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
