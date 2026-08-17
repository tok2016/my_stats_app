'use client';

import { EditSolid, TrashSolid } from '@mynaui/icons-react';

import { GameDetailed } from '@ts/games/game';

import { usePopupState } from '@store/popup-store';

import IconButton from '@components/IconButton';

import GameDeleteMenu from './GameDeleteMenu';
import GameUpdateForm from './GameUpdateForm';

type GameButtonsProps = {
  game: GameDetailed;
};

const GAME_UPDATE_POPUP = 'update-game-popup';
const GAME_DELETE_POPUP = 'delete-game-popup';

export default function GameButtons({ game }: GameButtonsProps) {
  const { togglePopup } = usePopupState();

  console.log(game);

  const onEditClick = () => {
    togglePopup(GAME_UPDATE_POPUP);
  };

  const onDeleteClick = () => {
    togglePopup(GAME_DELETE_POPUP);
  };

  return (
    <div className='game-buttons'>
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
      <GameDeleteMenu game={game} popupName={GAME_DELETE_POPUP} />
    </div>
  );
}
