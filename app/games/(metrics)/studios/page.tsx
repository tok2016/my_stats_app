import { Suspense } from 'react';

import Game from '@ts/games/game';

import { getGamesMap } from '@lib/server-actions';

import Metric from '@components/data-blocks/Metric';

import { getItemsMap } from '@app/games/lib/actions';

import HighestRatedStudios from './metrics/HighestRatedStudios';
import StudiosCount from './metrics/StudiosCount';
import StudiosCountries from './metrics/StudiosCountries';
import StudiosPeriodTops from './metrics/StudiosPeriodTops';

const isIgdbStudioBase = (
  value: unknown
): value is Game['developers'][number] =>
  typeof (value as Game['developers'][number])?.name !== 'undefined';

export default async function GameStudiosPage() {
  const gamesMap = await getGamesMap();

  const developersMap = await getItemsMap<Game['developers'][number]>(
    gamesMap,
    'developers',
    isIgdbStudioBase
  );

  const publishersMap = await getItemsMap<Game['publishers'][number]>(
    gamesMap,
    'publishers',
    isIgdbStudioBase
  );

  return (
    <>
      <Metric id='developers-count' title='Your favorite developers'>
        <Suspense>
          <StudiosCount studiosMap={developersMap} type='developer' />
        </Suspense>
      </Metric>

      <Metric id='publishers-count' title='Your favorite publishers'>
        <Suspense>
          <StudiosCount studiosMap={publishersMap} type='publisher' />
        </Suspense>
      </Metric>

      <StudiosPeriodTops
        developersMap={developersMap}
        publishersMap={publishersMap}
      />

      <Metric id='developers-rating' title='Your highest rated developers'>
        <Suspense>
          <HighestRatedStudios studiosMap={developersMap} type='developer' />
        </Suspense>
      </Metric>

      <Metric id='publishers-rating' title='Your highest rated publishers'>
        <Suspense>
          <HighestRatedStudios studiosMap={publishersMap} type='publisher' />
        </Suspense>
      </Metric>

      <Metric
        id='developers-countries'
        title='Your favorite developers around the world'
      >
        <Suspense>
          <StudiosCountries developersMap={developersMap} />
        </Suspense>
      </Metric>
    </>
  );
}
