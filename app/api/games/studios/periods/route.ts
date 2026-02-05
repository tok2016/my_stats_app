import { NextRequest, NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';
import { PeriodTops, PrecisePeriod } from '@ts/games/metric';
import { StudiosPeriodMetric, StudiosPeriodTop } from '@ts/games/studio';

import { gameEndpoint } from '@lib/endpoint-generators';
import { getPeriodMetric } from '@lib/metrics/periods-metric';

const STUDIOS_IN_PERIOD = 1;

const setStuioTopByRole = (
  periodTop: PeriodTops<string> | undefined,
  map: Map<string, StudiosPeriodTop>,
  field: keyof StudiosPeriodTop
) => {
  if (!periodTop) return;

  const currentTop = map.get(periodTop?.period) ?? {};
  map.set(periodTop.period, { ...currentTop, [field]: periodTop.top });
};

const getStudiosPeriods = async (games: GameCore[], req: NextRequest) => {
  const periodType =
    (req.nextUrl.searchParams.get('period') as PrecisePeriod) ?? 'year';

  const developersTops = getPeriodMetric(
    games,
    periodType,
    'developersIds',
    STUDIOS_IN_PERIOD
  ).tops;

  const publishersTops = getPeriodMetric(
    games,
    periodType,
    'publishersIds',
    STUDIOS_IN_PERIOD
  ).tops;

  const unitedTops = new Map<string, StudiosPeriodTop>();
  const maxLength = Math.max(developersTops.length, publishersTops.length);

  for (let i = 0; i < maxLength; i++) {
    setStuioTopByRole(developersTops[i], unitedTops, 'developers');
    setStuioTopByRole(publishersTops[i], unitedTops, 'publishers');
  }

  const periodMetric: StudiosPeriodMetric = {
    periodType,
    tops: unitedTops
      .entries()
      .map(([period, top]) => ({
        period,
        developers: top.developers,
        publishers: top.publishers
      }))
      .toArray()
  };

  return NextResponse.json(periodMetric, {
    status: 200,
    statusText: `Studios tops were calculated by ${periodType}`
  });
};

export const GET = gameEndpoint(getStudiosPeriods);
