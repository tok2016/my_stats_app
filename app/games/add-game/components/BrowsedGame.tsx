'use client';

import { SearchGame } from '@ts/games/game';

import GameCover from '@components/data-blocks/GameCover';

type BrowsedGameProps = {
  game: SearchGame;
  onClick?: () => void;
};

export default function BrowsedGame({ game, onClick }: BrowsedGameProps) {
  const releaseYear = game.releasedAt
    ? new Date(game.releasedAt).getFullYear()
    : undefined;

  return (
    <div
      className={`browsed-game ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
    >
      <GameCover className='browsed-game-cover' game={game} />

      <div className='browsed-game-data'>
        <p className='small bold browsed-game-name'>
          {game.name}
          {releaseYear && ` (${releaseYear})`}
        </p>

        <p className='min'>
          {game.genres.map((genre) => genre.name).join(', ')}
        </p>
      </div>
    </div>
  );
}
