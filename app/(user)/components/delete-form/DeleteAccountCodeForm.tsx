'use client';

import { ConfirmationFormProps } from '@ts/users/confirmation';

import Button from '@components/Button';
import ConfirmCodeForm from '@components/confirm-form/ConfirmCodeForm';
import Divider from '@components/Divider';

export default function DeleteAccountCodeForm({
  baseAction,
  addendum,
  onCancel
}: ConfirmationFormProps & {
  onCancel: () => void;
}) {
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
          <Button variant='outlined' onClick={onCancel} type='button'>
            Cancel
          </Button>

          {addendum}
        </>
      }
    />
  );
}
