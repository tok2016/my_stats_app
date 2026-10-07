'use client';

import { EditSolid, TrashSolid } from '@mynaui/icons-react';

import { GameDetailed } from '@ts/games/game';

import { usePopupState } from '@store/popup-store';

import IconButton from '@components/IconButton';

import GameDeletePopup from './GameDeletePopup';
import GameUpdateForm from './GameUpdateForm';

type GameButtonsProps = {
  game: GameDetailed;
};

const GAME_UPDATE_POPUP = 'update-game-popup';
const GAME_DELETE_POPUP = 'delete-game-popup';

/**
 * @param props
 * @param props.game - Detailed game info.
 * @returns Buttons and popup to delete or update given game data.
 */
export default function GameControlButtons({ game }: GameButtonsProps) {
  const { togglePopup } = usePopupState();

  const onEditClick = () => {
    togglePopup(GAME_UPDATE_POPUP);
  };

  const onDeleteClick = () => {
    togglePopup(GAME_DELETE_POPUP);
  };

  return (
    <div className='games__page-name__contolls'>
      <IconButton
        variant='secondary'
        icon={<EditSolid />}
        onClick={onEditClick}
      />
      <IconButton
        variant='secondary'
        status='error'
        icon={<TrashSolid />}
        onClick={onDeleteClick}
      />

      <GameUpdateForm game={game} popupName={GAME_UPDATE_POPUP} />
      <GameDeletePopup game={game} popupName={GAME_DELETE_POPUP} />
    </div>
  );
}
