'use client';

import { useEffect } from 'react';

import Game from '@ts/games/game';
import { GenreTop } from '@ts/games/genre';
import { GreatPeriod } from '@ts/games/metric';
import { Option } from '@ts/ui/components-props';

import { useAction } from '@lib/hooks';
import { getMetricData } from '@lib/server-actions';
import { GreatPeriods } from '@lib/utils';

import Select from '@components/Select';
import Table from '@components/charts/Table';
import GameTableTitle from '@components/data-blocks/GameTitle';
import RankIcon from '@components/data-blocks/RankIcon';

import GenreTopsSkeleton from '../skeletons/GenreTopsSkeleton';

type GenreTopsProps = {
  gamesMap: Map<number | string, Game>;
  genresMap: Map<number | string, Game['genres'][number]>;
};

type GenreTopBlockProps = {
  top: GenreTop;
  gamesMap: Map<number | string, Game>;
  genresMap: Map<number | string, Game['genres'][number]>;
  index: number;
};

type GenreTopTableData = {
  id: string;
  index: number;
  name: string;
  hours: number;
  cover?: string;
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

function GenreTopBlock({
  top,
  gamesMap,
  genresMap,
  index
}: GenreTopBlockProps) {
  const genre = genresMap.get(top.id);
  if (!genre) return;

  const tableData: GenreTopTableData[] = top.topGames
    .map((gameId) => gamesMap.get(gameId))
    .filter((game) => !!game)
    .map((game, i) => ({
      id: game.id,
      index: i,
      name: game.name,
      hours: game.hours,
      cover: game.cover
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

export default function GenreTops({ gamesMap, genresMap }: GenreTopsProps) {
  const [genresTops, updateGenresTops, isPending] = useAction(
    getGenreTops,
    null
  );

  const onPeriodSelect = (value: string) => {
    updateGenresTops(value as GreatPeriod);
  };

  useEffect(() => {
    updateGenresTops('allTime');
  }, [updateGenresTops]);

  return (
    <section className='metric'>
      <h3 className='select-title'>
        Your top-5 games by genre
        <Select
          id='genres-top-period'
          name='genres-top-period'
          defaultValue='allTime'
          variant='text'
          options={greatPeriodOptions}
          onSelect={onPeriodSelect}
        />
      </h3>

      {isPending || !genresTops ? (
        <GenreTopsSkeleton />
      ) : (
        <div className='genres-tops'>
          {genresTops.map((genreTop, i) => (
            <GenreTopBlock
              key={`${genreTop.id}-top`}
              top={genreTop}
              gamesMap={gamesMap}
              genresMap={genresMap}
              index={i}
            />
          ))}
        </div>
      )}
    </section>
  );
}
