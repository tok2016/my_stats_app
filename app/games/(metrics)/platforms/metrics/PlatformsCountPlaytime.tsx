'use client';

import { MetricCoreProps } from '@ts/games/metric';

import MetricWrapper from '@components/data-blocks/MetricWrapper';

import PlatformsCount from './PlatformsCount';
import PlatformsPlaytime from './PlatformsPlaytime';

/**
 * @param props - Metrics props with platforms, genre and series data.
 * @returns Metric of top platforms by games count and playtime as 2 submetrics.
 */
export default function PlatformsCountPlaytime(props: MetricCoreProps) {
  return (
    <MetricWrapper id='platforms-count-playtime'>
      <div className='double-doughnut'>
        <PlatformsCount {...props} />
        <PlatformsPlaytime {...props} />
      </div>
    </MetricWrapper>
  );
}
