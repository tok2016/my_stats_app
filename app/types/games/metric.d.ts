import {
  GameGenresMetricsIds,
  GameTitlesMetricsIds,
  MetricsIds,
  PlatformsMetricsIds,
  StudiosMetricsIds,
  SubmetricsId
} from '@lib/metrics/metrics-id';
import ObjectMapArray from '@lib/object-map-array';
import { GreatPeriods, PrecisePeriods } from '@lib/utils';

import { IgdbBasic } from './api-response';
import Game, { GameCore, GameShort } from './game';

export type GameMetricId =
  | (typeof GameGenresMetricsIds)[number]
  | (typeof StudiosMetricsIds)[number]
  | (typeof PlatformsMetricsIds)[number]
  | (typeof GameTitlesMetricsIds)[number];

export type MetricId = (typeof MetricsIds)[number];
export type SubmetricId = (typeof SubmetricsId)[number];

export type PrecisePeriod = (typeof PrecisePeriods)[number];
export type GreatPeriod = (typeof GreatPeriods)[number];
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
  id: number;
  count: number;
  hours: number;
}

export interface ItemIdCompareData extends CountCompareData {
  id: number;
}

export type ItemCompareData<IgdbData extends IgdbBasic = IgdbBasic> =
  IgdbData & {
    count: number;
    hours: number;
  };

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
  id: number | string;
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

export interface YearCountMetric {
  year: number;
  count: number;
  topGames: GameShort[];
}

export type MetricContentProps = {
  metricId: MetricId;
  userId: string;
  games: ObjectMapArray<Game, 'id'>;
};

export type MetricClientContentProps = Omit<MetricContentProps, 'games'> & {
  games: Game[];
};

export type MetricWrapperProps = {
  id: MetricId;
  renderTitle?: (title: string) => React.ReactNode;
  children: React.ReactNode;
  className?: string;
};
