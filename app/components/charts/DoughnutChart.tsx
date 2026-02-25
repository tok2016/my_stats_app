'use client';

import { ArcElement, Chart, Legend, Tooltip } from 'chart.js';
import { useContext } from 'react';
import { Doughnut } from 'react-chartjs-2';

import { DisplayFields, DoughnutData } from '@ts/ui/charts-data';

import { ChartColors } from '@lib/utils';

import ChartProvider, { ChartContext } from '@store/ChartProvider';

import ChartLegend from './ChartLegend';
import { getTooltip } from './ChartTooltip';

Chart.register(ArcElement, Tooltip, Legend);

type DoughnutChartProps<DataType extends DoughnutData> = {
  data: DataType[];
  displayFields: DisplayFields<DataType>;
  fieldsNames: Record<keyof DataType, string>;
  chartId: string;
  className?: string;
};

type DoughnutInternalProps<DataType extends DoughnutData> = {
  data: DataType[];
};

function DoughnutCore<DataType extends DoughnutData>({
  data
}: DoughnutInternalProps<DataType>) {
  const dataMap = new Map(data.map((d) => [d.id, d]));
  const indexMap = new Map(data.map((d, i) => [d.id, i]));
  const percentsMap = new Map(data.map((d) => [d.id, d.percent]));

  const { updateTooltip, tooltipRef } = useContext(ChartContext);

  return (
    <>
      <Doughnut
        className='doughnut-chart chart-core'
        options={{
          aspectRatio: 1,
          rotation: 90,
          responsive: true,
          cutout: '40%',
          interaction: {
            mode: 'index'
          },
          layout: {
            padding: 20
          },
          elements: {
            arc: {
              hoverOffset: 25,
              borderColor: 'transparent',
              borderRadius: 10,
              spacing: 10
            }
          },
          locale: 'en-US',
          plugins: {
            tooltip: getTooltip(
              tooltipRef,
              updateTooltip,
              dataMap,
              indexMap,
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
}: DoughnutChartProps<DataType>) {
  return (
    <ChartProvider
      chartId={chartId}
      displayFields={displayFields}
      fieldsNames={fieldsNames}
      className={className}
    >
      <DoughnutCore data={data} />
    </ChartProvider>
  );
}
