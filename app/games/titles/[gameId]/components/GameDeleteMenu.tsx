'use client';

import { useRef } from 'react';

import { GameDetailed } from '@ts/games/game';
import { FormAction } from '@ts/ui/form-state';

import AxiosInstanse from '@lib/axios-instanse';
import { useRedirectActionForm } from '@lib/hooks';
import { getErrorFormState } from '@lib/utils';

import { usePopupState } from '@store/popup-store';

import Button from '@components/Button';
import Popup from '@components/Popup';

type GameDeleteMenuProps = {
  game: GameDetailed;
  popupName: string;
};

const deleteGame =
  (gameId: string, controller: AbortController): FormAction<void> =>
  async () => {
    try {
      const response = await AxiosInstanse.delete(
        `/api/games/titles/item/${gameId}`,
        { signal: controller.signal }
      );
      return {
        error: false,
        message: response.statusText
      };
    } catch (err) {
      return getErrorFormState(err);
    }
  };

export default function GameDeleteMenu({
  game,
  popupName
}: GameDeleteMenuProps) {
  const { togglePopup } = usePopupState();
  const abortController = useRef(new AbortController());
  const [state, action, isPending] = useRedirectActionForm(
    deleteGame(game.id, abortController.current),
    '/games/library'
  );

  const onCancel = () => {
    togglePopup(popupName);
    abortController.current.abort();
  };

  const onClose = () => {
    abortController.current.abort();
  };

  return (
    <Popup name={popupName} onClose={onClose}>
      <p>
        Do you really want to remove{' '}
        <i>
          <b>{game.name}</b>
        </i>{' '}
        from your library? In this case, all metric data of this game will be
        deleted and will not be taken into account in charts.
      </p>

      <form action={action} className='buttons-flex-box' noValidate>
        <Button
          variant='primary'
          status='error'
          type='submit'
          loading={isPending}
        >
          Delete
        </Button>

        <Button variant='outlined' onClick={onCancel}>
          Cancel
        </Button>
      </form>

      {state.error && <p className='error'>{state.error}</p>}
    </Popup>
  );
}
