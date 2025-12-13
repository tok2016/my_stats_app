'use client';

import { useRef } from 'react';

import { ConfirmationState } from '@ts/users/confirmation';

import DeleteAccountWarning from './DeleteAccountWarning';
import { requestConfimation } from '@lib/actions';
import { deleteAccount } from '@app/(user)/actions';
import Popup from '@components/Popup';
import { useConfirm } from '@lib/hooks';
import DeleteAccountCodeForm from './DeleteAccountCodeForm';
import { usePopupState } from '@store/popup-store';

type DeleteAccountFormProps = {
  popupName: string;
};

type DeleteFormFunc = (
  signal: AbortSignal,
  onCancel: () => void
) => React.ReactNode;

const DeleteForms: Record<ConfirmationState, DeleteFormFunc> = {
  void: (signal, onCancel) => (
    <DeleteAccountWarning
      baseAction={requestConfimation(signal)}
      onCancel={onCancel}
    />
  ),
  pending: (signal, onCancel) => (
    <DeleteAccountCodeForm
      baseAction={deleteAccount(signal)}
      onCancel={onCancel}
    />
  ),
  confirmed: () => undefined
};

export default function DeleteAccountForm({
  popupName
}: DeleteAccountFormProps) {
  const { togglePopup } = usePopupState();
  const { state, cancelConfirm } = useConfirm();
  const abortRef = useRef(new AbortController());

  const onClose = async () => {
    abortRef.current.abort();
    await cancelConfirm();
    togglePopup(popupName);
  };

  return (
    <Popup name={popupName} onClose={onClose}>
      {DeleteForms[state](abortRef.current.signal, onClose)}
    </Popup>
  );
}
