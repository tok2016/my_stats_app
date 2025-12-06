'use client';

import { ConfirmationFormProps } from '@ts/users/confirmation';

import Button from '@components/Button';
import SubmitButton from '@components/SubmitButton';
import { useConfirm, useRedirectActionForm } from '@lib/hooks';
import { defaultFormState } from '@lib/utils';
import { usePopupState } from '@store/popup-store';
import { useUserState } from '@store/user-store';

export default function DeleteAccountWarning({
  baseAction,
  onCancel,
  addendum,
  path
}: ConfirmationFormProps & { onCancel: () => void }) {
  const { user } = useUserState();
  const { getFormAction } = useConfirm();
  const [state, startDelete, isPending] = useRedirectActionForm(
    getFormAction(baseAction),
    path,
    defaultFormState()
  );

  const { togglePopup } = usePopupState();

  const onCancelClick = async () => {
    await onCancel();
    togglePopup('');
  };

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
          <Button variant='outlined' onClick={onCancelClick}>
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
