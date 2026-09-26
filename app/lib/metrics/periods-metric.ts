import { GameCore } from '@ts/games/game';
import { PeriodPlaytimeTops, PrecisePeriod } from '@ts/games/metric';
import { ExtractTypeFields } from '@ts/util-types';

import ObjectMapArray from '@lib/object-map-array';
import { isKeyOfArrayField } from '@lib/type-guards';

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

const MONTHS_IN_QUARTER = 3;
const MONTHS_SHIFT = 11;

/**
 * Forms period string.
 * YYYY - for year.
 * YYYY-S - for season.
 * YYYY-Mm - for month (month is in one- or two-digit format).
 */
const getPeriodString: Record<PrecisePeriod, (date: Date | string) => string> =
  {
    year: (date) => new Date(date).getFullYear().toString(),
    season: (date) => {
      const formDate = new Date(date);
      const seasonNumber = Math.floor(
        ((formDate.getMonth() % MONTHS_SHIFT) + 1) / MONTHS_IN_QUARTER
      );
      return `${formDate.getFullYear()}-${(seasonNumber + 1).toString().padStart(2, '0')}`;
    },
    month: (date) => {
      const formDate = new Date(date);
      return `${formDate.getFullYear()}-${(formDate.getMonth() + 1).toString().padStart(2, '0')}`;
    }
  };

/**
 * Calculates array of periods and playtime for item group.
 * @param periodType - Month / season / year.
 * @returns Aggregate callback.
 */
const aggregateItemPeriod =
  (periodType: PrecisePeriod) =>
  /**
   * Calculates periods array and aggregated playtime for item group.
   * @param game - Game data.
   * @param item - Item of game.
   * @param stored - Previously stored item group.
   * @returns Item group with aggregated data.
   */
  (game: GameCore, item: number | string, stored?: ItemPeriodCompare) => {
    //Formats play date period string.
    const playDate = new Date(game.playDate ?? 0);
    if (!playDate.getTime()) return undefined;
    const period = getPeriodString[periodType](playDate);

    //Calculates playtime of period for this item.
    //It represents the time user spent on games of this item at this period.
    const compareData = {
      period,
      hours: game.hours + (stored?.periods.findByKey(period)?.hours ?? 0)
    };

    //Adds period to item.
    if (stored) stored.periods.push(compareData);
    return {
      id: item,
      periods: stored
        ? stored.periods
        : new ObjectMapArray([compareData], 'period')
    };
  };

/**
 * Calculates items array with playtime for period group.
 * @param itemPeriod - Item group with periods-playtime array.
 * @param period - Period with playtime.
 * @param stored - Previously stored period group.
 * @returns Period group with array of items and playtime.
 */
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

/**
 * Groups games by item field.
 * Calculates top items for every month / season / year by playtime.
 * @param games - Games to group.
 * @param periodType - Period type.
 * @param itemField - Item field to group the games by.
 * @param maxTopEntries - Max entries in one period top.
 * @returns Top items for every period.
 */
export const getPeriodMetric = (
  games: ObjectMapArray<GameCore, 'apiId'>,
  periodType: PrecisePeriod,
  itemField: ExtractTypeFields<
    GameCore,
    number | string | Array<number | string>
  >,
  maxTopEntries: number
): PeriodPlaytimeTops => {
  //Groups games by items.
  //Each item group has a periods array when the user was playing the games with this item.
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

  //Groups items by period and sorts items array in each period.
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
