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
import { StudiosGameCoreFields } from '../../utils';
import { FetchStudiosParams, StudiosMetricContentProps } from '../types';

type RatedStudioProps = {
  ratedStudio: StudioRatingMetric;
  studio?: Game['developers'][number];
};

const MAX_SKELETONS_BLOCKS = 5;

/**
 * @param props
 * @param props.ratedStudio - Studio data with rating and top game.
 * @param props.studio - Full studio data.
 * @returns Data block with studio rating data.
 */
function RatedStudio({ ratedStudio, studio }: RatedStudioProps) {
  if (!studio) return;

  const topGame = ratedStudio.topGames[0];

  if (!topGame) return;

  return (
    <div className='data-block data-block--studio-rating'>
      <h3 className='colored'>{studio.name}</h3>

      <div className='data-block__content'>
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

/**
 * @param params - Search params with user id.
 * @returns Top studios of given type by average rating or error data.
 */
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
    <div className='ratings-group'>
      {Array.from({ length: MAX_SKELETONS_BLOCKS }).map((_, i) => (
        <div
          key={`rated-studio-skeleton-${i}`}
          className='data-block data-block--studio-rating'
        >
          <Skeleton type='h3' />

          <div className='data-block__content'>
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

/**
 * @param props
 * @param props.studios - All studios of user's games.
 * @param props.userId - User whose metrics will be fetched.
 * @param props.type - Studio type: developer or publisher.
 * @returns Metric component of top studios of given type by average rating.
 */
export default function StudiosRatings({
  studios,
  type,
  userId
}: StudiosMetricContentProps) {
  return (
    <MetricWrapper
      id={type === 'developer' ? 'developers-rating' : 'publishers-rating'}
    >
      <FetchMetric
        fetchMetricData={fetchStudiosRatings}
        metric={(data) => (
          <div className='ratings-group'>
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
