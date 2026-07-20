import Link from 'next/link';

import Game from '@ts/games/game';
import { RatingData } from '@ts/games/metric';

import { getImageUrl } from '@lib/games/igdb';
import { getMetricData } from '@lib/server-actions';
import { MINUTES, getSingularOrPlural } from '@lib/utils';

import Rating from '@components/Rating';
import GameCover from '@components/data-blocks/GameCover';

type HighestRatedGenresProps = {
  genresMap: Map<number | string, Game['genres'][number]>;
};

type RatedGenreProps = {
  ratingData: RatingData;
  genre?: Game['genres'][number];
};

const ratingMockData: RatingData[] = [
  {
    id: 8,
    rating: 85,
    topGames: [
      {
        id: '6984ae589ef387f573e7dc26',
        name: 'Psychonauts',
        apiId: 1339,
        minutes: 19 * 60,
        cover: getImageUrl('cob7ms', 'cover_big')
      }
    ]
  },
  {
    id: 32,
    rating: 83,
    topGames: [
      {
        id: '6984ae589ef387f573e7dc27',
        name: 'VVVVVV',
        apiId: 1990,
        minutes: 120,
        cover: getImageUrl('co4ieg', 'cover_big')
      }
    ]
  },
  {
    id: 9,
    rating: 82,
    topGames: [
      {
        id: '6984ae589ef387f573e7dc28',
        name: 'Fez',
        apiId: 1991,
        minutes: 8 * 60,
        cover: getImageUrl('co1rd9', 'cover_big')
      }
    ]
  },
  {
    id: 15,
    rating: 79,
    topGames: [
      {
        id: '6984ae589ef387f573e7dc30',
        name: 'SteamWorld Heist',
        apiId: 15167,
        minutes: 16 * 60,
        cover: getImageUrl('cob1ue', 'cover_big')
      }
    ]
  },
  {
    id: 5,
    rating: 77,
    topGames: [
      {
        id: '6984ae589ef387f573e7dc2c',
        name: 'Doom',
        apiId: 7351,
        minutes: 14 * 60,
        cover: getImageUrl('co1nc7', 'cover_big')
      }
    ]
  }
];

function RatedGenre({ ratingData, genre }: RatedGenreProps) {
  if (!genre) return;

  const topGame = ratingData.topGames[0];
  const hours = Math.round(topGame.minutes / MINUTES);
  return (
    <div key={ratingData.id} className='data-block genre-rating-block'>
      <div className='data-block-title'>
        <Rating value={ratingData.rating} />
        <h4 className='colored'>{genre.name ?? ''}</h4>
      </div>

      <div className='data-block-content'>
        <span className='min'>Best game:</span>

        <GameCover game={topGame} />

        <Link
          href={`/games/title/${topGame.id}`}
          className='underline bold small'
        >
          {topGame.name}
        </Link>

        <span className='min'>
          {hours} {getSingularOrPlural(hours, 'hour', 'hours')}
        </span>
      </div>
    </div>
  );
}

export default async function HighestRatedGenres({
  genresMap
}: HighestRatedGenresProps) {
  // const ratingData = await getMetricData<RatingData[]>(
  //   '/api/games/genres/rating',
  //   []
  // );

  const ratingData = ratingMockData;

  return (
    <section className='metric'>
      <h3>Your highest rated genres</h3>
      <div className='blocks-group'>
        {ratingData.map((data) => (
          <RatedGenre
            key={`${data.id}-rating`}
            ratingData={data}
            genre={genresMap.get(data.id)}
          />
        ))}
      </div>
    </section>
  );
}
