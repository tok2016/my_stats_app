import { GameCore, GameShort, IgdbRecommendedGame } from './game';
import { ItemSeries } from './series';

export type PrecisePeriod = 'year' | 'season' | 'month';
export type GreatPeriod = 'allTime' | 'year';
export type StudioField = keyof Pick<
  GameCore,
  'developersIds' | 'publishersIds'
>;

export type PrecisePeriodParams = { period?: PrecisePeriod };
export type GreatPeriodParams = { period?: GreatPeriod };
export type StudioFieldParams = {
  field?: StudioField;
};

export interface CountCompareData {
  count: number;
  minutes: number;
}

export interface ItemCompareData extends CountCompareData {
  id: number;
}

export type CountData = {
  id: number;
  count: number;
  topSeries?: ItemSeries;
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

export type CountPlaytimeData = {
  id: number;
  count: number;
  hours: number;
  topGame: GameShort;
};

export type MetricMap<MetricData> = Record<number | string, MetricData>;

export type PeriodTops<MetricData> = {
  period: string;
  top: MetricData[];
};

export type PeriodTopsMetric<MetricData> = {
  periodType: PrecisePeriod;
  tops: PeriodTops<MetricData>[];
};

export type RecommendedMetric = {
  favorite: IgdbRecommendedGame[];
  other: IgdbRecommendedGame[];
};
