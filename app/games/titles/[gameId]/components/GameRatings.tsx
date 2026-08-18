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

function GamePositions({ rating, isSeries }: GamePositionsProps) {
  return (
    <div className='positions'>
      <div className='position'>
        <p className='position-number'>
          {rating ? rating.generalPosition : '—'}
        </p>
        <p className='position-label'>all games</p>
      </div>

      {isSeries && (
        <div className='position'>
          <p className='position-number'>
            {rating && rating.seriesPosition ? rating.seriesPosition : '—'}
          </p>
          <p className='position-label'>series</p>
        </div>
      )}
    </div>
  );
}

function GameRatingBlock({ title, rating, isSeries }: GameRatingBlockProps) {
  return (
    <div className='rating-block'>
      <h3>{title}</h3>
      <Rating value={rating?.value} />
      <GamePositions rating={rating} isSeries={isSeries} />
    </div>
  );
}

function GamePlaytimeBlock({ title, rating, isSeries }: GameRatingBlockProps) {
  return (
    <div className='rating-block'>
      <h3>{title}</h3>
      <PlaytimeRating value={rating?.value} />
      <GamePositions rating={rating} isSeries={isSeries} />
    </div>
  );
}

export default function GameRatings({ game }: GameRatingsProps) {
  const isSeries = !!game.series;

  return (
    <section id='game-ratings'>
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
