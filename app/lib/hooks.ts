import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useActionState, useCallback, useContext, useState } from 'react';

import FormState, { FormAction } from '@ts/ui/form-state';

import { ConfirmationContext } from '@store/ConfirmationProvider';
import { defaultFormState } from './utils';

export const useURLSearchParams = () => {
  const searchParams = useSearchParams();
  const { push } = useRouter();
  const pathname = usePathname();

  const getParam = (param: string) => searchParams.get(param);

  const setParam = (param: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(param, value);
    push(`${pathname}?${params.toString()}`);
  };

  const deleteParam = (param: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(param);
    push(`${pathname}?${params.toString()}`);
  };

  return { getParam, setParam, deleteParam } as const;
};

export const useAction = <DataType, ParameterType = undefined>(
  action: (newData?: ParameterType) => Promise<DataType>,
  initialData: DataType,
  refreshPath: boolean = false
) => {
  const { refresh } = useRouter();
  const [data, setData] = useState<DataType>(initialData);
  const [isPending, setPending] = useState<boolean>(false);

  const startAction = useCallback(
    async (newData?: ParameterType) => {
      setPending(true);
      const data = await action(newData);

      setData(data);
      setPending(false);

      if (refreshPath) {
        refresh();
      }
    },
    [action, refresh, refreshPath]
  );

  return [data, startAction, isPending, setData] as const;
};

export const useConfirm = () => useContext(ConfirmationContext);

export const useRedirectActionForm = <DataType>(
  baseAction: FormAction<DataType>,
  path: string,
  initialState: FormState<DataType> = defaultFormState()
) => {
  const { replace } = useRouter();

  const redirectAction: FormAction<DataType> = async (prev, data) => {
    const next = await baseAction(prev, data);

    if (!next.error) {
      replace(path);
    }

    return next;
  };

  const [state, action, isPending] = useActionState(
    redirectAction,
    initialState
  );

  return [state, action, isPending] as const;
};
