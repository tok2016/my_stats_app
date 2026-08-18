import Link from 'next/link';

import Game from '@ts/games/game';

import GameCover from './GameCover';

type GameTableTitleProps = {
  game: Pick<Game, 'id' | 'coverUrl' | 'name'>;
};

export default function GameTableTitle({ game }: GameTableTitleProps) {
  return (
    <div className='game-table-title'>
      <GameCover game={game} className='game-table-cover' />
      <Link
        href={`/games/titles/${game.id}`}
        className='colored bold game-table-name'
      >
        {game.name}
      </Link>
    </div>
  );
}
