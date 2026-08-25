'use client';

import Link from 'next/link';

import { StudioType } from '@ts/games/studio';

import AdjacentChart from '@components/charts/AdjacentChart';
import Chart from '@components/charts/Chart';
import Table from '@components/charts/Table';

import { StudioCountData } from '../types';

type StudiosCountChartProps = {
  data: StudioCountData[];
  type: StudioType;
};

type StudioCountChartData = Omit<StudioCountData, 'topGame'> & {
  topGame: string;
};

const StudioTypeTitles: Record<StudioType, string> = {
  developer: 'Developer',
  publisher: 'Publisher'
};

export default function StudiosCountChart({
  type,
  data
}: StudiosCountChartProps) {
  const chartData: StudioCountChartData[] = data.map((value) => ({
    ...value,
    topGame: value.topGame.name
  }));

  return (
    <AdjacentChart>
      <Table
        id={`${type}-table`}
        data={data}
        headers={{
          index: {
            title: '№',
            width: '1.5rem',
            renderRow: (value) => value.index + 1
          },
          name: {
            title: StudioTypeTitles[type],
            width: '1fr',
            renderRow: (value) => (
              <Link
                href={`/games/studios/${value.id}`}
                data-rank={value.index}
                className='bold colored'
              >
                {value.name}
              </Link>
            )
          },
          count: {
            title: 'Games',
            width: '4rem'
          },
          hours: {
            title: 'Hours in games',
            width: '6.5rem'
          },
          topGame: {
            title: 'Longest played game',
            width: '1fr',
            renderRow: (value) => (
              <Link
                href={`/games/titles/${value.topGame.id}`}
                className='underline'
              >
                {value.topGame.name}
              </Link>
            )
          }
        }}
      />

      <Chart
        type='bar'
        props={{
          horizontal: true
        }}
        chartId={`${type}-chart`}
        data={chartData}
        displayFields={['count', 'hours', 'topGame']}
        valueFields={['count', 'hours']}
        defaultValueField='count'
        fieldsNames={{
          id: { name: 'ID' },
          name: { name: StudioTypeTitles[type] },
          index: { name: '№' },
          count: { name: 'Games' },
          hours: { name: 'Hours' },
          topGame: { name: 'Best game' },
          percent: { name: '%' }
        }}
      />
    </AdjacentChart>
  );
}
