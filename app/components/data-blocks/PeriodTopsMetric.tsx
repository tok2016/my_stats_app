'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

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
  getPeriodString
} from '@lib/utils';

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

const setTopsIndexes = <ItemType extends ChartData>(
  periodType: PrecisePeriod,
  tops: PeriodTop<ItemType>[]
): PeriodTopsMetric<ItemType>['tops'] => {
  const yearItemMap = new Map<string, Record<number | string, number>>();
  const indexTops = tops.map((periodTop) => {
    const year =
      periodType === 'year'
        ? '0'
        : getPeriodString['year'](periodTop.period, false);
    const itemOfYear = yearItemMap.get(year);

    if (!itemOfYear) {
      const updatedTop = periodTop.top;
      const indexes = Object.fromEntries(
        updatedTop.map((item, i) => {
          item.index = i;
          return [item.id, i];
        })
      );

      yearItemMap.set(year, indexes);
      return { ...periodTop, top: updatedTop };
    }

    const updatedTop = periodTop.top;
    updatedTop.forEach((item) => {
      if (!itemOfYear[item.id]) {
        const index = Object.keys(itemOfYear).length;
        itemOfYear[item.id] = index;
        item.index = index;
      }
    });
    return { ...periodTop, top: updatedTop };
  });

  return indexTops;
};

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
  fieldsNames
}: PeriodTopsScrollProps<ItemType, ValueKey>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [year, setYear] = useState<string>('');

  const onIntersect: IntersectionObserverCallback = (entres) => {
    entres.forEach((entry) => {
      if (entry.isIntersecting) {
        const year = entry.target.id.split('-').at(-1);
        if (year) setYear(year);
      }
    });
  };

  const [observer] = useState(() => {
    try {
      return new IntersectionObserver(onIntersect, { threshold: 0.5 });
    } catch {
      return null;
    }
  });

  const topsByYear: Map<string, PeriodTopsMetric<ItemType>['tops']> =
    useMemo(() => {
      const tops = new Map();

      if (!periodMetricData) return tops;
      else if (periodMetricData.periodType === 'year') {
        tops.set(
          periodMetricData.tops[0].period,
          periodMetricData.tops.toReversed()
        );
        return tops;
      }

      for (let i = periodMetricData.tops.length - 1; i >= 0; i--) {
        const top = periodMetricData.tops[i];
        const year = getPeriodString['year'](top.period, false);
        const yearTop = tops.get(year);
        if (!yearTop) tops.set(year, [top]);
        else yearTop.push(top);
      }
      return tops;
    }, [periodMetricData]);

  useEffect(() => {
    if (scrollRef.current) {
      const latestPeriod = periodMetricData.tops.at(-1);
      if (latestPeriod)
        setYear(getPeriodString['year'](latestPeriod.period, false));
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

        <div
          className={`years ${periodMetricData?.periodType === 'year' ? 'invisible' : ''}`}
        >
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
                  {currentYear}
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
            periodMetricData.tops
          )}
          displayFields={displayFields}
          fieldsNames={fieldsNames}
          valueField={valueField}
        />
      )}
    </>
  );
}

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
