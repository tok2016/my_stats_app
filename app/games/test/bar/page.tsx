'use client';

import Link from 'next/link';

import { ChartData, FieldsInfo } from '@ts/ui/charts-data';

import AdjacentChart from '@components/charts/AdjacentChart';
import Chart from '@components/charts/Chart';
import Table from '@components/charts/Table';

import countTestData from '../../../../mock data/count-test-data.json';

type StudioCount = ChartData & {
  count: number;
  hours: number;
  seriesName?: number;
};

const fieldsNames: FieldsInfo<StudioCount> = {
  id: { name: 'ID' },
  name: { name: 'Name' },
  seriesName: { name: 'Best Series' },
  count: { name: 'Games' },
  hours: { name: 'Hours' },
  index: { name: 'Rank' },
  percent: { name: 'Percent' }
};

export default function BarPage() {
  const studios: StudioCount[] = countTestData.slice(0, 10).map((data, i) => ({
    id: data.id,
    name: data.id.toString(),
    seriesName: data.topSeries,
    index: i,
    value: 0,
    count: data.count,
    hours: 20
  }));

  return (
    <AdjacentChart>
      <Table
        id='studios-table'
        data={studios}
        headers={{
          index: {
            title: '№',
            width: '1rem',
            renderRow: (value) => value.index + 1
          },
          name: {
            title: 'Name',
            width: '4fr',
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
            width: '3fr'
          },
          hours: {
            title: 'Hours',
            width: '2fr'
          },
          seriesName: {
            title: 'Longest Played Series',
            width: '4fr',
            renderRow: (value) =>
              value.seriesName ? (
                <Link
                  href={`/games/series/${value.seriesName}`}
                  className='underline'
                >
                  {value.seriesName}
                </Link>
              ) : (
                <span>—</span>
              )
          }
        }}
      />

      <Chart
        type='bar'
        chartId='studios-bar-chart'
        data={studios}
        displayFields={['count', 'hours', 'seriesName']}
        fieldsNames={fieldsNames}
        valueFields={['count', 'hours']}
        defaultValueField='hours'
        props={{
          horizontal: true
        }}
      />
    </AdjacentChart>
  );
}
