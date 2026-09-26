import Game from '@ts/games/game';

import FetchImage from '@components/FetchImage';

import BlankImage from '../BlankImage';

type GameCoverProps = {
  game: Pick<Game, 'coverUrl' | 'name'>;
  className?: string;
};

/**
 * @param props
 * @param props.game - Game data with cover.
 * @param props.className
 * @returns Image component with game cover. Replaces with blank image, if cover is empty.
 */
export default function GameCover({ game, className = '' }: GameCoverProps) {
  return game.coverUrl ? (
    <FetchImage
      src={game.coverUrl}
      alt={`Cover of ${game.name}`}
      className={`game-cover ${className}`}
    />
  ) : (
    <BlankImage className='game-cover' />
  );
}
