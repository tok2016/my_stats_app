import Game from '@ts/games/game';

import FetchImage from '@components/FetchImage';

import EmptyImage from './EmptyImage';

type GameCoverProps = {
  game: Pick<Game, 'cover' | 'name'>;
  className?: string;
};

export default function GameCover({ game, className = '' }: GameCoverProps) {
  return game.cover ? (
    <FetchImage
      src={game.cover}
      alt={`Cover of ${game.name}`}
      className={`game-cover ${className}`}
    />
  ) : (
    <EmptyImage className='game-cover empty-cover' />
  );
}
