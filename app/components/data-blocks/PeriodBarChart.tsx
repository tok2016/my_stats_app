'use client';

import { ChartDataset } from 'chart.js';
import { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

import { PeriodTop, PrecisePeriod } from '@ts/games/metric';
import {
  ChartData,
  ChartValueField,
  PeriodBarChartMainProps,
  PeriodChartTransformed
} from '@ts/ui/charts-data';

import { useAction, useChart } from '@lib/hooks';
import {
  ChartColors,
  MONTHS_IN_YEAR,
  Seasons,
  getPeriodString
} from '@lib/utils';

import ChartProvider from '@store/ChartProvider';

import ChartLegend from '../charts/ChartLegend';
import { getPeriodTooltip } from '../charts/ChartTooltip';
import '../charts/chart-styles';
import { ChartClasses } from '../charts/chart-styles';

type PeriodBarChartProps<
  DataType extends ChartData,
  ValueKey extends ChartValueField<DataType>
> = PeriodBarChartMainProps<DataType, ValueKey> & {
  chartId: string;
  className?: string;
  data: PeriodTop<DataType & Record<ValueKey, number>>[];
  periodType: PrecisePeriod;
  year: string;
};

type PeriodBarCoreProps<
  DataType extends ChartData,
  ValueKey extends ChartValueField<DataType>
> = {
  data: PeriodTop<DataType & Record<ValueKey, number>>[];
  periodType: PrecisePeriod;
  year: string;
  valueField: ValueKey;
};

type PeriodDataset = {
  labels: string[];
  datasets: ChartDataset<'bar'>[];
  dataMap: Map<number | string, PeriodChartTransformed>;
};

const UnitsPerYear: Record<PrecisePeriod, number> = {
  year: 0,
  season: Seasons.length,
  month: MONTHS_IN_YEAR
};

const ShortFormats: Record<PrecisePeriod, boolean> = {
  year: false,
  season: false,
  month: true
};

const defaultPeriodDataset: PeriodDataset = {
  labels: [],
  datasets: [],
  dataMap: new Map()
};

const parsePeriod = (period?: string) => {
  const parts = period?.split('-') ?? [];

  return {
    year: Number(parts[0] ?? 0),
    unit: Number(parts[1] ?? 0)
  };
};

const getAllPeriods = (
  periods: string[],
  periodType: PrecisePeriod,
  year: number
) => {
  const startPeriod = parsePeriod(periods[0]);
  const recentPeriod = parsePeriod(periods.at(-1));
  const unitsPerYear = UnitsPerYear[periodType] ?? 0;

  const allPeriods: string[] = [];

  if (periodType === 'year') {
    for (let year = startPeriod.year; year <= recentPeriod.year; year++)
      allPeriods.push(year.toString());
  } else {
    const startUnit = year === startPeriod.year ? startPeriod.unit : 1;
    const endUnit =
      year === recentPeriod.year ? recentPeriod.unit : unitsPerYear;
    for (let unit = startUnit; unit <= endUnit; unit++) {
      allPeriods.push(`${year}-${unit}`);
    }
  }

  return allPeriods;
};

const getPeriodDatasets = async <
  DataType extends ChartData,
  ValueKey extends ChartValueField<DataType>
>(params?: {
  data: PeriodTop<DataType & Record<ValueKey, number>>[];
  valueField: ValueKey;
  periodType: PrecisePeriod;
  year: number;
}): Promise<PeriodDataset> => {
  if (!params) return defaultPeriodDataset;
  const { data, periodType, year, valueField } = params;

  const isYear = periodType === 'year';
  const allPeriods = getAllPeriods(
    data.map((d) => d.period),
    periodType,
    year
  );

  const periodsNames = Object.fromEntries(
    allPeriods.map((period) => [
      period,
      getPeriodString[periodType](period, ShortFormats[periodType])
    ])
  );

  const itemsMap = new Map<number | string, PeriodChartTransformed>();
  data.forEach((periodData) => {
    if (!isYear && !periodData.period.startsWith(year.toString())) return;

    periodData.top.forEach((top) => {
      const storedItem = itemsMap.get(top.id);
      const period = periodsNames[periodData.period] ?? '';

      if (!storedItem)
        itemsMap.set(top.id, {
          ...top,
          countByPeriod: {
            [period]: top[valueField]
          }
        });
      else storedItem.countByPeriod[period] = top[valueField];
    });
  });

  const dataMap = new Map<number | string, PeriodChartTransformed>();
  const datasets: ChartDataset<'bar'>[] = [];
  itemsMap.values().forEach((item, i) => {
    dataMap.set(item.id, item);

    datasets.push({
      label: item.id.toString(),
      backgroundColor: ChartColors[i % ChartColors.length],
      data: Object.values(periodsNames).map((period) => {
        if (typeof item.countByPeriod[period] === 'undefined') return null;
        return item.countByPeriod[period];
      })
    });
  });

  return {
    labels: Object.values(periodsNames),
    datasets,
    dataMap
  };
};

function PeriodBarCore<
  DataType extends ChartData,
  ValueKey extends ChartValueField<DataType>
>({
  data,
  periodType,
  year,
  valueField
}: PeriodBarCoreProps<DataType, ValueKey>) {
  const [dataset, getDataset] = useAction(
    getPeriodDatasets<DataType, ValueKey>,
    defaultPeriodDataset
  );
  const { updateTooltip, tooltipRef } = useChart();

  useEffect(() => {
    getDataset({ data, periodType, year: Number(year), valueField });
  }, [data, getDataset, periodType, year, valueField]);

  return (
    <div className='chart-legend-content'>
      <div className='chart-core-wrapper'>
        <Bar
          className={ChartClasses.periodBar.core}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            skipNull: true,
            scales: {
              x: {
                type: 'category',
                labels: dataset.labels,
                title: {
                  text:
                    periodType[0].toUpperCase()
                    + periodType.slice(1)
                    + (periodType === 'year' ? '' : `, ${year}`)
                }
              },
              y: {
                type: 'linear',
                title: {
                  text: 'Hours'
                }
              }
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: getPeriodTooltip(
                tooltipRef,
                updateTooltip,
                dataset.dataMap
              )
            }
          }}
          data={{
            labels: dataset.datasets.map((d) => d.label ?? ''),
            datasets: dataset.datasets
          }}
        />
      </div>

      <ChartLegend data={dataset.dataMap.values().toArray()} />
    </div>
  );
}

export default function PeriodBarChart<
  DataType extends ChartData,
  ValueKey extends ChartValueField<DataType>
>({
  data,
  periodType,
  displayFields,
  fieldsNames,
  valueField,
  chartId,
  year,
  className = ''
}: PeriodBarChartProps<DataType, ValueKey>) {
  return (
    <ChartProvider
      chartId={chartId}
      displayFields={displayFields}
      fieldsNames={fieldsNames}
      tooltipProps={{
        colored: true
      }}
      className={`${ChartClasses.periodBar.container} ${className}`}
    >
      <PeriodBarCore
        data={data}
        periodType={periodType}
        year={year}
        valueField={valueField}
      />
    </ChartProvider>
  );
}
