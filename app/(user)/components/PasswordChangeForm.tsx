'use client';

import { useRef } from 'react';

import NewPasswordForm from '@components/password-form/NewPasswordForm';
import Popup from '@components/Popup';
import { changePassword } from '../actions';

type PasswordChangeFormProps = {
  popupName: string;
};

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
