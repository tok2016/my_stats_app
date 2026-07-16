import { PeriodTop, PrecisePeriod } from '@ts/games/metric';

import { getPeriodString } from '@lib/utils';

type PeriodTopBlockProps<ItemType> = {
  className?: string;
  periodTop: PeriodTop<ItemType>;
  periodType: PrecisePeriod;
  current?: boolean;
  listItemContent: (item: ItemType, i: number) => React.ReactNode;
};

export default function PeriodTopBlock<ItemType>({
  className = '',
  periodTop,
  periodType,
  current = false,
  listItemContent
}: PeriodTopBlockProps<ItemType>) {
  return (
    <div className={`data-block period-top ${className}`}>
      <div className='data-block-title'>
        <p className={current ? 'colored' : ''}>
          {getPeriodString[periodType](periodTop.period, false)}
        </p>
      </div>

      <ol className='data-block-list'>
        {periodTop.top.map((item, i) => (
          <li
            className={`data-block-item ${i === 0 && 'colored bold'}`}
            key={`${periodTop.period}-${i}`}
          >
            {listItemContent(item, i)}
          </li>
        ))}
      </ol>
    </div>
  );
}
