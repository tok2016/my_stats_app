import Link from 'next/link';

import Game from '@ts/games/game';
import { StudioRatingMetric, StudioType } from '@ts/games/studio';

import { getMetricData } from '@lib/server-actions';

import EmptyMetric from '@components/data-blocks/EmptyMetric';
import GameCover from '@components/data-blocks/GameCover';
import MultipleRating from '@components/data-blocks/MultipleRatings';

import { StudiosTypeFields } from '../utils';

type HighestRatedStudiosProps = {
  studiosMap: Map<number | string, Game['developers'][number]>;
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
        <Link href={`/games/title/${topGame.id}`} className='small underline'>
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
  studiosMap,
  type
}: HighestRatedStudiosProps) {
  const searchParams = new URLSearchParams({ field: StudiosTypeFields[type] });
  const studios = await getMetricData<StudioRatingMetric[]>(
    `/api/games/studios/rating?${searchParams.toString()}`,
    []
  );

  if (!studios.length)
    return <EmptyMetric message={`You haven't rated any game yet`} />;

  return (
    <div className='blocks-group'>
      {studios.map((ratedStudio) => (
        <RatedStudio
          key={`${ratedStudio.id}-rated`}
          ratedStudio={ratedStudio}
          studio={studiosMap.get(ratedStudio.id)}
        />
      ))}
    </div>
  );
}
