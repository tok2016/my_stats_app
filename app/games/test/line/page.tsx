import { ChartData } from '@ts/ui/charts-data';

import LineChart from '@components/charts/LineChart';

import testYearData from '../../../../mock data/year-test-data.json';

type YearData = ChartData & {
  topGame: string | undefined;
};

const yearDataFieldsNames: Record<keyof YearData, string> = {
  id: 'Year',
  name: 'Year',
  value: 'Count',
  topGame: 'Top Game'
};

export default function TestLinePage() {
  const yearData: YearData[] = testYearData.map((data) => ({
    id: data.year,
    name: data.year.toString(),
    value: data.count,
    topGame: data.topGames[0]?.id
  }));

  return (
    <LineChart
      className='year-chart'
      chartId='test-year-line'
      data={yearData}
      displayFields={['value', 'topGame']}
      fieldsNames={yearDataFieldsNames}
    />
  );
}
