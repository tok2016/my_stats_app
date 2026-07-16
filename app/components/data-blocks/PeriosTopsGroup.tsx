'use client';

import { PeriodTop, PrecisePeriod } from '@ts/games/metric';

import PeriodTopBlock from './PeriodTopBlock';

type PeriodTopsGroupProps<ItemType> = {
  tops: PeriodTop<ItemType>[];
  periodType: PrecisePeriod;
  periodTopClassName?: string;
  listItemContent: (item: ItemType, i: number) => React.ReactNode;
  current?: boolean;
};

export default function PeriodTopsGroup<ItemType>({
  tops,
  periodType,
  periodTopClassName,
  listItemContent,
  current = false
}: PeriodTopsGroupProps<ItemType>) {
  return (
    <div className='period-tops-in-group'>
      {tops.map((top, i) => (
        <PeriodTopBlock
          key={top.period}
          current={current && i === 0}
          periodTop={top}
          periodType={periodType}
          listItemContent={listItemContent}
          className={periodTopClassName}
        />
      ))}
    </div>
  );
}
