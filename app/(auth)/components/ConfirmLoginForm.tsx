'use client';

import { ConfirmationFormProps, NewConfirmation } from '@ts/users/confirmation';

import { defaultFormState, getFormDataValue } from '@lib/utils';
import Input from '@components/Input';
import SubmitButton from '@components/SubmitButton';
import { useConfirm, useRedirectActionForm } from '@lib/hooks';

export default function ConfirmLoginForm({
  baseAction,
  addendum,
  path
}: ConfirmationFormProps) {
  const { getFormAction } = useConfirm();

  const [state, action, isPending] = useRedirectActionForm(
    getFormAction<NewConfirmation>(baseAction),
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
