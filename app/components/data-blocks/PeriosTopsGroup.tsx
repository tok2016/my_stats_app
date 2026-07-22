'use client';

import { PeriodTop, PrecisePeriod } from '@ts/games/metric';

import {
  DEFAULT_PERIOD_BLOCKS_GAP,
  DEFAULT_PERIOD_BLOCK_WIDTH
} from '@lib/utils';

import PeriodTopBlock from './PeriodTopBlock';

type PeriodTopsGroupProps<ItemType> = {
  tops: PeriodTop<ItemType>[];
  periodType: PrecisePeriod;
  periodTopClassName?: string;
  blockWidthRem?: number;
  gapRem?: number;
  listItemContent: (item: ItemType, i: number) => React.ReactNode;
  current?: boolean;
};

export default function PeriodTopsGroup<ItemType>({
  tops,
  periodType,
  periodTopClassName,
  blockWidthRem = DEFAULT_PERIOD_BLOCK_WIDTH,
  gapRem = DEFAULT_PERIOD_BLOCKS_GAP,
  listItemContent,
  current = false
}: PeriodTopsGroupProps<ItemType>) {
  return (
    <div className='period-tops-in-group' style={{ gap: `${gapRem}rem` }}>
      {tops.map((top, i) => (
        <PeriodTopBlock
          key={top.period}
          current={current && i === 0}
          periodTop={top}
          periodType={periodType}
          listItemContent={listItemContent}
          blockWidthRem={blockWidthRem}
          className={periodTopClassName}
        />
      ))}
    </div>
  );
}
