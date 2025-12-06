'use client';

import { ConfirmationFormProps } from '@ts/users/confirmation';

import Button from '@components/Button';
import ConfirmCodeForm from '@components/confirm-form/ConfirmCodeForm';
import Divider from '@components/Divider';
import { usePopupState } from '@store/popup-store';

export default function DeleteAccountCodeForm({
  baseAction,
  addendum,
  onCancel
}: ConfirmationFormProps & {
  onCancel: () => void;
}) {
  const { togglePopup } = usePopupState();

  const onCancelClick = async () => {
    await onCancel();
    togglePopup('');
  };

  return (
    <ConfirmCodeForm
      baseAction={baseAction}
      buttonStyle={{
        status: 'error'
      }}
      label='Confirm and delete'
      path='/login'
      addendum={
        <>
          <Divider>or</Divider>
          <Button variant='outlined' onClick={onCancelClick}>
            Cancel
          </Button>

          {addendum}
        </>
      }
    />
  );
}
