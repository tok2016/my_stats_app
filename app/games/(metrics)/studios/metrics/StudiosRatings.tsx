import { Suspense } from 'react';

import Game from '@ts/games/game';
import { MetricId } from '@ts/games/metric';
import { StudioRatingMetric, StudioType } from '@ts/games/studio';

import ObjectMapArray from '@lib/object-map-array';
import { getMetricData } from '@lib/server-actions';

import EmptyMetric from '@components/data-blocks/EmptyMetric';
import GameCover from '@components/data-blocks/GameCover';
import MetricWrapper from '@components/data-blocks/MetricWrapper';
import MultipleRating from '@components/data-blocks/MultipleRatings';

import { StudiosGameCoreFields, StudiosGameFields } from '../../utils';
import StudiosRatingSkeleton from '../skeletons/StudiosRatingsSkeleton';
import { StudiosMetricContentProps } from '../types';

type HighestRatedStudiosProps = {
  metricId: MetricId;
  studios: ObjectMapArray<Game['developers'][number], 'id'>;
  type: StudioType;
  userId: string;
};

type RatedStudioProps = {
  ratedStudio: StudioRatingMetric;
  studio?: Game['developers'][number];
};

function RatedStudio({ ratedStudio, studio }: RatedStudioProps) {
  if (!studio) return;

  const topGame = ratedStudio.topGames[0];

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

async function HighestRatedStudios({
  metricId,
  studios,
  type,
  userId
}: HighestRatedStudiosProps) {
  const studiosRatingData = await getMetricData<StudioRatingMetric[]>(
    '/api/games/studios/rating',
    [],
    userId,
    {
      field: StudiosGameCoreFields[type]
    }
  );

  return (
    <MetricWrapper id={metricId}>
      {!studiosRatingData.length ? (
        <EmptyMetric message={`You haven't rated any game yet`} />
      ) : (
        <div className='blocks-group'>
          {studiosRatingData.map((ratedStudio) => (
            <RatedStudio
              key={`${ratedStudio.id}-rated`}
              ratedStudio={ratedStudio}
              studio={studios.findByKey(ratedStudio.id)}
            />
          ))}
        </div>
      )}
    </MetricWrapper>
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
    <Suspense fallback={<StudiosRatingSkeleton metricId={metricId} />}>
      <HighestRatedStudios
        type={type}
        metricId={metricId}
        studios={studios}
        userId={userId}
      />
    </Suspense>
  );
}
