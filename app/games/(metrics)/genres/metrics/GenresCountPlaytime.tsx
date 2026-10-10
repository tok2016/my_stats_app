'use client';

import { MetricCoreProps } from '@ts/games/metric';

import MetricWrapper from '@components/data-blocks/MetricWrapper';

import GenresCount from './GenresCount';
import GenresPlaytime from './GenresPlaytime';

/**
 * @param props - Metrics props with genre and series data.
 * @returns Metric of top genres by games count and playtime as 2 submetrics.
 */
export default function GenresCountPlaytime(props: MetricCoreProps) {
  return (
    <MetricWrapper id='genres-count-playtime'>
      <div className='double-doughnut'>
        <GenresCount {...props} />
        <GenresPlaytime {...props} />
      </div>
    </MetricWrapper>
  );
}
