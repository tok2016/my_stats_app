'use client';

import { ChartPie, Table as TableIcon } from '@mynaui/icons-react';

import Link from 'next/link';

import { FieldsInfo } from '@ts/ui/charts-data';

import Chart from '@components/charts/Chart';
import SwitchableChart from '@components/charts/SwitchableChart';
import Table from '@components/charts/Table';

import { GenresPlaytimeData } from '../types';

type GenresPlaytimeChartProps = {
  data: GenresPlaytimeData[];
};

type GenresPlaytimeForDoughnut = Omit<GenresPlaytimeData, 'topGame'> & {
  topGame: string;
};

const playtimeFieldsNames: FieldsInfo<GenresPlaytimeForDoughnut> = {
  topGame: { name: 'Best game' },
  id: { name: 'ID' },
  hours: { name: 'Hours played' },
  count: { name: 'Games' },
  percent: { name: '%' },
  name: { name: 'Genre' },
  index: { name: '№' }
};

const genresPlaytimeRowContent = (data: GenresPlaytimeData) => {
  return (
    <>
      <span>{data.index}</span>
      <Link href={`/games/genres/${data.id}`} className='colored'>
        {data.name}
      </Link>
      <span>{data.count}</span>
      <Link href={`/games/series/${data.topGame.id}`} className='underline'>
        {data.topGame.name}
      </Link>
    </>
  );
};

export default function GenresPlaytimeChart({
  data
}: GenresPlaytimeChartProps) {
  const doughnutData = data.map((value) => ({
    ...value,
    topGame: value.topGame.name
  }));

  return (
    <SwitchableChart
      chartsOptions={[
        {
          chart: (
            <Chart
              chartId='genres-playtime'
              type='doughnut'
              data={doughnutData}
              defaultValueField='hours'
              valueFields={['hours']}
              fieldsNames={playtimeFieldsNames}
              displayFields={['hours', 'topGame']}
            />
          ),
          icon: <ChartPie />
        },
        {
          chart: (
            <Table
              id='genres-playtime-table'
              data={data}
              headers={{
                index: '№',
                name: 'Genre',
                hours: 'Hours',
                topGame: 'Biggest game'
              }}
              rowContent={genresPlaytimeRowContent}
            />
          ),
          icon: <TableIcon />
        }
      ]}
    />
  );
}
