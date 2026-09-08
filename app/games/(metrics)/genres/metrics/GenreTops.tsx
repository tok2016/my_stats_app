'use client';

import { useState } from 'react';

import Game from '@ts/games/game';
import { GenreTop } from '@ts/games/genre';
import { GreatPeriod, MetricContentProps } from '@ts/games/metric';
import { MetricResponse } from '@ts/requests';
import { Option } from '@ts/ui/components-props';

import { getMetricClient } from '@lib/actions';
import ObjectMapArray from '@lib/object-map-array';
import { GreatPeriods } from '@lib/utils';

import Select from '@components/Select';
import Skeleton from '@components/Skeleton';
import Table from '@components/charts/Table';
import GameTableTitle from '@components/data-blocks/GameTitle';
import MetricWrapper from '@components/data-blocks/MetricWrapper';
import RankIcon from '@components/data-blocks/RankIcon';

import FetchMetric from '../../components/FetchMetric';

type GenreTopBlockProps = {
  top: GenreTop;
  games: ObjectMapArray<Game, 'id'>;
  genres: ObjectMapArray<Game['genres'][number], 'id'>;
  index: number;
};

type GenreTopTableData = {
  id: string;
  index: number;
  name: string;
  hours: number;
  coverUrl?: string;
};

type GenreTopExpanded = {
  period: GreatPeriod;
  tops: GenreTop[];
};

type FetchGenreTopParams = {
  userId: string;
  period: GreatPeriod;
};

const SKELETONS_COUNT = 3;
const TABLE_ROWS_COUNT = 5;

const greatPeriodsLabels: Record<GreatPeriod, string> = {
  allTime: 'of all time',
  year: `of ${new Date().getFullYear()}`
};

const greatPeriodOptions: Option[] = GreatPeriods.map((period) => ({
  label: greatPeriodsLabels[period],
  value: period,
  key: period
}));

const fetchGenreTops = async (
  params: FetchGenreTopParams
): Promise<MetricResponse<GenreTopExpanded>> => {
  const genresTops = await getMetricClient<GenreTop[]>(
    '/api/games/genres/topGames',
    params
  );

  return {
    error: genresTops.error,
    data: !genresTops.data
      ? undefined
      : {
          period: params.period,
          tops: genresTops.data
        }
  };
};

function GenreTopBlock({ top, games, genres, index }: GenreTopBlockProps) {
  const genre = genres.findByKey(top.id);
  if (!genre) return;

  const tableData: GenreTopTableData[] = top.topGames
    .map((gameId) => games.findByKey(gameId))
    .filter((game) => !!game)
    .map((game, i) => ({
      id: game.id,
      index: i,
      name: game.name,
      hours: game.hours,
      coverUrl: game.coverUrl
    }));

  return (
    <div className='genre-top'>
      <div className='genre-top-title colored'>
        <RankIcon rank={index} />
        <h4>{genre.name}</h4>
      </div>

      <Table
        id={`${genre}-top-table`}
        data={tableData}
        headers={{
          index: {
            title: '№',
            width: '1rem',
            renderRow: (value) => <span>{value.index + 1}</span>
          },
          name: {
            title: 'Game',
            width: '1fr',
            renderRow: (value) => <GameTableTitle game={value} />
          },
          hours: {
            title: 'Hours',
            width: '3rem',
            renderRow: (value) => <span className='hours'>{value.hours}</span>
          }
        }}
      />
    </div>
  );
}

export function GenreTopsSkeleton() {
  return (
    <div className='genres-tops'>
      {Array.from({ length: SKELETONS_COUNT }).map((_, i) => (
        <div className='genre-top' key={`genre-top-skeleton-${i}`}>
          <Skeleton type='h4' />
          <Skeleton
            type='tablet'
            unitClassName='game-row-skeleton'
            rows={TABLE_ROWS_COUNT}
          />
        </div>
      ))}
    </div>
  );
}

export default function GenreTops({
  metricId,
  games,
  userId
}: MetricContentProps) {
  const [period, setPeriod] = useState<GreatPeriod>('allTime');
  const genres = games.flatMapByKey<Game['genres'][number], 'id'>(
    (game) => game.genres,
    'id'
  );

  const onPeriodSelect = (value: string) => {
    setPeriod(value as GreatPeriod);
  };

  return (
    <MetricWrapper
      id={metricId}
      renderTitle={(title) => (
        <span className='select-title'>
          {title}
          <Select
            id='genres-top-period'
            name='genres-top-period'
            defaultValue='allTime'
            variant='text'
            options={greatPeriodOptions}
            onSelect={onPeriodSelect}
          />
        </span>
      )}
    >
      <FetchMetric
        fetchMetricData={fetchGenreTops}
        fallback={<GenreTopsSkeleton />}
        metric={(data) => (
          <div className='genres-tops'>
            {data.tops.map((genreTop, i) => (
              <GenreTopBlock
                key={`${genreTop.id}-top`}
                top={genreTop}
                games={games}
                genres={genres}
                index={i}
              />
            ))}
          </div>
        )}
        params={{ userId, period }}
      />
    </MetricWrapper>
  );
}
