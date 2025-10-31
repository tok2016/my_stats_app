'use client';

import { ConfirmationFormProps } from '@ts/users/confirmation';
import Password from '@ts/users/password';

import { useConfirm, useRedirectActionForm } from '@lib/hooks';
import { getFormDataValue } from '@lib/utils';
import Input from '@components/Input';
import PasswordHint from './PasswordHint';
import SubmitButton from '@components/SubmitButton';

export default function NewPasswordForm({
  baseAction,
  addendum
}: ConfirmationFormProps) {
  const { getFormAction } = useConfirm();
  const [state, action, isPending] = useRedirectActionForm(
    getFormAction<Password>(baseAction),
    '/iam'
  );

  return (
    <form className='card light' action={action} noValidate>
      <h1>Change password</h1>

      <Input
        label='New password'
        id='password'
        name='password'
        type='password'
        required
        defaultValue={getFormDataValue('password', state.data)}
        errorHint={state.issues?.password}
        hint={<PasswordHint />}
      />

      <Input
        label='Repeat password'
        id='repeatPassword'
        name='repeatPassword'
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
        Change password
      </SubmitButton>

      {addendum}
    </form>
  );
}
