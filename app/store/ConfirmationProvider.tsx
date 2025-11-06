'use client';

import { createContext, ReactNode, useEffect, useState } from 'react';

import {
  ConfirmationBaseAction,
  ConfirmationInfo,
  ConfirmationState
} from '@ts/users/confirmation';

import { useAction } from '@lib/hooks';
import {
  defaultConfirmation,
  defaultFormState,
  getErrorFormState
} from '@lib/utils';
import { getOperation } from '@lib/actions';
import { FormAction } from '@ts/ui/form-state';

type ConfirmationFormAction = <DataType>(
  baseAction: ConfirmationBaseAction
) => FormAction<DataType>;

type ConfirmationProviderProps = {
  children: ReactNode;
};

type ConfirmationContextProps = {
  state: ConfirmationState;
  confirmation: ConfirmationInfo;
  isPending: boolean;
  getFormAction: ConfirmationFormAction;
};

export const ConfirmationContext = createContext<ConfirmationContextProps>({
  state: 'void',
  confirmation: defaultConfirmation,
  isPending: false,
  getFormAction: () => () =>
    new Promise((resolve) => resolve(defaultFormState()))
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

  useEffect(() => {
    getConfirmation();
  }, [getConfirmation]);

  return (
    <ConfirmationContext.Provider
      value={{ state, getFormAction, confirmation, isPending }}
    >
      {children}
    </ConfirmationContext.Provider>
  );
}
