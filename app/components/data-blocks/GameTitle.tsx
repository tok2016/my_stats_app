import Link from 'next/link';

import Game from '@ts/games/game';

import GameCover from './GameCover';

type GameTableTitleProps = {
  showLink?: boolean;
  game: Pick<Game, 'id' | 'coverUrl' | 'name'>;
};

/**
 * @param props
 * @param props.game - Game data with cover and name.
 * @param props.showLink - Inserts link to game's page into it's name component.
 * @returns Game main data block.
 */
export default function GameTitle({
  game,
  showLink = false
}: GameTableTitleProps) {
  return (
    <div className='game-title'>
      <GameCover game={game} className='game-title__cover' />
      {showLink ? (
        <Link
          href={`/games/titles/${game.id}`}
          className='colored bold game-title__name'
        >
          {game.name}
        </Link>
      ) : (
        <p className='colored bold game-title__name'>{game.name}</p>
      )}
    </div>
  );
}
