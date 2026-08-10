import { PeriodTop, PrecisePeriod } from '@ts/games/metric';
import { ChartData, FieldsInfo } from '@ts/ui/charts-data';

import PeriodBarChart from '@components/data-blocks/PeriodBarChart';

import testData from '../../../../mock data/period-test-data.json';

type TestPeriodData = ChartData & { value: number };

const DisplayPeriodFields: FieldsInfo<TestPeriodData> = {
  id: { name: 'ID' },
  name: { name: 'Name' },
  value: { name: 'Value' },
  index: { name: 'Index' },
  percent: { name: 'Percent' }
};

export default async function Page() {
  const data: PeriodTop<TestPeriodData>[] = testData.tops.map((top) => ({
    period: top.period,
    top: top.top.map((item, i) => ({
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
        year='2025'
        data={data}
        periodType={testData.periodType as PrecisePeriod}
        displayFields={['value']}
        valueField='value'
        fieldsNames={DisplayPeriodFields}
        chartId='genres-periods-bar'
      />
    </>
  );
}
