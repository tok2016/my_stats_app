import Game from '@ts/games/game';

import FetchImage from '@components/FetchImage';

import EmptyImage from './EmptyImage';
import GameCover from './GameCover';

type GameCollageProps = {
  game: Pick<Game, 'cover' | 'screenshots' | 'name' | 'id'>;
};

export const SCREENSHOTS_IN_COLLAGE = 2;

export default function GameCollage({ game }: GameCollageProps) {
  const screenshots = game.screenshots ?? [];

  return (
    <div className='game-collage'>
      <GameCover game={game} />

      {Array.from({ length: SCREENSHOTS_IN_COLLAGE }).map((_, i) =>
        i >= screenshots.length ? (
          <EmptyImage
            key={`${game.id}-empty-screenshot-${i}`}
            className={`screenshot screenshot-${i + 1}`}
          />
        ) : (
          <FetchImage
            key={`${game.id}-screenshot-${i}`}
            src={screenshots[i]}
            alt={`Screenshot ${i + 1} of ${game.name}`}
            className={`screenshot screenshot-${i + 1}`}
          />
        )
      )}
    </div>
  );
}
