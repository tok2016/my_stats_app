'use client';

import { ConfirmationState } from '@ts/users/confirmation';

import ConfirmLoginForm from '../components/ConfirmLoginForm';
import { useConfirm } from '@lib/hooks';
import { requestConfimation, confirmByCode } from '@lib/actions';
import ConfirmCodeForm from '@components/confirm-form/ConfirmCodeForm';
import Reminder from '../components/Reminder';
import NewPasswordForm from '@components/password-form/NewPasswordForm';
import { resetPassword } from '../actions';

const Forms: Record<ConfirmationState, React.ReactNode> = {
  void: (
    <ConfirmLoginForm baseAction={requestConfimation} addendum={<Reminder />} />
  ),
  pending: (
    <ConfirmCodeForm baseAction={confirmByCode} addendum={<Reminder />} />
  ),
  confirmed: (
    <NewPasswordForm baseAction={resetPassword} addendum={<Reminder />} />
  )
};

export default function ResetPasswordPage({}) {
  const { state } = useConfirm();
  return Forms[state];
}
