'use client';

import { ConfirmationFormProps } from '@ts/users/confirmation';

import { requestConfimation } from '@lib/actions';
import { useConfirm, useRedirectActionForm } from '@lib/hooks';
import { defaultFormState } from '@lib/utils';

import { useUserState } from '@store/user-store';

import Button from '@components/Button';
import SubmitButton from '@components/SubmitButton';

/**
 * @param props
 * @param props.addendum - Components to add after form.
 * @param props.path - Path to page to redirect to.
 * @param props.signal - Abort signal object.
 * @param props.onCancel - On delete account cancel.
 * @returns Hidden form that requests delete confirmation operation.
 */
export default function DeleteAccountWarning({
  onCancel,
  addendum,
  path,
  signal
}: ConfirmationFormProps & { onCancel: () => void; signal: AbortSignal }) {
  const { user } = useUserState();
  const { getFormAction } = useConfirm();
  const [state, startDelete, isPending] = useRedirectActionForm(
    getFormAction(requestConfimation(signal)),
    path,
    defaultFormState()
  );

  return (
    <form className='card light' action={startDelete} noValidate>
      <p>{`Do you really want to delete your account? You won't be able to restore all your account's data`}</p>

      <input type='hidden' name='credential' value={user.email} />
      <input type='hidden' name='action' value='delete' />

      <SubmitButton
        loading={isPending}
        error={state.error}
        errorHint={state.message}
        buttonStyle={{ status: 'error' }}
        reset={
          <Button variant='outlined' onClick={onCancel}>
            Cancel
          </Button>
        }
      >
        Delete
      </SubmitButton>

      {addendum}
    </form>
  );
}
