import Link from 'next/link';

import Game from '@ts/games/game';
import { StudioRatingMetric, StudioType } from '@ts/games/studio';

import ObjectMapArray from '@lib/object-map-array';
import { getMetricData } from '@lib/server-actions';

import EmptyMetric from '@components/data-blocks/EmptyMetric';
import GameCover from '@components/data-blocks/GameCover';
import MultipleRating from '@components/data-blocks/MultipleRatings';

import { StudiosTypeFields } from '../../utils';

type HighestRatedStudiosProps = {
  studios: ObjectMapArray<Game['developers'][number], 'id'>;
  type: StudioType;
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
        <Link href={`/games/titles/${topGame.id}`} className='small underline'>
          {topGame.name}
        </Link>
      </div>

      <MultipleRating
        usersRating={ratedStudio.usersRating}
        criticsRating={ratedStudio.criticsRating}
        userOwnRating={ratedStudio.averageRating}
      />
    </div>
  );
}

export default async function HighestRatedStudios({
  studios,
  type
}: HighestRatedStudiosProps) {
  const searchParams = new URLSearchParams({ field: StudiosTypeFields[type] });
  const studiosRatingData = await getMetricData<StudioRatingMetric[]>(
    `/api/games/studios/rating?${searchParams.toString()}`,
    []
  );

  if (!studiosRatingData.length)
    return <EmptyMetric message={`You haven't rated any game yet`} />;

  return (
    <div className='blocks-group'>
      {studiosRatingData.map((ratedStudio) => (
        <RatedStudio
          key={`${ratedStudio.id}-rated`}
          ratedStudio={ratedStudio}
          studio={studios.findByKey(ratedStudio.id)}
        />
      ))}
    </div>
  );
}
