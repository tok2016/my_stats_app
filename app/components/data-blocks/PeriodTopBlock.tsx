import { PeriodTop, PrecisePeriod } from '@ts/games/metric';

import { DEFAULT_PERIOD_BLOCK_WIDTH, getPeriodName } from '@lib/utils';

type PeriodTopBlockProps<ItemType> = {
  className?: string;
  periodTop: PeriodTop<ItemType>;
  periodType: PrecisePeriod;
  blockWidthRem?: number;
  current?: boolean;
  listItemContent: (item: ItemType, i: number) => React.ReactNode;
};

/**
 * @param props
 * @param props.periodTop - Top to render.
 * @param props.periodType - Type of periods: month / season / year.
 * @param props.blockWidthRem - Block width in rem.
 * @param props.current - Highlights the most recent top.
 * @param props.listItemContent - Top item render function.
 * @returns Block with top item of period.
 */
export default function PeriodTopBlock<ItemType>({
  className = '',
  periodTop,
  periodType,
  blockWidthRem = DEFAULT_PERIOD_BLOCK_WIDTH,
  current = false,
  listItemContent
}: PeriodTopBlockProps<ItemType>) {
  return (
    <div
      className={`data-block data-block--period-top ${className}`}
      style={{
        minWidth: `${blockWidthRem}rem`,
        maxWidth: `${blockWidthRem}rem`
      }}
    >
      <div className='data-block__title'>
        <p className={current ? 'colored' : ''}>
          {getPeriodName[periodType](periodTop.period, false)}
        </p>
      </div>

      <ol className='data-block__list'>
        {periodTop.top.map((item, i) => (
          <li
            className={`data-block__list__item ${i === 0 && 'colored bold'}`}
            key={`${periodTop.period}-${i}`}
          >
            {listItemContent(item, i)}
          </li>
        ))}
      </ol>
    </div>
  );
}
