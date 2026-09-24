'use client';

import {
  ConfirmationBaseAction,
  ConfirmationFormProps
} from '@ts/users/confirmation';
import { PasswordUpdate } from '@ts/users/password';

import { useConfirm, useRedirectActionForm } from '@lib/hooks';
import { getFormDataValue } from '@lib/utils';

import Input from '@components/Input';
import SubmitButton from '@components/SubmitButton';

import PasswordHint from './PasswordHint';

/**
 * @param props
 * @param props.baseAction - Action to perform on submit.
 * @param props.addendum - Components to add after form.
 * @param props.path - Path to page to redirect to.
 * @param props.requireOld - Is old password required.
 * @returns Form with password inputs.
 */
export default function NewPasswordForm({
  baseAction,
  addendum,
  path = '/iam',
  requireOld = false
}: ConfirmationFormProps & {
  requireOld?: boolean;
  baseAction: ConfirmationBaseAction;
}) {
  const { getFormAction } = useConfirm();
  const [state, action, isPending] = useRedirectActionForm(
    getFormAction<PasswordUpdate>(baseAction),
    path
  );

  return (
    <form className='card light' action={action} noValidate>
      <h1>Change password</h1>

      {!requireOld || (
        <Input
          label='Old password'
          id='oldPassword'
          name='oldPassword'
          type='password'
          required
          defaultValue={getFormDataValue('oldPassword', state.data)}
          errorHint={state.issues?.oldPassword}
        />
      )}

      <Input
        label='New password'
        id='newPassword'
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
