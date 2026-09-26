'use client';

import Chart from '@components/charts/Chart';

import { GameYearChartData } from '../types';

type GamesLineChartProps = {
  data: GameYearChartData[];
  chartId: string;
};

/**
 * @param props
 * @param props.data - Years list with games count and top game.
 * @param props.chartId - Id for line chart.
 * @returns Line chart of years with games count as data value and top game.
 */
export default function GamesYearLineChart({
  data,
  chartId
}: GamesLineChartProps) {
  return (
    <Chart
      chartId={chartId}
      type='line'
      data={data}
      displayFields={['count', 'topGame']}
      valueFields={['count']}
      defaultValueField='count'
      fieldsInfo={{
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
