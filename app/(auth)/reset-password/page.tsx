'use client';

import {
  ConfirmationBaseAction,
  ConfirmationState
} from '@ts/users/confirmation';
import { NewPassword } from '@ts/users/password';

import { confirmByCode } from '@lib/actions';
import AxiosInstanse from '@lib/axios-instanse';
import { useConfirm } from '@lib/hooks';

import ConfirmCodeForm from '@components/confirm-form/ConfirmCodeForm';
import NewPasswordForm from '@components/password-form/NewPasswordForm';

import ConfirmLoginForm from '../components/ConfirmLoginForm';
import Reminder from '../components/Reminder';

/**
 * Sends new password with confirmation operation ID to reset the old password.
 * @param prev - Previous confirmation form state.
 * @param formData - New form data.
 * @returns Previous confirmation form state.
 */
const resetPassword: ConfirmationBaseAction = async (prev, formData) => {
  const passwordData = Object.fromEntries(
    formData.entries()
  ) as Partial<NewPassword>;
  const body: Partial<NewPassword> = {
    ...passwordData,
    credential: prev.credential,
    operationId: prev.id
  };

  await AxiosInstanse.post('/api/resetPassword', body);
  return prev;
};

/**
 * Reset password forms by confirmation state.
 */
const Forms: Record<ConfirmationState, React.ReactNode> = {
  void: <ConfirmLoginForm addendum={<Reminder />} />,
  pending: (
    <ConfirmCodeForm
      addendum={<Reminder />}
      confirmCodeAction={confirmByCode}
    />
  ),
  confirmed: (
    <NewPasswordForm baseAction={resetPassword} addendum={<Reminder />} />
  )
};

/**
 * @returns Page with confirmation and reset password forms decided by confirmation state.
 */
export default function ResetPasswordPage() {
  const { state } = useConfirm();
  return Forms[state];
}
