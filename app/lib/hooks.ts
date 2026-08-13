import {
  useActionState,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import FormState, { FormAction } from '@ts/ui/form-state';

import { ChartContext } from '@store/ChartProvider';
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

  const updateParams = (
    updatedParams: Record<string, string>,
    deletedParams?: string[]
  ) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(updatedParams).forEach((param) => {
      newParams.set(param[0], param[1]);
    });

    deletedParams?.forEach((param) => {
      newParams.delete(param);
    });

    push(`${pathname}?${newParams.toString()}`);
  };

  const deleteParam = (param: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(param);
    push(`${pathname}?${params.toString()}`);
  };

  return { getParam, setParam, updateParams, deleteParam } as const;
};

export const useAction = <DataType, ParameterType = undefined>(
  action: (newData?: ParameterType) => Promise<DataType>,
  initialData: DataType,
  refreshPath: boolean = false
) => {
  const { refresh } = useRouter();
  const [data, setData] = useState<DataType>(initialData);
  const [isPending, setPending] = useState<boolean>(false);
  const actionRef = useRef(action);

  const startAction = useCallback(
    async (newData?: ParameterType) => {
      setPending(true);
      const data = await actionRef.current(newData);

      setData(data);
      setPending(false);

      if (refreshPath) {
        refresh();
      }
    },
    [actionRef, refresh, refreshPath]
  );

  useEffect(() => {
    actionRef.current = action;
  }, [action]);

  const tools = useMemo(
    () => [data, startAction, isPending, setData] as const,
    [data, startAction, isPending]
  );
  return tools;
};

export const useConfirm = () => useContext(ConfirmationContext);
export const useChart = () => useContext(ChartContext);

export const useRedirectActionForm = <DataType>(
  baseAction: FormAction<DataType>,
  path: string = '',
  initialState: FormState<DataType> = defaultFormState(),
  needsRefresh: boolean = false
) => {
  const { replace, refresh } = useRouter();

  const redirectAction: FormAction<DataType> = async (prev, data) => {
    const next = await baseAction(prev, data);

    if (path && !next.error) replace(path);
    if (needsRefresh) refresh();

    return next;
  };

  const [state, action, isPending] = useActionState(
    redirectAction,
    initialState
  );

  return [state, action, isPending] as const;
};
