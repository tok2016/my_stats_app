'use client';

import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react';

import {
  FetchPeriodTopsMetricParams,
  MetricId,
  PeriodTop,
  PeriodTopsMetric,
  PrecisePeriod
} from '@ts/games/metric';
import { MetricResponse } from '@ts/requests';
import {
  ChartData,
  ChartValueField,
  PeriodBarChartMainProps
} from '@ts/ui/charts-data';
import { Option } from '@ts/ui/components-props';

import {
  DEFAULT_PERIOD_BLOCKS_GAP,
  DEFAULT_PERIOD_BLOCK_WIDTH,
  PrecisePeriods,
  getPeriodName
} from '@lib/utils';

import Button from '@components/Button';
import Divider from '@components/Divider';
import Select from '@components/Select';

import FetchMetric from '@app/games/(metrics)/components/FetchMetric';

import MetricWrapper from './MetricWrapper';
import PeriodBarChart from './PeriodBarChart';
import PeriodTopsSkeletons from './PeriodTopsSkeletons';
import PeriodTopsGroup from './PeriosTopsGroup';

type PeriodTopsScrollProps<
  ItemType extends ChartData,
  ValueKey extends ChartValueField<ItemType>
> = {
  id: MetricId;
  periodMetricData: PeriodTopsMetric<ItemType & Record<ValueKey, number>>;
  periodTopClassName?: string;
  blockWidthRem?: number;
  gapRem?: number;
  showBar?: boolean;
  listItemContent: (item: ItemType, i: number) => React.ReactNode;
  barClassName?: string;
} & PeriodBarChartMainProps<ItemType, ValueKey>;

type PeriodTopsProps<
  ItemType extends ChartData,
  ValueKey extends ChartValueField<ItemType>
> = {
  className?: string;
  userId: string;
  fetchPeriodMetric: (
    params: FetchPeriodTopsMetricParams
  ) => Promise<
    MetricResponse<PeriodTopsMetric<ItemType & Record<ValueKey, number>>>
  >;
} & Omit<PeriodTopsScrollProps<ItemType, ValueKey>, 'periodMetricData'>;

const periodTypesLables: Record<PrecisePeriod, string> = {
  year: 'by year',
  season: 'by season',
  month: 'by month'
};

const periodTypeOptions: Option[] = PrecisePeriods.map((periodType) => ({
  value: periodType,
  label: periodTypesLables[periodType],
  key: periodType
}));

const getDecadeByYear = (year: string) =>
  Math.floor(parseInt(year) / 10) * 10 + 's';

/**
 * Adds indexes to period tops chart data to color item's datasets.
 * Index is used here only to set color, not to rank the item, to differ datasets visually.
 * Indexes are given only within a year or decade group.
 * @param periodType - Type of periods: month / season / year.
 * @param tops - Period tops to indexes for.
 * @returns Period top with indexes for each top item within one year or decade.
 */
const setTopsIndexes = <ItemType extends ChartData>(
  periodType: PrecisePeriod,
  tops: PeriodTop<ItemType>[],
  year: string
): PeriodTopsMetric<ItemType>['tops'] => {
  const itemIndexMap = new Map<number | string, number>();

  const indexTops: PeriodTopsMetric<ItemType>['tops'] = [];
  tops.forEach((periodTop) => {
    //Defines year or decade to group indexes by.
    const currentYear = getPeriodName['year'](periodTop.period, false);
    const yearDecade =
      periodType === 'year' ? getDecadeByYear(currentYear) : currentYear;

    if (yearDecade !== year) return;

    //Adds indexes for every unsaved item and returns top with updated indexes.
    //The index of new item equals the current length of group items.
    const updatedTop = periodTop.top;
    updatedTop.forEach((item) => {
      const index = itemIndexMap.get(item.id);
      if (typeof index === 'undefined') {
        const newIndex = itemIndexMap.size;
        itemIndexMap.set(item.id, newIndex);
        item.index = newIndex;
      }
    });

    indexTops.push({ ...periodTop, top: updatedTop });
  });

  return indexTops;
};

/**
 * @param props
 * @param props.id - Metric id.
 * @param props.periodTopClassName - Class of a single period top block.
 * @param props.blockWidthRem - Period top block width in rem.
 * @param props.gapRem - Gap size between period top blocks in rem.
 * @param props.listItemContent - Top item render function for period top block.
 * @param props.showBar - If true, shows period bar chart after period tops scroll.
 * @param props.barClassName - Class of period bar chart.
 * @param props.displayFields - Display fields for period bar chart tooltip.
 * @param props.fieldsInfo - Fields render data with names for tooltip and chart.
 * @param props.valueField - Field of data which values will be used to build the period bar chart elements. Accept only number fields.
 * @returns Period tops scroll and bar chart.
 */
function PeriodTopsScroll<
  ItemType extends ChartData,
  ValueKey extends ChartValueField<ItemType>
>({
  id,
  periodMetricData,
  listItemContent,
  periodTopClassName = '',
  barClassName = '',
  blockWidthRem = DEFAULT_PERIOD_BLOCK_WIDTH,
  gapRem = DEFAULT_PERIOD_BLOCKS_GAP,
  showBar,
  displayFields,
  valueField,
  fieldsInfo: fieldsNames
}: PeriodTopsScrollProps<ItemType, ValueKey>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [year, setYear] = useState<string>('');

  /**
   * Updates year which group intersects the viewport.
   * @param entries
   */
  const onIntersect: IntersectionObserverCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const year = entry.target.id.split('-').at(-1);
        if (year) setYear(year);
      }
    });
  };

  /**
   * Shows periods of clicked year.
   * @param evt
   */
  const onYearClick = (evt: MouseEvent) => {
    setYear(evt.currentTarget.id);
  };

  //Observer to track tops group intersection with viewport.
  const [observer] = useState(() => {
    try {
      return new IntersectionObserver(onIntersect, { threshold: 0.5 });
    } catch {
      return null;
    }
  });

  //Period tops grouped by year or decade.
  const topsByYear: Map<string, PeriodTopsMetric<ItemType>['tops']> =
    useMemo(() => {
      const tops = new Map();

      if (!periodMetricData) return tops;

      //Defines year/decade of each period top and adds it to group.
      for (let i = periodMetricData.tops.length - 1; i >= 0; i--) {
        const top = periodMetricData.tops[i];
        const year = getPeriodName['year'](top.period, false);

        const decade = getDecadeByYear(year);
        const yearOrDecade =
          periodMetricData.periodType === 'year' ? decade : year;

        const yearDecadeTop = tops.get(yearOrDecade);
        if (!yearDecadeTop) tops.set(yearOrDecade, [top]);
        else yearDecadeTop.push(top);
      }
      return tops;
    }, [periodMetricData]);

  //Sets the most recent year at the start and assigns observable elements.
  useEffect(() => {
    if (scrollRef.current) {
      const latestPeriod = periodMetricData.tops.at(-1);
      if (latestPeriod)
        setYear(getPeriodName['year'](latestPeriod.period, false));
      else setYear('');

      scrollRef.current.scrollTo({
        left: scrollRef.current.scrollWidth
      });

      observer?.disconnect();
      scrollRef.current.querySelectorAll('.year-line').forEach((el) => {
        observer?.observe(el);
      });
    }
  }, [periodMetricData, observer]);

  return (
    <>
      <div className='period-tops' ref={scrollRef}>
        <div className='period-tops-groups'>
          {topsByYear
            .entries()
            .toArray()
            .map(([currentYear, tops], i) => (
              <PeriodTopsGroup
                key={`${currentYear}-group`}
                tops={tops}
                periodType={periodMetricData.periodType}
                listItemContent={listItemContent}
                periodTopClassName={periodTopClassName}
                blockWidthRem={blockWidthRem}
                gapRem={gapRem}
                current={i === 0}
              />
            ))}
        </div>

        <div className='years'>
          {topsByYear
            .entries()
            .toArray()
            .map(([currentYear, tops]) => (
              <div
                id={`${id}-${currentYear}`}
                key={currentYear}
                className='year-line'
                style={{
                  width: `calc(${blockWidthRem * tops.length}rem + ${gapRem * (tops.length - 1)}rem)`
                }}
              >
                <Divider rounded colored={currentYear === year}>
                  <Button
                    variant={currentYear === year ? 'link' : 'text'}
                    onClick={onYearClick}
                    id={currentYear}
                  >
                    {currentYear}
                  </Button>
                </Divider>
              </div>
            ))}
        </div>
      </div>

      {showBar && (
        <PeriodBarChart
          year={year}
          className={barClassName}
          periodType={periodMetricData.periodType}
          chartId={`${id}-bar`}
          data={setTopsIndexes(
            periodMetricData.periodType,
            periodMetricData.tops,
            year
          )}
          displayFields={displayFields}
          fieldsInfo={fieldsNames}
          valueField={valueField}
        />
      )}
    </>
  );
}

/**
 * Renders tops scroll and bar chart. Bar chart displays only periods on currently visible year or decade.
 * @param props - Period tops metric props.
 * @param props.id - Metric id.
 * @param props.userId - User with metric data to fetch.
 * @param props.fetchPeriodMetric - Function to fetch metric data.
 * @param props.periodTopClassName - Class of a single period top block.
 * @param props.blockWidthRem - Period top block width in rem.
 * @param props.gapRem - Gap size between period top blocks in rem.
 * @param props.listItemContent - Top item render function for period top block.
 * @param props.showBar - If true, shows period bar chart after period tops scroll.
 * @param props.barClassName - Class of period bar chart.
 * @param props.displayFields - Display fields for period bar chart tooltip.
 * @param props.fieldsInfo - Fields render data with names for tooltip and chart.
 * @param props.valueField - Field of data which values will be used to build the period bar chart elements. Accept only number fields.
 * @returns Period top metric with tops scroll and bar chart.
 */
export default function PeriodTops<
  ItemType extends ChartData,
  ValueKey extends ChartValueField<ItemType>
>(props: PeriodTopsProps<ItemType, ValueKey>) {
  const [periodType, setPeriodType] = useState<PrecisePeriod>('season');

  const onPeriodSelect = (value: string) => {
    setPeriodType(value as PrecisePeriod);
  };

  return (
    <MetricWrapper
      id={props.id}
      className={props.className}
      renderTitle={(title) => (
        <span className='select-title'>
          {title}
          <Select
            id={`${props.id}-select`}
            name={`${props.id}-select`}
            defaultValue={periodType}
            variant='text'
            options={periodTypeOptions}
            onSelect={onPeriodSelect}
          />
        </span>
      )}
    >
      <FetchMetric
        fetchMetricData={props.fetchPeriodMetric}
        fallback={<PeriodTopsSkeletons metricId={props.id} {...props} />}
        metric={(data) => (
          <PeriodTopsScroll {...props} periodMetricData={data} />
        )}
        params={{ userId: props.userId, period: periodType }}
      />
    </MetricWrapper>
  );
}
