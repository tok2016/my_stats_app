import { NextResponse } from 'next/server';

import { PeriodPlaytimeData, PeriodTop, PrecisePeriod } from '@ts/games/metric';
import {
  StudioPeriodTop,
  StudioType,
  StudiosPeriodMetric
} from '@ts/games/studio';
import { GameEndpointAction } from '@ts/requests';

import { gameEndpoint } from '@lib/endpoint-generators';
import { getPeriodMetric } from '@lib/metrics/periods-metric';

const STUDIOS_IN_PERIOD = 1;

const setStuioTopByRole = (
  periodTop: PeriodTop<PeriodPlaytimeData> | undefined,
  map: Map<string, StudioPeriodTop[]>,
  type: StudioType
) => {
  if (!periodTop) return;

  const currentTop = map.get(periodTop?.period);
  if (!currentTop)
    map.set(
      periodTop.period,
      periodTop.top.map((entry) => ({ ...entry, type }))
    );
  else
    periodTop.top.forEach((entry) => {
      currentTop.push({ ...entry, type });
    });
};

const getStudiosPeriods: GameEndpointAction<
  '/api/games/studios/periods'
> = async (req, _params, games) => {
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

  const unitedTops = new Map<string, StudioPeriodTop[]>();
  const maxLength = Math.max(developersTops.length, publishersTops.length);

  for (let i = 0; i < maxLength; i++) {
    setStuioTopByRole(developersTops[i], unitedTops, 'developer');
    setStuioTopByRole(publishersTops[i], unitedTops, 'publisher');
  }

  const periodMetric: StudiosPeriodMetric = {
    periodType,
    tops: unitedTops
      .entries()
      .map(([period, top]) => ({
        period,
        top
      }))
      .toArray()
  };

  return NextResponse.json(periodMetric, {
    status: 200,
    statusText: `Studios tops were calculated by ${periodType}`
  });
};

export const GET = gameEndpoint(getStudiosPeriods);
