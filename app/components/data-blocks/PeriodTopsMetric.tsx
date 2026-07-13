'use client';

import { useEffect } from 'react';

import { PeriodTopsMetric, PrecisePeriod } from '@ts/games/metric';
import { Option } from '@ts/ui/components-props';

import { useAction } from '@lib/hooks';
import { PrecisePeriods } from '@lib/utils';

import Select from '@components/Select';

import PeriodTopBlock from './PeriodTopBlock';
import PeriodTopSkeleton from './PeriodTopSkeleton';

type PeriodTopsProps<ItemType> = {
  className?: string;
  periodTopClassName?: string;
  id: string;
  title: string;
  listItemContent: (item: ItemType, i: number) => React.ReactNode;
  getPeriodMetric: (
    periodType?: PrecisePeriod
  ) => Promise<PeriodTopsMetric<ItemType>>;
};

const SKELETONS_COUNT = 10;

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

export default function PeriodTops<ItemType>({
  className = '',
  periodTopClassName = '',
  id,
  title,
  listItemContent,
  getPeriodMetric
}: PeriodTopsProps<ItemType>) {
  const [periodMetricData, updatePeriodMetric, isPending] = useAction(
    getPeriodMetric,
    null
  );

  const onPeriodSelect = (value: string) => {
    updatePeriodMetric(value as PrecisePeriod);
  };

  useEffect(() => {
    updatePeriodMetric('month');
  }, [updatePeriodMetric]);

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

      <div className='period-tops'>
        {isPending || !periodMetricData
          ? Array.from({ length: SKELETONS_COUNT }, (_v, k) => (
              <PeriodTopSkeleton
                key={`${id}-${k}`}
                className={periodTopClassName}
              />
            ))
          : periodMetricData.tops
              .toReversed()
              .map((top, i) => (
                <PeriodTopBlock
                  key={top.period}
                  current={i === 0}
                  periodTop={top}
                  periodType={periodMetricData.periodType}
                  listItemContent={listItemContent}
                  className={periodTopClassName}
                />
              ))}
      </div>
    </div>
  );
}
