'use client';

import { ButtonStyle } from '@ts/ui/components-props';
import {
  ConfirmationBaseAction,
  ConfirmationCode,
  ConfirmationFormProps
} from '@ts/users/confirmation';

import { useConfirm, useRedirectActionForm } from '@lib/hooks';
import { defaultFormState } from '@lib/utils';

import CodeInput from '@components/CodeInput';
import SubmitButton from '@components/SubmitButton';

import SendAgainTimer from './SendAgainTimer';

type ConfirmCodeFormProps = ConfirmationFormProps & {
  buttonStyle?: ButtonStyle;
  label?: React.ReactNode;
};

/**
 * @param props
 * @param props.addendum - Components to add after form.
 * @param props.buttonStyle - Confirm button style.
 * @param props.path - Path to page to redirect to.
 * @param props.label - Confirm button text.
 * @param props.confirmCodeAction - Action to perform on submit.
 * @returns Form with confirmation code.
 */
export default function ConfirmCodeForm({
  addendum,
  buttonStyle,
  path,
  confirmCodeAction,
  label = 'Continue'
}: ConfirmCodeFormProps & { confirmCodeAction: ConfirmationBaseAction }) {
  const { getFormAction, confirmation } = useConfirm();

  const [state, action, isPending] = useRedirectActionForm(
    getFormAction<ConfirmationCode>(confirmCodeAction),
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
