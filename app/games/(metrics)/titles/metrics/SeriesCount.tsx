'use client';

import { MetricCoreProps } from '@ts/games/metric';
import { SeriesCollapsed } from '@ts/games/series';
import { MetricResponse } from '@ts/requests';

import { getMetricClient } from '@lib/actions';

import BlankImage from '@components/BlankImage';
import Skeleton from '@components/Skeleton';
import GameCover from '@components/data-blocks/GameCover';
import MetricWrapper from '@components/data-blocks/MetricWrapper';
import MultipleRating from '@components/data-blocks/MultipleRatings';
import PropBlock from '@components/data-blocks/PropBlock';

import FetchMetric from '../../components/FetchMetric';
import { MAX_GAMES_IN_SERIES } from '../../utils';

type TopSeriesProps = {
  series: SeriesCollapsed;
};

type TopSeriesSkeletonProps = {
  parentKey: string;
};

const MAX_SERIES_SKELETONS = 5;
const MAX_STUDIOS = 4;

/**
 * @param params - Search params with user id.
 * @returns Top series by games count that user's played or error data.
 */
const fetchTopSeries = async (params: {
  userId: string;
}): Promise<MetricResponse<SeriesCollapsed[]>> => {
  const seriesData = await getMetricClient<SeriesCollapsed[]>(
    '/api/games/titles/topSeries',
    params
  );

  return {
    error: seriesData.error,
    data: seriesData.data
  };
};

/**
 * @param props
 * @param props.series - Full series data.
 * @returns Data block with series data.
 */
function TopSeries({ series }: TopSeriesProps) {
  const seriesGames = series.games.slice(0, MAX_GAMES_IN_SERIES);
  const percent = Math.round((series.games.length / series.allGames) * 100);

  return (
    <div className='data-block data-block--top-series'>
      <h4 className='colored'>{series.name}</h4>

      <div className='series-games-collage'>
        {Array.from({ length: MAX_GAMES_IN_SERIES }).map((_, i) =>
          seriesGames[i] ? (
            <GameCover
              key={`series-games-collage__cover-${i}`}
              game={seriesGames[i]}
              className={`series-games-collage__cover-${i}`}
            />
          ) : (
            <BlankImage
              key={`series-blank-image-${i}`}
              className={`game-cover series-games-collage__cover-${i}`}
            />
          )
        )}
      </div>

      <PropBlock title='Best game' className='min'>
        {seriesGames[0] ? (
          <span className='wide'>{seriesGames[0].name}</span>
        ) : (
          <span>—</span>
        )}
      </PropBlock>

      <div className='data-block__props-grid min'>
        <PropBlock title='Developers'>
          {series.developers.length
            ? series.developers
                .slice(0, MAX_STUDIOS)
                .map((dev) => dev.name)
                .join(', ')
              + (series.developers.length > MAX_STUDIOS ? ',..' : '')
            : '—'}
        </PropBlock>

        <PropBlock title='Publishers'>
          {series.publishers.length
            ? series.publishers
                .slice(0, MAX_STUDIOS)
                .map((pub) => pub.name)
                .join(', ')
              + (series.publishers.length > MAX_STUDIOS ? ',..' : '')
            : '—'}
        </PropBlock>

        <PropBlock title='Games'>
          <span className='colored bold'>{series.games.length}</span>
          <span>{` (${percent}%)`}</span>
        </PropBlock>

        <PropBlock title='Playtime'>
          <span className='colored bold'>{series.hours} h.</span>
        </PropBlock>
      </div>

      <MultipleRating
        userOwnRating={series.averageRating}
        usersRating={series.usersRating}
        criticsRating={series.criticsRating}
      />
    </div>
  );
}

function TopSeriesSkeleton({ parentKey }: TopSeriesSkeletonProps) {
  return (
    <div className='data-block data-block--top-series'>
      <Skeleton type='h4' />

      <div className='series-games-collage'>
        {Array.from({ length: MAX_GAMES_IN_SERIES }).map((_, i) => (
          <Skeleton
            key={`${parentKey}-series-games-collage__cover-cover-skeleton-${i}`}
            type='image'
            className={`game-cover series-games-collage__cover-${i}`}
          />
        ))}
      </div>

      <PropBlock title='Best game' className='min'>
        <Skeleton lineHeight='wide' />
      </PropBlock>

      <div className='data-block__props-grid min'>
        <PropBlock title='Developers'>
          <Skeleton lineHeight='wide' rows={2} />
        </PropBlock>

        <PropBlock title='Publishers'>
          <Skeleton lineHeight='wide' rows={2} />
        </PropBlock>

        <PropBlock title='Games'>
          <Skeleton />
        </PropBlock>

        <PropBlock title='Playtime'>
          <Skeleton />
        </PropBlock>
      </div>

      <MultipleRating />
    </div>
  );
}

export function SeriesCountSkeleton() {
  return (
    <div className='top-series'>
      {Array.from({ length: MAX_SERIES_SKELETONS }).map((_, i) => (
        <TopSeriesSkeleton
          key={`top-series-skeleton-${i}`}
          parentKey={`top-series-skeleton-${i}`}
        />
      ))}
    </div>
  );
}

/**
 * @param props
 * @param props.userId - User whose metrics will be fetched.
 * @returns Metric component of top series by games count that user's played.
 */
export default function SeriesCount({ userId }: MetricCoreProps) {
  return (
    <MetricWrapper id='top-series'>
      <FetchMetric
        fetchMetricData={fetchTopSeries}
        metric={(data) => (
          <div className='top-series'>
            {data.map((series) => (
              <TopSeries key={`${series.id}-series`} series={series} />
            ))}
          </div>
        )}
        fallback={<SeriesCountSkeleton />}
        params={{ userId }}
      />
    </MetricWrapper>
  );
}
