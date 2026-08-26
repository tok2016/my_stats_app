import { Suspense } from 'react';

import Game from '@ts/games/game';

import { getGames } from '@lib/server-actions';

import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import Metric from '@components/data-blocks/Metric';

import GenreTops from './metrics/GenreTops';
import GenresCount from './metrics/GenresCount';
import GenresPeriodTops from './metrics/GenresPeriodTops';
import GenresPlaytime from './metrics/GenresPlaytime';
import HighestRatedGenres from './metrics/HighestRatedGenres';
import RecommendedGames from './metrics/RecommendedGames';
import HighestRatedGenresSkeleton from './skeletons/HighestRatedGenresSkeleton';
import RecommendedGamesSkeletons from './skeletons/RecommendedGamesSkeletons';

export default async function GamesGenresPage() {
  const games = await getGames();
  const genresMap = games.flatMapByKey<Game['genres'][number], 'id'>(
    (game) => game.genres,
    'id'
  );
  const seriesMap = games.mapByKey<Game['series'], 'id'>(
    (game) => game.series,
    'id'
  );

  return (
    <>
      <div className='double-doughnut'>
        <Metric id='biggest-genres' title='Your biggest genres'>
          <Suspense
            fallback={
              <ChartSkeleton type='doughnut' className='switchable-chart' />
            }
          >
            <GenresCount genres={genresMap} seriesArray={seriesMap} />
          </Suspense>
        </Metric>

        <Metric id='longest-genres' title='Your longest played genres'>
          <Suspense
            fallback={
              <ChartSkeleton type='doughnut' className='switchable-chart' />
            }
          >
            <GenresPlaytime genres={genresMap} />
          </Suspense>
        </Metric>
      </div>

      <GenresPeriodTops genres={genresMap.toArray()} />
      <GenreTops genres={genresMap.toArray()} games={games.toArray()} />

      <Metric id='rated-genres' title='Your highest rated genres'>
        <Suspense fallback={<HighestRatedGenresSkeleton />}>
          <HighestRatedGenres genres={genresMap} />
        </Suspense>
      </Metric>

      <Suspense fallback={<RecommendedGamesSkeletons />}>
        <RecommendedGames />
      </Suspense>
    </>
  );
}
