'use client';

import Game from '@ts/games/game';
import { StudioRatingMetric } from '@ts/games/studio';
import { MetricResponse } from '@ts/requests';

import { getMetricClient } from '@lib/actions';

import Skeleton from '@components/Skeleton';
import GameCover from '@components/data-blocks/GameCover';
import MetricWrapper from '@components/data-blocks/MetricWrapper';
import MultipleRating from '@components/data-blocks/MultipleRatings';

import FetchMetric from '../../components/FetchMetric';
import { StudiosGameCoreFields, StudiosGameFields } from '../../utils';
import { FetchStudiosParams, StudiosMetricContentProps } from '../types';

type RatedStudioProps = {
  ratedStudio: StudioRatingMetric;
  studio?: Game['developers'][number];
};

const MAX_SKELETONS_BLOCKS = 5;

function RatedStudio({ ratedStudio, studio }: RatedStudioProps) {
  if (!studio) return;

  const topGame = ratedStudio.topGames[0];

  if (!topGame) return;

  return (
    <div className='data-block rated-studio'>
      <h3 className='colored'>{studio.name}</h3>

      <div className='data-block-content'>
        <span className='min'>Best game:</span>
        <GameCover game={topGame} />
        <span className='small underline'>{topGame.name}</span>
      </div>

      <MultipleRating
        usersRating={ratedStudio.usersRating}
        criticsRating={ratedStudio.criticsRating}
        userOwnRating={ratedStudio.averageRating}
      />
    </div>
  );
}

const fetchStudiosRatings = async (
  params: FetchStudiosParams
): Promise<MetricResponse<StudioRatingMetric[]>> => {
  const studiosRatingData = await getMetricClient<StudioRatingMetric[]>(
    '/api/games/studios/rating',
    params
  );

  return {
    error: studiosRatingData.error,
    data: studiosRatingData.data
  };
};

export function StudiosRatingsSkeleton() {
  return (
    <div className='blocks-group'>
      {Array.from({ length: MAX_SKELETONS_BLOCKS }).map((_, i) => (
        <div
          key={`$rated-studio-skeleton-${i}`}
          className='data-block rated-studio'
        >
          <Skeleton type='h3' />

          <div className='data-block-content'>
            <span className='min'>Best game:</span>
            <Skeleton type='image' className='game-cover' />
            <Skeleton />
          </div>

          <MultipleRating />
        </div>
      ))}
    </div>
  );
}

export default function StudiosRatings({
  games,
  metricId,
  type,
  userId
}: StudiosMetricContentProps) {
  const studios = games.flatMapByKey<Game['developers'][number], 'id'>(
    (game) => game[StudiosGameFields[type]],
    'id'
  );

  return (
    <MetricWrapper id={metricId}>
      <FetchMetric
        fetchMetricData={fetchStudiosRatings}
        metric={(data) => (
          <div className='blocks-group'>
            {data.map((ratedStudio) => (
              <RatedStudio
                key={`${ratedStudio.id}-rated`}
                ratedStudio={ratedStudio}
                studio={studios.findByKey(ratedStudio.id)}
              />
            ))}
          </div>
        )}
        fallback={<StudiosRatingsSkeleton />}
        params={{ userId, field: StudiosGameCoreFields[type] }}
      />
    </MetricWrapper>
  );
}
