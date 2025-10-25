'use client';

import { ReactNode, useActionState } from 'react';

import {
  ConfirmationBaseAction,
  ConfirmationCode
} from '@ts/users/confirmation';

import { defaultFormState } from '@lib/utils';
import SubmitButton from '@components/SubmitButton';
import SendAgainTimer from './SendAgainTimer';
import { useConfirm } from '@lib/hooks';
import CodeInput from '@components/CodeInput';

type ConfirmCodePage = {
  formAction: ConfirmationBaseAction;
  addendum: ReactNode;
};

export default function ConfirmCodePage({
  formAction,
  addendum
}: ConfirmCodePage) {
  const { getFormAction, confirmation } = useConfirm();

  const [state, action, isPending] = useActionState(
    getFormAction<ConfirmationCode>(formAction),
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
        errorHint={state.issues ? undefined : state.message}
      >
        Continue
      </SubmitButton>

      <SendAgainTimer />

      {addendum}
    </form>
  );
}
