'use client';

import { ConfirmationFormProps } from '@ts/users/confirmation';

import Button from '@components/Button';
import Divider from '@components/Divider';
import ConfirmCodeForm from '@components/confirm-form/ConfirmCodeForm';

import { deleteAccount } from '@app/(user)/actions';

/**
 * @param props
 * @param props.addendum - Components to add after form.
 * @param props.signal - Abort signal object.
 * @param props.onCancel - On delete account cancel.
 * @returns Form with code confirmation that deletes account.
 */
export default function DeleteAccountCodeForm({
  addendum,
  signal,
  onCancel
}: ConfirmationFormProps & {
  onCancel: () => void;
  signal: AbortSignal;
}) {
  return (
    <ConfirmCodeForm
      confirmCodeAction={deleteAccount(signal)}
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
