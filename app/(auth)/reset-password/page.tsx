'use client';

import { ReactNode } from 'react';

import { ConfirmationState } from '@ts/users/confirmation';

import ConfirmLoginForm from '../components/ConfirmLoginForm';
import { useConfirm } from '@lib/hooks';
import { requestConfimation } from '@lib/actions';

const Forms: Record<ConfirmationState, ReactNode> = {
  void: <ConfirmLoginForm baseAction={requestConfimation} />,
  pending: <></>,
  confirmed: <></>
};

export default function ResetPasswordPage({}) {
  const { state } = useConfirm();
  return Forms[state];
}
