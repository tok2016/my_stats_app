import { GameDetailed } from '@ts/games/game';
import { RatingDetialed } from '@ts/games/rating';

import Rating from '@components/Rating';

import PlaytimeRating from '@app/games/components/PlaytimeRating';

type GameRatingsProps = {
  game: GameDetailed;
};

type GameRatingBlockProps = {
  title: string;
  rating?: RatingDetialed;
  isSeries?: boolean;
};

type GamePositionsProps = {
  rating?: RatingDetialed;
  isSeries?: boolean;
};

/**
 * @param props
 * @param props.rating - Rating data with value and positions.
 * @param props.isSeries - Is game the part of a series.
 * @returns Blocks with postions numbers among all games and series, if games is the part of it.
 */
function GamePositions({ rating, isSeries }: GamePositionsProps) {
  return (
    <div className='rating-block__positions'>
      <div className='rating-block__positions__block'>
        <p className='rating-block__positions__block__rank'>
          {rating ? rating.generalPosition : '—'}
        </p>
        <p className='rating-block__positions__block__label'>all games</p>
      </div>

      {isSeries && (
        <div className='rating-block__positions__block'>
          <p className='rating-block__positions__block__rank'>
            {rating && rating.seriesPosition ? rating.seriesPosition : '—'}
          </p>
          <p className='rating-block__positions__block__label'>series</p>
        </div>
      )}
    </div>
  );
}

/**
 * @param props
 * @param props.title - Rating title.
 * @param props.rating - Rating data with value and positions.
 * @param props.isSeries - Is game the part of a series.
 * @returns Block with rating value and it's positions among all games and series.
 */
function GameRatingBlock({ title, rating, isSeries }: GameRatingBlockProps) {
  return (
    <div className='rating-block'>
      <h3 className='rating-block__title'>{title}</h3>
      <Rating className='rating-block__rating' value={rating?.value} />
      <GamePositions rating={rating} isSeries={isSeries} />
    </div>
  );
}

/**
 * @param props
 * @param props.title - Rating title.
 * @param props.rating - Playtime data with value and positions.
 * @param props.isSeries - Is game the part of a series.
 * @returns Block with playtime value and it's positions among all games and series.
 */
function GamePlaytimeBlock({ title, rating, isSeries }: GameRatingBlockProps) {
  return (
    <div className='rating-block'>
      <h3>{title}</h3>
      <PlaytimeRating value={rating?.value} />
      <GamePositions rating={rating} isSeries={isSeries} />
    </div>
  );
}

/**
 * @param props
 * @param props.game - Game with detailed ratings and playtime.
 * @returns Blocks with ratings values and their positions among all games and own series.
 */
export default function GameRatings({ game }: GameRatingsProps) {
  const isSeries = !!game.series;

  return (
    <section id='game-title-page__ratings'>
      <GameRatingBlock
        title='Your rating'
        rating={game.rating}
        isSeries={isSeries}
      />

      <GameRatingBlock
        title='Critics rating'
        rating={game.criticsRating}
        isSeries={isSeries}
      />

      <GameRatingBlock
        title='Users rating'
        rating={game.usersRating}
        isSeries={isSeries}
      />

      <GamePlaytimeBlock
        title='Playtime'
        rating={game.hours}
        isSeries={isSeries}
      />
    </section>
  );
}
