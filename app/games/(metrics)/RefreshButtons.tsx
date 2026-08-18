'use client';

import { Plus, Refresh } from '@mynaui/icons-react';

import { useRouter } from 'next/navigation';

import AxiosInstanse from '@lib/axios-instanse';
import { useAction } from '@lib/hooks';
import { getErrorFormState } from '@lib/utils';

import Button from '@components/Button';

const refreshGames = async () => {
  try {
    const response = await AxiosInstanse.post('/api/games/steam');
    return response.statusText;
  } catch (err) {
    const state = getErrorFormState(err);
    return state.message;
  }
};

export default function RefreshButtons() {
  const [, action, isPending] = useAction(refreshGames, '', true);
  const { push } = useRouter();

  const onRefreshClick = () => action();
  const onAddGameClick = () => push('/games/add-game');

  return (
    <div className='refresh-buttons'>
      <Button
        variant='primary'
        beforeIcon={<Refresh />}
        onClick={onRefreshClick}
        loading={isPending}
      >
        Refresh
      </Button>

      <Button
        variant='secondary'
        beforeIcon={<Plus />}
        onClick={onAddGameClick}
      >
        Add Game
      </Button>
    </div>
  );
}
