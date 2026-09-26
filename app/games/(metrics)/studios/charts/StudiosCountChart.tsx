'use client';

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

/**
 * @param props
 * @param props.data - Studios data with games count, playtime and top game.
 * @param props.type - Studio type: developer or publisher.
 * @returns Adjacent charts with table and bar chart of top studios of given type by games count and playtime.
 */
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
              <span data-rank={value.index} className='bold colored'>
                {value.name}
              </span>
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
            renderRow: (value) => value.topGame.name
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
        fieldsInfo={{
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
