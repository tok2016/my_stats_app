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

/**
 * Enhances page's search params control options.
 * Pushes search params immediately after change.
 * @returns Enhanced methods of search params control.
 */
export const useURLSearchParams = () => {
  const searchParams = useSearchParams();
  const { push } = useRouter();
  const pathname = usePathname();

  /**
   * Returns param value.
   * @param param
   * @returns Param value.
   */
  const getParam = (param: string) => searchParams.get(param);

  /**
   * Returns search params object.
   * @returns Search params object.
   */
  const getParams = () => searchParams;

  /**
   * Set param with given value.
   * @param param
   * @param value
   */
  const setParam = (param: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(param, value);
    push(`${pathname}?${params.toString()}`);
  };

  /**
   * Sets and deletes given params.
   * @param updatedParams - Params with new values to set.
   * @param deletedParams - Params to delete.
   */
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

  /**
   * Deletes given param.
   * @param param
   */
  const deleteParam = (param: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(param);
    push(`${pathname}?${params.toString()}`);
  };

  return { getParam, getParams, setParam, updateParams, deleteParam } as const;
};

/**
 * Wraps state update logic of data and loading.
 * Creates function (state action) that encapsulates state update and action awaiting.
 * State action has the same arguments as the given action.
 * @param action - Function that sends the request and returns updated data.
 * @param initialData - Initial state data.
 * @param refreshPath - Is path needed to refresh after action.
 * @returns Action function with state update, data state, loading state.
 */
export const useAction = <DataType, ParameterType = void>(
  action: (newData: ParameterType) => Promise<DataType>,
  initialData: DataType,
  refreshPath: boolean = false
) => {
  const { refresh } = useRouter();
  const [data, setData] = useState<DataType>(initialData);
  const [isPending, setPending] = useState<boolean>(false);
  const actionRef = useRef(action);

  //State action that wraps given action awaiting and state update.
  const startAction = useCallback(
    async (newData: ParameterType) => {
      setPending(true);

      try {
        const data = await actionRef.current(newData);
        setData(data);
      } catch (err) {
        throw err;
      } finally {
        setPending(false);
      }

      if (refreshPath) refresh();
    },
    [actionRef, refresh, refreshPath]
  );

  useEffect(() => {
    actionRef.current = action;
  }, [action]);

  //Memoizes return value.
  const tools = useMemo(
    () => [data, startAction, isPending, setData] as const,
    [data, startAction, isPending]
  );
  return tools;
};

/**
 * @returns Confirmation operation context.
 */
export const useConfirm = () => useContext(ConfirmationContext);

/**
 * @returns Single chart context.
 */
export const useChart = () => useContext(ChartContext);

/**
 * Wraps useActionState hook for forms.
 * Lets redirect to another page after successful action, if it's given, or refresh the current one.
 * @param baseAction - Action that send the request on form submit. Must accept previous state and updated form data.
 * @param path - Page path to redirect after successfull action. Doesn't redirect if page is empty.
 * @param initialState - Initial form state with default form data values and validation issues.
 * @param needsRefresh - Is current page needed to refresh after action.
 * @returns
 */
export const useRedirectActionForm = <DataType>(
  baseAction: FormAction<DataType>,
  path: string = '',
  initialState: FormState<DataType> = defaultFormState(),
  needsRefresh: boolean = false
) => {
  const { replace, refresh } = useRouter();

  //Action that awaits given base action and redirects to another page or refreshes the current one.
  const redirectAction: FormAction<DataType> = async (prev, data) => {
    const next = await baseAction(prev, data);

    if (path && !next.error) replace(path);
    else if (needsRefresh) refresh();

    return next;
  };

  const [state, action, isPending] = useActionState(
    redirectAction,
    initialState
  );

  return [state, action, isPending] as const;
};
