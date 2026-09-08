'use client';

import Game from '@ts/games/game';
import { MetricContentProps } from '@ts/games/metric';
import { SeriesCollapsed } from '@ts/games/series';
import { MetricResponse } from '@ts/requests';

import { getMetricClient } from '@lib/actions';
import ObjectMapArray from '@lib/object-map-array';

import Skeleton from '@components/Skeleton';
import EmptyImage from '@components/data-blocks/EmptyImage';
import GameCover from '@components/data-blocks/GameCover';
import MetricWrapper from '@components/data-blocks/MetricWrapper';
import MultipleRating from '@components/data-blocks/MultipleRatings';
import PropBlock from '@components/data-blocks/PropBlock';

import FetchMetric from '../../components/FetchMetric';
import { MAX_GAMES_IN_SERIES } from '../utils';

type TopSeriesProps = {
  series: SeriesCollapsed;
  games: ObjectMapArray<Game, 'id'>;
};

type TopSeriesSkeletonProps = {
  parentKey: string;
};

const MAX_SERIES_SKELETONS = 5;

const fetchTopSeries = async (params: {
  userId: string;
}): Promise<MetricResponse<SeriesCollapsed[]>> => {
  const seriesData = await getMetricClient<SeriesCollapsed[]>(
    '/api/games/titles/series',
    params
  );

  return {
    error: seriesData.error,
    data: seriesData.data
  };
};

function TopSeries({ series, games }: TopSeriesProps) {
  const seriesGames = series.games
    .slice(0, MAX_GAMES_IN_SERIES)
    .map((game) => games.findByKey(game));
  const percent = Math.round((seriesGames.length / series.allGames) * 100);

  return (
    <div className='data-block series-block'>
      <h4 className='colored'>{series.name}</h4>

      <div className='series-games-collage'>
        {Array.from({ length: MAX_GAMES_IN_SERIES }).map((_, i) =>
          seriesGames[i] ? (
            <GameCover
              key={`series-game-cover-${i}`}
              game={seriesGames[i]}
              className={`series-game-${i}`}
            />
          ) : (
            <EmptyImage
              key={`series-empty-cover-${i}`}
              className={`game-cover series-game-${i}`}
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

      <div className='data-block-grid min'>
        <PropBlock title='Developers'>
          {series.developers.length
            ? series.developers.map((dev) => dev.name).join(', ')
            : '—'}
        </PropBlock>

        <PropBlock title='Publishers'>
          {series.publishers.length
            ? series.publishers.map((pub) => pub.name).join(', ')
            : '—'}
        </PropBlock>

        <PropBlock title='Games'>
          <span className='colored bold'>{seriesGames.length}</span>
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
    <div className='data-block series-block'>
      <Skeleton type='h4' />

      <div className='series-games-collage'>
        {Array.from({ length: MAX_GAMES_IN_SERIES }).map((_, i) => (
          <Skeleton
            key={`${parentKey}-series-game-cover-skeleton-${i}`}
            type='image'
            className={`game-cover series-game-${i}`}
          />
        ))}
      </div>

      <PropBlock title='Best game' className='min'>
        <Skeleton lineHeight='wide' />
      </PropBlock>

      <div className='data-block-grid min'>
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

export default function SeriesCount({
  metricId,
  games,
  userId
}: MetricContentProps) {
  return (
    <MetricWrapper id={metricId}>
      <FetchMetric
        fetchMetricData={fetchTopSeries}
        metric={(data) => (
          <div className='top-series'>
            {data.map((series) => (
              <TopSeries
                key={`${series.id}-series`}
                series={series}
                games={games}
              />
            ))}
          </div>
        )}
        fallback={<SeriesCountSkeleton />}
        params={{ userId }}
      />
    </MetricWrapper>
  );
}
