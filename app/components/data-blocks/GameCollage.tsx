import Game from '@ts/games/game';

import FetchImage from '@components/FetchImage';

import BlankImage from '../BlankImage';
import GameCover from './GameCover';

type GameCollageProps = {
  game: Pick<Game, 'coverUrl' | 'screenshots' | 'name' | 'id'>;
};

export const SCREENSHOTS_IN_COLLAGE = 2;

/**
 * @param props
 * @param props.game - Game data with cover and screenshots to render.
 * @returns Collage of game's cover and 2 screenshots. Replaces empty cover / screenshots with blank image.
 */
export default function GameCollage({ game }: GameCollageProps) {
  const screenshots = game.screenshots ?? [];

  return (
    <div className='game-collage'>
      <GameCover game={game} />

      {Array.from({ length: SCREENSHOTS_IN_COLLAGE }).map((_, i) =>
        i >= screenshots.length ? (
          <BlankImage
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
