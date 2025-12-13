'use client';

import {
  ConfirmationCode,
  ConfirmationFormProps
} from '@ts/users/confirmation';
import { ButtonStyle } from '@ts/ui/components-props';

import { defaultFormState } from '@lib/utils';
import SubmitButton from '@components/SubmitButton';
import SendAgainTimer from './SendAgainTimer';
import { useConfirm, useRedirectActionForm } from '@lib/hooks';
import CodeInput from '@components/CodeInput';

type ConfirmCodeFormProps = ConfirmationFormProps & {
  buttonStyle?: ButtonStyle;
  label?: React.ReactNode;
};

export default function ConfirmCodeForm({
  baseAction,
  addendum,
  buttonStyle,
  path,
  label = 'Continue'
}: ConfirmCodeFormProps) {
  const { getFormAction, confirmation } = useConfirm();

  const [state, action, isPending] = useRedirectActionForm(
    getFormAction<ConfirmationCode>(baseAction),
    path,
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
        buttonStyle={buttonStyle}
        loading={isPending}
        error={state.error || !!state.issues}
        errorHint={state.message}
      >
        {label}
      </SubmitButton>

      <SendAgainTimer />

      {addendum}
    </form>
  );
}
