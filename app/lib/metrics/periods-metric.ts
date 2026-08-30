import { GameCore } from '@ts/games/game';
import { PeriodPlaytimeTops, PrecisePeriod } from '@ts/games/metric';
import { ExtractTypeFields } from '@ts/util-types';

import ObjectMapArray from '@lib/object-map-array';
import { isKeyOfArrayField } from '@lib/type-guards';

import { getPeriodDate } from '../utils';

type ItemPeriodPlaytime = {
  period: string;
  hours: number;
};

type ItemPeriodCompare = {
  id: number | string;
  periods: ObjectMapArray<ItemPeriodPlaytime, 'period'>;
};

type ItemPeriodCompareArray = Omit<ItemPeriodCompare, 'periods'> & {
  periods: ItemPeriodPlaytime[];
};

type PeriodCompareData = {
  period: string;
  itemsCounts: ObjectMapArray<{ id: number | string; hours: number }, 'id'>;
};

const aggregateItemPeriod =
  (periodType: PrecisePeriod) =>
  (game: GameCore, item: number | string, stored?: ItemPeriodCompare) => {
    const playDate = new Date(game.playDate ?? 0);
    if (!playDate.getTime()) return undefined;

    const period = getPeriodDate[periodType](playDate);
    const compareData = {
      period,
      hours: game.hours + (stored?.periods.findByKey(period)?.hours ?? 0)
    };

    if (stored) stored.periods.push(compareData);
    return {
      id: item,
      periods: stored
        ? stored.periods
        : new ObjectMapArray([compareData], 'period')
    };
  };

const aggregatePeriod = (
  itemPeriod: ItemPeriodCompareArray,
  period: ItemPeriodPlaytime,
  stored?: PeriodCompareData
): PeriodCompareData | undefined => {
  const itemPlaytime = { id: itemPeriod.id, hours: period.hours };
  if (stored) stored.itemsCounts.push(itemPlaytime);

  return {
    period: period.period,
    itemsCounts: stored
      ? stored.itemsCounts
      : new ObjectMapArray([itemPlaytime], 'id')
  };
};

export const getPeriodMetric = (
  games: ObjectMapArray<GameCore, 'apiId'>,
  periodType: PrecisePeriod,
  itemField: ExtractTypeFields<
    GameCore,
    number | string | Array<number | string>
  >,
  maxTopEntries: number
): PeriodPlaytimeTops => {
  const itemPeriodLists = (
    isKeyOfArrayField(itemField, games.at(0))
      ? games.flatGroupBy(
          aggregateItemPeriod(periodType),
          itemField,
          'id',
          undefined
        )
      : games.groupBy(
          aggregateItemPeriod(periodType),
          itemField,
          'id',
          undefined
        )
  ).mapByKey<ItemPeriodCompareArray, 'id'>(
    (itemPeriod) => ({
      id: itemPeriod.id,
      periods: itemPeriod.periods.toArray()
    }),
    'id'
  );

  const periodTops = itemPeriodLists
    .flatGroupBy(aggregatePeriod, 'periods', 'period', 'period')
    .map((periodCompare) => {
      const top = periodCompare.itemsCounts
        .sort((a, b) => b.hours - a.hours)
        .slice(0, maxTopEntries)
        .toArray();

      const periodTop: PeriodPlaytimeTops['tops'][number] = {
        period: periodCompare.period,
        top
      };
      return periodTop;
    })
    .toArray()
    .sort((a, b) => (a.period >= b.period ? 1 : -1));

  return {
    periodType: periodType,
    tops: periodTops
  };
};
