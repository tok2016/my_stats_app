'use client';

import { ConfirmationFormProps, NewConfirmation } from '@ts/users/confirmation';

import { requestConfimation } from '@lib/actions';
import { useConfirm, useRedirectActionForm } from '@lib/hooks';
import { defaultFormState, getFormDataValue } from '@lib/utils';

import Input from '@components/Input';
import SubmitButton from '@components/SubmitButton';

/**
 * @param props
 * @param addendum - Components to add after main input.
 * @param path - Path to page to redirect to.
 * @returns Form to request confirmation operation to reset password.
 */
export default function ConfirmLoginForm({
  addendum,
  path
}: ConfirmationFormProps) {
  const { getFormAction } = useConfirm();

  const [state, action, isPending] = useRedirectActionForm(
    getFormAction<NewConfirmation>(requestConfimation()),
    path,
    defaultFormState()
  );

  return (
    <form className='card light' action={action} noValidate>
      <h1>Change password</h1>

      <Input
        type='text'
        id='credential'
        name='credential'
        label='Username or email'
        placeholder='user123'
        errorHint={state.issues?.credential}
        defaultValue={getFormDataValue('credential', state.data)}
      />

      <SubmitButton
        loading={isPending}
        error={state.error || !!state.issues}
        errorHint={state.message}
      >
        Continue
      </SubmitButton>

      {addendum}
    </form>
  );
}
