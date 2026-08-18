import Game from '@ts/games/game';

import FetchImage from '@components/FetchImage';

import EmptyImage from './EmptyImage';

type GameCoverProps = {
  game: Pick<Game, 'coverUrl' | 'name'>;
  className?: string;
};

export default function GameCover({ game, className = '' }: GameCoverProps) {
  return game.coverUrl ? (
    <FetchImage
      src={game.coverUrl}
      alt={`Cover of ${game.name}`}
      className={`game-cover ${className}`}
    />
  ) : (
    <EmptyImage className='game-cover empty-cover' />
  );
}
