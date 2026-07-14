import { ChartData, FieldsInfo } from '@ts/ui/charts-data';

import Chart from '@components/charts/Chart';

const fieldsNames: FieldsInfo<ChartData> = {
  id: { name: 'Country code' },
  index: { name: '№' },
  value: { name: 'Games' },
  name: { name: 'Cointry' },
  percent: { name: 'Percent' }
};

export default function MapPage() {
  const testCountryData: ChartData[] = [
    {
      id: 643,
      reservedValue: 3,
      index: 4,
      name: 'Russia'
    },
    {
      id: 124,
      reservedValue: 10,
      index: 1,
      name: 'Canada'
    },
    {
      id: 840,
      reservedValue: 30,
      index: 0,
      name: 'US'
    },
    {
      id: 392,
      reservedValue: 9,
      index: 2,
      name: 'Japan'
    },
    {
      id: 826,
      reservedValue: 6,
      index: 3,
      name: 'UK'
    }
  ];

  return (
    <>
      <div style={{ height: 200 }}></div>
      <Chart
        type='map'
        data={testCountryData}
        chartId='test-map'
        displayFields={['value']}
        fieldsNames={fieldsNames}
      />
      <div style={{ height: 200 }}></div>
    </>
  );
}
