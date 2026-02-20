'use client';

import { ArcElement, Chart, Legend, Tooltip } from 'chart.js';
import { useEffect, useRef, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

import { DoughnutData } from '@ts/ui/charts-data';

import { ChartColors } from '@lib/utils';

import ChartLegend from './ChartLegend';
import { getTooltip } from './ChartTooltip';

Chart.register(ArcElement, Tooltip, Legend);

type DoughnutChartProps<DataType extends DoughnutData> = {
  data: DataType[];
  dataField: keyof DataType;
  displayFields: (keyof Omit<DataType, 'id' | 'name'>)[];
  fieldsNames: Record<keyof DataType, string>;
  chartId: string;
  className?: string;
};

export default function DoughnutChart<DataType extends DoughnutData>({
  data,
  dataField,
  displayFields,
  fieldsNames,
  chartId,
  className = ''
}: DoughnutChartProps<DataType>) {
  const dataMap = new Map(data.map((d) => [d.id, d]));
  const indexMap = new Map(data.map((d, i) => [d.id, i]));
  const percentsMap = new Map(data.map((d) => [d.id, d.percent]));

  const chartRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<HTMLElement>();

  useEffect(() => {
    const chartContainer = chartRef.current;
    if (!tooltip) {
      let container = document.getElementById(chartId);
      if (!container) {
        container = document.createElement('div');
        container.id = chartId;
        container.classList.add('tooltip-container');
        chartContainer?.appendChild(container);
      }
      setTooltip(container);
    }

    return () => {
      if (tooltip) chartContainer?.removeChild(tooltip);
    };
  }, [chartId, tooltip]);

  if (data.every((value) => typeof value[dataField] !== 'number')) {
    return <h4 className='chart-error'>{`Couldn't create chart`}</h4>;
  }

  return (
    <div className={`chart ${className}`} ref={chartRef}>
      <Doughnut
        className='doughnut-chart'
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
              tooltip,
              dataMap,
              displayFields,
              fieldsNames,
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
              data: data.map((value) => value[dataField]),
              backgroundColor: ChartColors,
              selfJoin: true,
              normalized: true
            }
          ]
        }}
      />

      <ChartLegend data={data} percentsMap={percentsMap} />
    </div>
  );
}
