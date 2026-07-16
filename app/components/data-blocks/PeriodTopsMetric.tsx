'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { PeriodTop, PeriodTopsMetric, PrecisePeriod } from '@ts/games/metric';
import {
  ChartData,
  ChartValueField,
  PeriodBarChartMainProps
} from '@ts/ui/charts-data';
import { Option } from '@ts/ui/components-props';

import { useAction } from '@lib/hooks';
import { PrecisePeriods, getPeriodString } from '@lib/utils';

import Divider from '@components/Divider';
import Select from '@components/Select';
import { ChartSkeleton } from '@components/charts/ChartSkeleton';
import { ChartClasses } from '@components/charts/chart-styles';

import PeriodBarChart from './PeriodBarChart';
import PeriodTopsSkeletons from './PeriodTopsSkeletons';
import PeriodTopsGroup from './PeriosTopsGroup';

type PeriodTopsProps<
  ItemType extends ChartData,
  ValueKey extends ChartValueField<ItemType>
> = {
  className?: string;
  periodTopClassName?: string;
  barClassName?: string;
  id: string;
  title: string;
  showBar?: boolean;
  listItemContent: (item: ItemType, i: number) => React.ReactNode;
  getPeriodMetric: (
    periodType?: PrecisePeriod
  ) => Promise<PeriodTopsMetric<ItemType & Record<ValueKey, number>>>;
} & PeriodBarChartMainProps<ItemType, ValueKey>;

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
  tops: PeriodTop<ItemType>[]
) => {
  const yearMap = new Map<string, Record<number | string, number>>();
  const indexTops = tops.map((periodTop) => {
    const year = getPeriodString['year'](periodTop.period, false);
    const yearEntry = yearMap.get(year);

    if (!yearEntry) {
      const updatedTop = periodTop.top;
      const indexes = Object.fromEntries(
        updatedTop.map((entry, i) => {
          entry.index = i;
          return [entry.id, i];
        })
      );

      yearMap.set(year, indexes);
      return { ...periodTop, top: updatedTop };
    }

    const updatedTop = periodTop.top;
    updatedTop.forEach((item) => {
      if (!yearEntry[item.id]) {
        const index = Object.keys(yearEntry).length;
        yearEntry[item.id] = index;
        item.index = index;
      }
    });
    return { ...periodTop, top: updatedTop };
  });

  return indexTops;
};

export default function PeriodTops<
  ItemType extends ChartData,
  ValueKey extends ChartValueField<ItemType>
>({
  className = '',
  periodTopClassName = '',
  id,
  title,
  listItemContent,
  getPeriodMetric,
  showBar,
  displayFields,
  fieldsNames,
  valueField,
  barClassName = ''
}: PeriodTopsProps<ItemType, ValueKey>) {
  const [periodMetricData, updatePeriodMetric, isPending] = useAction(
    getPeriodMetric,
    null
  );

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

  const onPeriodSelect = (value: string) => {
    updatePeriodMetric(value as PrecisePeriod);
  };

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
    updatePeriodMetric('month');
  }, [updatePeriodMetric]);

  useEffect(() => {
    if (scrollRef.current) {
      const lastPeriod = periodMetricData?.tops.at(-1);
      if (lastPeriod)
        setYear(getPeriodString['year'](lastPeriod.period, false));
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
    <div id={id} className={`metric ${className}`}>
      <h3 className='select-title'>
        {title}
        <Select
          id={`${id}-select`}
          name={`${id}-select`}
          defaultValue='month'
          variant='text'
          options={periodTypeOptions}
          onSelect={onPeriodSelect}
        />
      </h3>

      <div className='period-tops' ref={scrollRef}>
        <div className='period-tops-groups'>
          {isPending || !periodMetricData ? (
            <PeriodTopsSkeletons
              metricId={id}
              periodTopClassName={periodTopClassName}
            />
          ) : (
            topsByYear
              .entries()
              .toArray()
              .map(([currentYear, tops], i) => (
                <PeriodTopsGroup
                  key={`${currentYear}-group`}
                  tops={tops}
                  periodType={periodMetricData.periodType}
                  listItemContent={listItemContent}
                  periodTopClassName={periodTopClassName}
                  current={i === 0}
                />
              ))
          )}
        </div>

        <div
          className={`years ${periodMetricData?.periodType === 'year' ? 'invisible' : ''}`}
        >
          {isPending || !periodMetricData ? (
            <Divider rounded className='invisible'>
              0
            </Divider>
          ) : (
            topsByYear
              .entries()
              .toArray()
              .map(([currentYear, tops]) => (
                <div
                  id={`${id}-${currentYear}`}
                  key={currentYear}
                  className='year-line'
                  style={{
                    width: `calc(${11 * tops.length}rem + ${1.5 * (tops.length - 1)}rem)`
                  }}
                >
                  <Divider rounded colored={currentYear === year}>
                    {currentYear}
                  </Divider>
                </div>
              ))
          )}
        </div>
      </div>

      {showBar
        && (!periodMetricData ? (
          <ChartSkeleton
            type='periodBar'
            className={`${ChartClasses.periodBar.container} ${barClassName}`}
          />
        ) : (
          <PeriodBarChart
            year={year}
            className={barClassName}
            periodType={periodMetricData.periodType}
            chartId={`${id}-bar`}
            data={setTopsIndexes(periodMetricData.tops)}
            displayFields={displayFields}
            fieldsNames={fieldsNames}
            valueField={valueField}
          />
        ))}
    </div>
  );
}
