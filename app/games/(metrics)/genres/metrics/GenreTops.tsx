'use client';

import { useEffect, useMemo } from 'react';

import Game from '@ts/games/game';
import { GenreTop } from '@ts/games/genre';
import { GreatPeriod, MetricContentProps } from '@ts/games/metric';
import { Option } from '@ts/ui/components-props';

import { useAction } from '@lib/hooks';
import ObjectMapArray from '@lib/object-map-array';
import { getMetricData } from '@lib/server-actions';
import { GreatPeriods } from '@lib/utils';

import Select from '@components/Select';
import Table from '@components/charts/Table';
import GameTableTitle from '@components/data-blocks/GameTitle';
import MetricWrapper from '@components/data-blocks/MetricWrapper';
import RankIcon from '@components/data-blocks/RankIcon';

import GenreTopsSkeleton from '../skeletons/GenreTopsSkeleton';

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

const greatPeriodsLabels: Record<GreatPeriod, string> = {
  allTime: 'of all time',
  year: `of ${new Date().getFullYear()}`
};

const greatPeriodOptions: Option[] = GreatPeriods.map((period) => ({
  label: greatPeriodsLabels[period],
  value: period,
  key: period
}));

const getGenreTops = async (params?: GreatPeriod) => {
  const searchParams = new URLSearchParams({ period: params ?? '' });
  const genresTops = await getMetricData<GenreTop[]>(
    `/api/games/genres/topGames?${searchParams.toString()}`,
    []
  );

  return genresTops;
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

export default function GenreTops({ metricId, games }: MetricContentProps) {
  const [genresTops, updateGenresTops, isPending] = useAction(
    getGenreTops,
    null
  );

  const genres = useMemo(
    () =>
      games.flatMapByKey<Game['genres'][number], 'id'>(
        (game) => game.genres,
        'id'
      ),
    [games]
  );

  const onPeriodSelect = (value: string) => {
    updateGenresTops(value as GreatPeriod);
  };

  useEffect(() => {
    updateGenresTops('allTime');
  }, [updateGenresTops]);

  return isPending || !genresTops ? (
    <GenreTopsSkeleton />
  ) : (
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
      <div className='genres-tops'>
        {genresTops.map((genreTop, i) => (
          <GenreTopBlock
            key={`${genreTop.id}-top`}
            top={genreTop}
            games={games}
            genres={genres}
            index={i}
          />
        ))}
      </div>
    </MetricWrapper>
  );
}
