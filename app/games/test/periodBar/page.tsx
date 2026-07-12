import { PrecisePeriod } from '@ts/games/metric';
import { ChartData, FieldsInfo, PeriodChartData } from '@ts/ui/charts-data';

import PeriodBarChart from '@components/charts/PeriodBarChart';

import testData from '../../../../mock data/period-test-data.json';

const DisplayPeriodFields: FieldsInfo<ChartData> = {
  id: { name: 'ID' },
  name: { name: 'Name' },
  value: { name: 'Value' },
  index: { name: 'Index' },
  percent: { name: 'Percent' }
};

export default async function Page() {
  const data: PeriodChartData<ChartData>[] = testData.tops.map((top) => ({
    period: top.period,
    data: top.top.map((item, i) => ({
      id: Number(item) ?? 0,
      index: i,
      name: item,
      value: Math.round(Math.random() * 100000) % 100
    }))
  }));

  return (
    <>
      <h1>Period bar</h1>
      <PeriodBarChart
        data={data}
        periodType={testData.periodType as PrecisePeriod}
        displayFields={['value']}
        fieldsNames={DisplayPeriodFields}
        chartId='genres-periods-bar'
      />
    </>
  );
}
