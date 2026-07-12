import { ChartData, FieldsInfo } from '@ts/ui/charts-data';

import Chart from '@components/charts/Chart';

import testYearData from '../../../../mock data/year-test-data.json';

type YearData = ChartData & {
  topGame: string | undefined;
};

const yearDataFieldsNames: FieldsInfo<YearData> = {
  id: { name: 'Year' },
  index: { name: 'Index' },
  name: { name: 'Year' },
  value: { name: 'Count' },
  topGame: { name: 'Top Game' },
  percent: { name: 'Percent' }
};

export default function TestLinePage() {
  const yearData: YearData[] = testYearData.map((data, i) => ({
    id: data.year,
    index: i,
    name: data.year.toString(),
    value: data.count,
    topGame: data.topGames[0]?.id
  }));

  return (
    <Chart
      type='line'
      className='year-chart'
      chartId='test-year-line'
      data={yearData}
      displayFields={['value', 'topGame']}
      fieldsNames={yearDataFieldsNames}
    />
  );
}
