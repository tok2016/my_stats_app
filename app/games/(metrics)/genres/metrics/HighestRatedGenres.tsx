import Link from 'next/link';

import Game from '@ts/games/game';
import { RatingData } from '@ts/games/metric';

import { getMetricData } from '@lib/server-actions';
import { getSingularOrPlural } from '@lib/utils';

import Rating from '@components/Rating';
import EmptyMetric from '@components/data-blocks/EmptyMetric';
import GameCover from '@components/data-blocks/GameCover';

type HighestRatedGenresProps = {
  genresMap: Map<number | string, Game['genres'][number]>;
};

type RatedGenreProps = {
  ratingData: RatingData;
  genre?: Game['genres'][number];
};

function RatedGenre({ ratingData, genre }: RatedGenreProps) {
  if (!genre) return;

  const topGame = ratingData.topGames[0];
  return (
    <div className='data-block genre-rating-block'>
      <div className='rating-title'>
        <Rating value={ratingData.rating} />
        <h4 className='colored'>{genre.name}</h4>
      </div>

      <div className='data-block-content'>
        <span className='min'>Best game:</span>

        <GameCover game={topGame} />

        <Link
          href={`/games/titles/${topGame.id}`}
          className='underline bold small'
        >
          {topGame.name}
        </Link>

        <span className='min'>
          {topGame.hours} {getSingularOrPlural(topGame.hours, 'hour', 'hours')}
        </span>
      </div>
    </div>
  );
}

export default async function HighestRatedGenres({
  genresMap
}: HighestRatedGenresProps) {
  const ratingData = await getMetricData<RatingData[]>(
    '/api/games/genres/rating',
    []
  );

  return !ratingData.length ? (
    <EmptyMetric message={`You haven't rated any game yet`} />
  ) : (
    <div className='blocks-group'>
      {ratingData.map((data) => (
        <RatedGenre
          key={`${data.id}-rating`}
          ratingData={data}
          genre={genresMap.get(data.id)}
        />
      ))}
    </div>
  );
}
