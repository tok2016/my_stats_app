'use client';

import Chart from '@components/charts/Chart';

import { GameYearChartData } from '../types';

type GamesLineChartProps = {
  data: GameYearChartData[];
  chartId: string;
};

export default function GamesLineChart({ data, chartId }: GamesLineChartProps) {
  return (
    <Chart
      chartId={chartId}
      type='line'
      data={data}
      displayFields={['count', 'topGame']}
      valueFields={['count']}
      defaultValueField='count'
      fieldsNames={{
        id: { name: 'ID' },
        name: { name: 'Year' },
        year: { name: 'Year' },
        topGame: { name: 'Best game' },
        percent: { name: '%' },
        index: { name: '№' },
        count: { name: 'Games' }
      }}
    />
  );
}
