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
import ObjectMapArray from '@lib/object-map-array';
import {
  ChartColors,
  MONTHS_IN_YEAR,
  Seasons,
  YEARS_IN_DECADE,
  getPeriodName
} from '@lib/utils';

import ChartProvider from '@store/ChartProvider';

import ChartLegend from '../charts/ChartLegend';
import { setPeriodTooltip } from '../charts/ChartTooltip';
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
  year: YEARS_IN_DECADE,
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

/**
 * Forms all month / seasons of year or all years of decade.
 * @param periods - Periods of tops.
 * @param periodType - Type of periods in period tops: month / season / year.
 * @param year - Year / start year of decade to form periods by.
 * @returns All month / seasons of year or all years of decade.
 */
const getAllPeriodsOfYear = (
  periods: string[],
  periodType: PrecisePeriod,
  year: number
) => {
  //Defines dates of earlies and latest periods in data.
  const startPeriod = parsePeriod(periods[0]);
  const recentPeriod = parsePeriod(periods.at(-1));
  const unitsPerYear = UnitsPerYear[periodType] ?? 0;

  const allPeriods: string[] = [];

  if (periodType === 'year') {
    //Starts with earliest year if it's bigger then first year of decade.
    const startChartYear = year === startPeriod.year ? year : startPeriod.year;

    //Ends up with recent year if it's smaller then end year of decade.
    const endDecadeYear =
      Math.ceil((startChartYear + 1) / unitsPerYear) * unitsPerYear;
    const endChartYear =
      recentPeriod.year < endDecadeYear ? recentPeriod.year : endDecadeYear;

    for (let y = startChartYear; y <= endChartYear; y++)
      allPeriods.push(y.toString());
  } else {
    //Start with month / season of earliest period it given year is also the earliest.
    const startUnit = year === startPeriod.year ? startPeriod.unit : 1;

    //Ends up with month / season of recent period it given year is also the most recent.
    const endUnit =
      year === recentPeriod.year ? recentPeriod.unit : unitsPerYear;

    for (let unit = startUnit; unit <= endUnit; unit++) {
      allPeriods.push(`${year}-${unit.toString().padStart(2, '0')}`);
    }
  }

  return allPeriods;
};

/**
 * Forms datasets for each unique item from top with values from each period with no period skip.
 * Each datasets has length of max periods in year / decade (12 for months, 4 for seasons, 10 for years).
 * @param params
 * @param params.data - Period tops to form datasets by.
 * @param params.periodType - Type of periods in period tops: month / season / year.
 * @param params.valueField - Field of data which values will be used to build the chart elements. Accept only number fields.
 * @param params.year - Year / start year of decade to filter top by.
 * @returns Datasets of each item.
 */
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

  //Forms all periods of year or decade.
  const allPeriodsOfYear = getAllPeriodsOfYear(
    data.map((d) => d.period),
    periodType,
    year
  );

  //Translates each period string to month / season name or year.
  const allPeriodsNames = Object.fromEntries(
    allPeriodsOfYear.map((period) => [
      period,
      getPeriodName[periodType](period, ShortFormats[periodType])
    ])
  );

  //Collection of item with value per period when this item was in top.
  const uniqueItems = new ObjectMapArray<PeriodChartTransformed, 'id'>(
    [],
    'id'
  );
  data.forEach((periodTop) => {
    periodTop.top.forEach((item) => {
      const storedItem = uniqueItems.findByKey(item.id);
      const period = allPeriodsNames[periodTop.period] ?? '';

      if (!storedItem)
        uniqueItems.push({
          ...item,
          countByPeriod: {
            [period]: item[valueField]
          }
        });
      else storedItem.countByPeriod[period] = item[valueField];
    });
  });

  //Data map for tooltip.
  const dataMap = new Map<number | string, PeriodChartTransformed>();

  //Forms datasets for chart. Does not skip periods with empty values (or when this item has not been in top).
  const datasets: ChartDataset<'bar'>[] = [];
  uniqueItems.forEach((item, i) => {
    dataMap.set(item.id, item);

    //Item id is stored in dataset label.
    datasets.push({
      label: item.id.toString(),
      backgroundColor: ChartColors[i % ChartColors.length],
      data: Object.values(allPeriodsNames).map((period) => {
        if (typeof item.countByPeriod[period] === 'undefined') return null;
        return item.countByPeriod[period];
      })
    });
  });

  return {
    labels: Object.values(allPeriodsNames),
    datasets,
    dataMap
  };
};

/**
 * @param props
 * @param props.data - Period tops.
 * @param props.periodType - Type of periods in period tops: month / season / year.
 * @param props.valueField - Field of data which values will be used to build the chart elements. Accept only number fields.
 * @param props.year - Year which periods will be displayed on chart, if period type is month or season.
 * @returns Core bar chart component with legend. Displays empty period as well.
 */
function PeriodBarCore<
  DataType extends ChartData,
  ValueKey extends ChartValueField<DataType>
>({
  data,
  periodType,
  year,
  valueField
}: PeriodBarCoreProps<DataType, ValueKey>) {
  //Datasets for each unique item in tops.
  const [dataset, getDataset] = useAction(
    getPeriodDatasets<DataType, ValueKey>,
    defaultPeriodDataset
  );
  const { updateTooltip, tooltipRef } = useChart();

  //Recalculates datasets each time year, periodType or value field changes.
  useEffect(() => {
    getDataset({ data, periodType, year: parseInt(year), valueField });
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
                  text: year
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
              tooltip: setPeriodTooltip(
                tooltipRef,
                updateTooltip,
                dataset.dataMap,
                valueField as keyof PeriodChartTransformed
              )
            }
          }}
          data={{
            labels: dataset.labels,
            datasets: dataset.datasets
          }}
        />
      </div>

      <ChartLegend data={dataset.dataMap.values().toArray()} />
    </div>
  );
}

/**
 * Bar chart with multiple datasets for each unique item in tops of given year.
 * Each dataset (item) has its own color. Color may repeat if there is more than 11 datasets.
 * Item id is stored in its dataset label.
 * @param props
 * @param props.data - Period tops.
 * @param props.periodType - Type of periods in period tops: month / season / year.
 * @param props.displayFields - Fields to display on tooltip.
 * @param props.fieldsInfo - Fields render data with names that for tooltip and chart.
 * @param props.valueField - Field of data which values will be used to build the chart elements. Accept only number fields.
 * @param props.chartId - Id of chart component.
 * @param props.year - Year which periods will be displayed on chart, if period type is month or season.
 * @param props.className - Class of chart container component.
 * @returns Bar chart of periods with multiple bars for each period.
 */
export default function PeriodBarChart<
  DataType extends ChartData,
  ValueKey extends ChartValueField<DataType>
>({
  data,
  periodType,
  displayFields,
  fieldsInfo,
  valueField,
  chartId,
  year,
  className = ''
}: PeriodBarChartProps<DataType, ValueKey>) {
  return (
    <ChartProvider
      chartId={chartId}
      displayFields={displayFields}
      fieldsInfo={fieldsInfo}
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
