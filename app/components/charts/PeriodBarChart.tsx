'use client';

import { ChartDataset } from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

import { PrecisePeriod } from '@ts/games/metric';
import {
  ChartData,
  ChartProps,
  PeriodChartData,
  PeriodChartTransformed
} from '@ts/ui/charts-data';
import { Option } from '@ts/ui/components-props';

import { useAction, useChart } from '@lib/hooks';
import { ChartColors, MONTHS_IN_YEAR, Seasons } from '@lib/utils';

import ChartProvider from '@store/ChartProvider';

import Select from '@components/Select';

import ChartLegend from './ChartLegend';
import { getPeriodTooltip } from './ChartTooltip';
import './chart-styles';
import { ChartClasses } from './chart-styles';

type PeriodBarChartProps<DataType extends ChartData> = Omit<
  ChartProps<DataType>,
  'data'
> & {
  data: PeriodChartData<DataType>[];
  periodType: PrecisePeriod;
};

type PeriodBarCoreProps = {
  data: PeriodChartData<ChartData>[];
  periodType: PrecisePeriod;
  year: string;
};

type PeriodDataset = {
  labels: string[];
  datasets: ChartDataset<'bar'>[];
  dataMap: Map<number, PeriodChartTransformed>;
  indexMap: Map<number, number>;
};

const UnitsPerYear: Record<PrecisePeriod, number> = {
  year: 0,
  season: Seasons.length,
  month: MONTHS_IN_YEAR
};

const defaultPeriodDataset: PeriodDataset = {
  labels: [],
  datasets: [],
  dataMap: new Map(),
  indexMap: new Map()
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
    const startUnit = year === startPeriod.year ? startPeriod.unit : 0;
    const endUnit =
      year === recentPeriod.year ? recentPeriod.unit : unitsPerYear - 1;
    for (let unit = startUnit; unit <= endUnit; unit++) {
      allPeriods.push(`${year}-${unit}`);
    }
  }

  return allPeriods;
};

const getPeriodString: Record<PrecisePeriod, (period: string) => string> = {
  year: (period) => period.split('-')[0] ?? '',
  season: (period) => {
    const parts = period.split('-');
    if (!parts[1]) return parts[0] ?? '';

    const seasonNumber = parseInt(parts[1]) % Seasons.length;
    return Seasons[seasonNumber];
  },
  month: (period) => {
    const parts = period.split('-');
    if (!parts[1]) return parts[0] ?? '';

    return new Date(period).toLocaleDateString('en-US', {
      month: 'short'
    });
  }
};

const getPeriodDatasets = async (params?: {
  data: PeriodChartData<ChartData>[];
  periodType: PrecisePeriod;
  year: number;
}): Promise<PeriodDataset> => {
  if (!params) return defaultPeriodDataset;
  const { data, periodType, year } = params;

  const isYear = periodType === 'year';
  const allPeriods = getAllPeriods(
    data.map((d) => d.period),
    periodType,
    year
  );

  const periodsNames = Object.fromEntries(
    allPeriods.map((period) => [period, getPeriodString[periodType](period)])
  );

  const itemsMap = new Map<number, PeriodChartTransformed>();
  data.forEach((periodData) => {
    if (!isYear && !periodData.period.startsWith(year.toString())) return;

    periodData.data.forEach((chartData) => {
      const storedItem = itemsMap.get(chartData.id);
      const period = periodsNames[periodData.period] ?? '';
      if (!storedItem)
        itemsMap.set(chartData.id, {
          ...chartData,
          countByPeriod: { [period]: chartData.value }
        });
      else storedItem.countByPeriod[period] = chartData.value;
    });
  });

  const indexMap = new Map<number, number>();
  const dataMap = new Map<number, PeriodChartTransformed>();
  const datasets: ChartDataset<'bar'>[] = [];
  itemsMap.values().forEach((item, i) => {
    dataMap.set(item.id, item);
    indexMap.set(item.id, i);

    datasets.push({
      label: item.name,
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
    dataMap,
    indexMap
  };
};

function PeriodBarCore({ data, periodType, year }: PeriodBarCoreProps) {
  const [dataset, getDataset] = useAction(
    getPeriodDatasets,
    defaultPeriodDataset
  );
  const { updateTooltip, tooltipRef } = useChart();

  useEffect(() => {
    getDataset({ data, periodType, year: Number(year) });
  }, [data, getDataset, periodType, year]);

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
                  text: periodType[0].toUpperCase() + periodType.slice(1)
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
                dataset.dataMap,
                dataset.indexMap
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

export default function PeriodBarChart<DataType extends ChartData>({
  data,
  periodType,
  displayFields,
  fieldsNames,
  chartId,
  className
}: PeriodBarChartProps<DataType>) {
  const yearOptions: Option[] = getAllPeriods(
    data.map((d) => d.period),
    'year',
    0
  ).map((year) => ({
    label: year,
    key: year,
    value: year
  }));

  const [year, setYear] = useState<string>(yearOptions.at(-1)?.value ?? '');

  return (
    <ChartProvider
      chartId={chartId}
      displayFields={displayFields}
      fieldsNames={fieldsNames}
      className={`filter-chart ${ChartClasses.periodBar.container} ${className}`}
    >
      {periodType === 'year' || (
        <Select
          className='chart-select'
          variant='text'
          defaultValue={year}
          options={yearOptions}
          id={`${chartId}-year`}
          name={`${chartId}-year`}
          onSelect={setYear}
        />
      )}

      <PeriodBarCore data={data} periodType={periodType} year={year} />
    </ChartProvider>
  );
}
