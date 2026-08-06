import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import Metric from '@components/data-blocks/Metric';
import PeriodTopsSkeletons from '@components/data-blocks/PeriodTopsSkeletons';

import GenreTopsSkeleton from './skeletons/GenreTopsSkeleton';
import HighestRatedGenresSkeleton from './skeletons/HighestRatedGenresSkeleton';
import RecommendedGamesSkeletons from './skeletons/RecommendedGamesSkeletons';

export default function GenresLoading() {
  return (
    <>
      <div className='double-doughnut'>
        <Metric id='biggest-genres' title='Your biggest genres'>
          <ChartSkeleton type='doughnut' />
        </Metric>

        <Metric id='longest-genres' title='Your longest played genres'>
          <ChartSkeleton type='doughnut' />
        </Metric>
      </div>

      <PeriodTopsSkeletons metricId='genres-periods' />

      <GenreTopsSkeleton />

      <Metric id='rated-genres' title='Your highest rated genres'>
        <HighestRatedGenresSkeleton />
      </Metric>

      <RecommendedGamesSkeletons />
    </>
  );
}
