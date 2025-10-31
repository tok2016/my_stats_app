'use client';

import { useActionState } from 'react';

import {
  ConfirmationCode,
  ConfirmationFormProps
} from '@ts/users/confirmation';

import { defaultFormState } from '@lib/utils';
import SubmitButton from '@components/SubmitButton';
import SendAgainTimer from './SendAgainTimer';
import { useConfirm } from '@lib/hooks';
import CodeInput from '@components/CodeInput';

export default function ConfirmCodeForm({
  baseAction,
  addendum
}: ConfirmationFormProps) {
  const { getFormAction, confirmation } = useConfirm();

  const [state, action, isPending] = useActionState(
    getFormAction<ConfirmationCode>(baseAction),
    defaultFormState()
  );

  return (
    <form className='card light' action={action} noValidate>
      <h1>Confirmation</h1>

      <CodeInput
        id='code'
        name='code'
        errorHint={state.issues?.code}
        label={
          <span>
            Enter the code sent to{' '}
            <a href={confirmation.credential} className='colored'>
              {confirmation.credential}
            </a>
          </span>
        }
      />

      <SubmitButton
        loading={isPending}
        error={state.error || !!state.issues}
        errorHint={state.message}
      >
        Continue
      </SubmitButton>

      <SendAgainTimer />

      {addendum}
    </form>
  );
}
