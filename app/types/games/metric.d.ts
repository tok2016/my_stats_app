import { PrecisePeriods } from '@lib/utils';

import { IgdbBasic } from './api-response';
import { GameCore, GameShort, IgdbRecommendedGame } from './game';

export type PrecisePeriod = (typeof PrecisePeriods)[number];
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

export interface ItemIdCompareData extends CountCompareData {
  id: number;
}

export interface ItemCompareData<IgdbData extends IgdbBasic = IgdbBasic> {
  item: IgdbData;
  count: number;
  hours: number;
}

export type CountData = {
  id: number | string;
  count: number;
  percent: number;
  topSeries?: number;
};

export type PlaytimeData = {
  id: number | string;
  hours: number;
  count: number;
  percent: number;
  topGame: GameShort;
};

export type RatingData = {
  id: number;
  rating: number;
  topGames: GameShort[];
};

export type MetricMap<MetricData> = Record<number | string, MetricData>;

export type PeriodPlaytimeData = {
  id: number | string;
  hours: number;
};

export type PeriodTop<MetricData> = {
  period: string;
  top: MetricData[];
};

export type PeriodTopsMetric<MetricData> = {
  periodType: PrecisePeriod;
  tops: PeriodTop<MetricData>[];
};

export type PeriodPlaytimeTops = PeriodTopsMetric<PeriodPlaytimeData>;

export type RecommendedMetric = {
  favorite: IgdbRecommendedGame[];
  other: IgdbRecommendedGame[];
};

export interface YearCountMetric {
  year: number;
  count: number;
  topGames: GameShort[];
}
