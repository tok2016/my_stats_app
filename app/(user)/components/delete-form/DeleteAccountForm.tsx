'use client';

import { useRef } from 'react';

import { ConfirmationState } from '@ts/users/confirmation';

import { useConfirm } from '@lib/hooks';

import { usePopupState } from '@store/popup-store';

import Popup from '@components/Popup';

import DeleteAccountCodeForm from './DeleteAccountCodeForm';
import DeleteAccountWarning from './DeleteAccountWarning';

type DeleteAccountFormProps = {
  popupName: string;
};

type DeleteFormFunc = (
  signal: AbortSignal,
  onCancel: () => void
) => React.ReactNode;

/**
 * Delete account forms by confirmation state.
 */
const DeleteForms: Record<ConfirmationState, DeleteFormFunc> = {
  void: (signal, onCancel) => (
    <DeleteAccountWarning signal={signal} onCancel={onCancel} />
  ),
  pending: (signal, onCancel) => (
    <DeleteAccountCodeForm signal={signal} onCancel={onCancel} />
  ),
  confirmed: () => undefined
};

/**
 * @param props
 * @param props.popupName - Name of popup with delete forms.
 * @returns Popup with delete forms by confirmation state.
 */
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
