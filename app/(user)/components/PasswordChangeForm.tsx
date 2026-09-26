'use client';

import { useRef } from 'react';

import Popup from '@components/Popup';
import NewPasswordForm from '@components/password-form/NewPasswordForm';

import { changePassword } from '../actions';

type PasswordChangeFormProps = {
  popupName: string;
};

/**
 * @param props
 * @param props.popupName - Name of popup with password change form.
 * @returns Popup with password change form.
 */
export default function PasswordChangeForm({
  popupName
}: PasswordChangeFormProps) {
  const abort = useRef(new AbortController());

  const onClose = () => {
    abort.current.abort();
  };

  return (
    <Popup name={popupName} onClose={onClose}>
      <NewPasswordForm
        requireOld
        baseAction={changePassword(abort.current.signal)}
      />
    </Popup>
  );
}
