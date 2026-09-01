import Link from 'next/link';

import Game from '@ts/games/game';

import GameCover from './GameCover';

type GameTableTitleProps = {
  showLink?: boolean;
  game: Pick<Game, 'id' | 'coverUrl' | 'name'>;
};

export default function GameTableTitle({
  game,
  showLink = false
}: GameTableTitleProps) {
  return (
    <div className='game-table-title'>
      <GameCover game={game} className='game-table-cover' />
      {showLink ? (
        <Link
          href={`/games/titles/${game.id}`}
          className='colored bold game-table-name'
        >
          {game.name}
        </Link>
      ) : (
        <p className='colored bold game-table-name'>{game.name}</p>
      )}
    </div>
  );
}
