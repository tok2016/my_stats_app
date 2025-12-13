'use client';

import { createContext, useEffect, useState } from 'react';

import {
  ConfirmationBaseAction,
  ConfirmationInfo,
  ConfirmationState
} from '@ts/users/confirmation';
import { FormAction } from '@ts/ui/form-state';

import { useAction } from '@lib/hooks';
import {
  defaultConfirmation,
  defaultFormState,
  getErrorFormState
} from '@lib/utils';
import { deleteConfirmation, getOperation } from '@lib/actions';

type ConfirmationFormAction = <DataType>(
  baseAction: ConfirmationBaseAction
) => FormAction<DataType>;

type ConfirmationProviderProps = {
  children: React.ReactNode;
};

type ConfirmationContextProps = {
  state: ConfirmationState;
  confirmation: ConfirmationInfo;
  isPending: boolean;
  getFormAction: ConfirmationFormAction;
  cancelConfirm: () => void;
};

export const ConfirmationContext = createContext<ConfirmationContextProps>({
  state: 'void',
  confirmation: defaultConfirmation,
  isPending: false,
  getFormAction: () => () =>
    new Promise((resolve) => resolve(defaultFormState())),
  cancelConfirm: () => {}
});

export default function ConfirmationProvider({
  children
}: ConfirmationProviderProps) {
  const [state, setState] = useState<ConfirmationState>('void');
  const [confirmation, getConfirmation, isPending, setConfirmation] =
    useAction<ConfirmationInfo>(getOperation, defaultConfirmation);

  const getFormAction =
    <DataType,>(baseAction: ConfirmationBaseAction): FormAction<DataType> =>
    async (_state, data) => {
      try {
        const confimationInfo = await baseAction(confirmation, data);
        setConfirmation(confimationInfo);
        setState(confimationInfo.isConfirmed ? 'confirmed' : 'pending');

        return {
          error: false,
          message: '',
          data
        };
      } catch (err) {
        return getErrorFormState(err, data);
      }
    };

  const cancelConfirm = async () => {
    await deleteConfirmation(confirmation.id);
    setConfirmation(defaultConfirmation);
    setState('void');
  };

  useEffect(() => {
    getConfirmation();
  }, [getConfirmation]);

  return (
    <ConfirmationContext.Provider
      value={{ state, getFormAction, confirmation, isPending, cancelConfirm }}
    >
      {children}
    </ConfirmationContext.Provider>
  );
}
