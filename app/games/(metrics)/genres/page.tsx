import { Suspense } from 'react';

import Game from '@ts/games/game';

import { getGamesMap } from '@lib/server-actions';

import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import Metric from '@components/data-blocks/Metric';

import { getItemsMap } from '@app/games/lib/actions';

import { isIgdbGenre, isIgdbSeries } from '../utils';
import GenreTops from './metrics/GenreTops';
import GenresCount from './metrics/GenresCount';
import GenresPeriodTops from './metrics/GenresPeriodTops';
import GenresPlaytime from './metrics/GenresPlaytime';
import HighestRatedGenres from './metrics/HighestRatedGenres';
import RecommendedGames from './metrics/RecommendedGames';
import HighestRatedGenresSkeleton from './skeletons/HighestRatedGenresSkeleton';
import RecommendedGamesSkeletons from './skeletons/RecommendedGamesSkeletons';

export default async function GamesGenresPage() {
  const gamesMap = await getGamesMap();
  const genresMap = await getItemsMap<Game['genres'][number]>(
    gamesMap,
    'genres',
    isIgdbGenre
  );
  const seriesMap = await getItemsMap<NonNullable<Game['series']>>(
    gamesMap,
    'series',
    isIgdbSeries
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
            <GenresCount genresMap={genresMap} seriesMap={seriesMap} />
          </Suspense>
        </Metric>

        <Metric id='longest-genres' title='Your longest played genres'>
          <Suspense
            fallback={
              <ChartSkeleton type='doughnut' className='switchable-chart' />
            }
          >
            <GenresPlaytime genresMap={genresMap} />
          </Suspense>
        </Metric>
      </div>

      <GenresPeriodTops genresMap={genresMap} />
      <GenreTops genresMap={genresMap} gamesMap={gamesMap} />

      <Metric id='rated-genres' title='Your highest rated genres'>
        <Suspense fallback={<HighestRatedGenresSkeleton />}>
          <HighestRatedGenres genresMap={genresMap} />
        </Suspense>
      </Metric>

      <Suspense fallback={<RecommendedGamesSkeletons />}>
        <RecommendedGames />
      </Suspense>
    </>
  );
}
