'use client';

import { useContext } from 'react';
import { Doughnut } from 'react-chartjs-2';

import { ChartProps, DoughnutData } from '@ts/ui/charts-data';

import { ChartColors } from '@lib/utils';

import ChartProvider, { ChartContext } from '@store/ChartProvider';

import ChartLegend from './ChartLegend';
import { getTooltip } from './ChartTooltip';
import { ChartClasses } from './chart-styles';

type DoughnutInternalProps<DataType extends DoughnutData> = {
  data: DataType[];
};

export function DoughnutCore<DataType extends DoughnutData>({
  data
}: DoughnutInternalProps<DataType>) {
  const dataMap = new Map(data.map((d) => [d.id, d]));
  const indexMap = new Map(data.map((d, i) => [d.id, i]));
  const percentsMap = new Map(data.map((d) => [d.id, d.percent]));

  const { updateTooltip, tooltipRef } = useContext(ChartContext);

  return (
    <>
      <Doughnut
        className={ChartClasses.doughnut.core}
        options={{
          aspectRatio: 1,
          rotation: 90,
          responsive: true,
          cutout: '40%',
          elements: {
            arc: {
              spacing: 10 //global spacing doesn't work
            }
          },
          locale: 'en-US',
          plugins: {
            tooltip: getTooltip(
              tooltipRef,
              updateTooltip,
              dataMap,
              indexMap,
              'start',
              'start',
              percentsMap
            ),
            legend: {
              display: false
            }
          }
        }}
        data={{
          labels: data.map((d) => d.id),
          datasets: [
            {
              data: data.map((value) => value.value),
              backgroundColor: ChartColors,
              selfJoin: true,
              normalized: true
            }
          ]
        }}
      />

      <ChartLegend data={data} percentsMap={percentsMap} />
    </>
  );
}

export default function DoughnutChart<DataType extends DoughnutData>({
  data,
  displayFields,
  fieldsNames,
  chartId,
  className
}: ChartProps<DataType>) {
  return (
    <ChartProvider
      chartId={chartId}
      displayFields={displayFields}
      fieldsNames={fieldsNames}
      className={`${ChartClasses.doughnut.container} ${className}`}
    >
      <DoughnutCore data={data} />
    </ChartProvider>
  );
}
