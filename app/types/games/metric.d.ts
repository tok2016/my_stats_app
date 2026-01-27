import { GameShort, RawgGameShort } from './game';

export type PrecisePeriod = 'year' | 'quarter' | 'month';
export type GreatPeriod = 'allTime' | 'year';

export type PrecisePeriodParams = { period?: PrecisePeriod };
export type GreatPeriodParams = { period?: GreatPeriod };

export type CountData = {
  id: number;
  count: number;
  topSeries: SeriesShort;
};

export type PlaytimeData = {
  id: number;
  hours: number;
  topGame: GameShort;
};

export type RatingData = {
  id: number;
  rating: number;
  topGames: GameShort[];
};

export type MetricMap<MetricData> = Record<number | string, MetricData>;

export type PeriodTops<MetricType> = Record<number | string, MetricType>;

export type PeriodTopsMetric<MetricType> = {
  period: PrecisePeriod;
  tops: PeriodTops<MetricType>;
};

export type RecommendedMetric = {
  favorite: RawgGameShort[];
  other: RawgGameShort[];
};
