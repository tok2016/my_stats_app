import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

import { ConfirmationContext } from '@store/ConfirmationProvider';

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

export const useFetch = <T>(action: () => Promise<T>, initialData: T) => {
  const [data, setData] = useState<T>(initialData);
  const [isPending, setPending] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const fetched = await action();
      setData(fetched);
      setPending(false);
    };

    console.log('fetch effect');

    setPending(true);
    fetchData();
  }, [action]);

  return [data, setData, isPending] as const;
};

export const useConfirm = () => useContext(ConfirmationContext);
