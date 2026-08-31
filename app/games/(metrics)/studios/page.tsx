import { Suspense } from 'react';

import Game from '@ts/games/game';

import { getGames } from '@lib/server-actions';

import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import MetricWrapper from '@components/data-blocks/MetricWrapper';

import HighestRatedStudios from './metrics/HighestRatedStudios';
import StudiosCount from './metrics/StudiosCount';
import StudiosCountries from './metrics/StudiosCountries';
import StudiosPeriodTops from './metrics/StudiosPeriodTops';
import HighestRatedStudiosSkeleton from './skeletons/HighestRatedStudiosSkeleton';
import StudiosCountSkeleton from './skeletons/StudiosCountSkeleton';

export default async function GamesStudiosPage() {
  const games = await getGames();
  const developers = games.flatMapByKey<Game['developers'][number], 'id'>(
    (game) => game.developers,
    'id'
  );
  const publishers = games.flatMapByKey<Game['publishers'][number], 'id'>(
    (game) => game.publishers,
    'id'
  );

  return (
    <>
      <MetricWrapper id='developers-count' title='Your favorite developers'>
        <Suspense fallback={<StudiosCountSkeleton />}>
          <StudiosCount studios={developers} type='developer' />
        </Suspense>
      </MetricWrapper>

      <MetricWrapper id='publishers-count' title='Your favorite publishers'>
        <Suspense fallback={<StudiosCountSkeleton />}>
          <StudiosCount studios={publishers} type='publisher' />
        </Suspense>
      </MetricWrapper>

      <StudiosPeriodTops
        developers={developers.toArray()}
        publishers={publishers.toArray()}
      />

      <MetricWrapper
        id='developers-rating'
        title='Your highest rated developers'
      >
        <Suspense fallback={<HighestRatedStudiosSkeleton />}>
          <HighestRatedStudios studios={developers} type='developer' />
        </Suspense>
      </MetricWrapper>

      <MetricWrapper
        id='publishers-rating'
        title='Your highest rated publishers'
      >
        <Suspense fallback={<HighestRatedStudiosSkeleton />}>
          <HighestRatedStudios studios={publishers} type='publisher' />
        </Suspense>
      </MetricWrapper>

      <MetricWrapper
        id='developers-countries'
        title='Your favorite developers around the world'
      >
        <Suspense fallback={<ChartSkeleton type='map' />}>
          <StudiosCountries developers={developers} />
        </Suspense>
      </MetricWrapper>
    </>
  );
}
