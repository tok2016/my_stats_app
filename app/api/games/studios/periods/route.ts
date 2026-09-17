import { NextResponse } from 'next/server';

import { PeriodPlaytimeData, PeriodTop, PrecisePeriod } from '@ts/games/metric';
import {
  StudioPeriodTop,
  StudioType,
  StudiosPeriodMetric
} from '@ts/games/studio';
import { GameEndpointAction } from '@ts/requests';

import { gameMetricEndpoint } from '@lib/endpoint-generators';
import { getPeriodMetric } from '@lib/metrics/periods-metric';

const STUDIOS_IN_PERIOD = 1;

/**
 * Fills given period-top map, adding new top or updating stored.
 * @param periodTop - Top of exact period.
 * @param map - Map of periods and tops.
 * @param type - Period type.
 */
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

/**
 * Public method. Calculates top developer and publisher by playtime of every month / season / year.
 * Season is default period type.
 * @param req - Request object with period type.
 * @param _params - Route params.
 * @param games - All games of user.
 * @throws 400 if user id is not given.
 * @throws 403 if user is private.
 * @throws 404 if user is not found or no game of theirs is found.
 * @returns Top platforms with playtime by periods.
 */
const getStudiosPeriods: GameEndpointAction<
  '/api/games/studios/periods'
> = async (req, _params, games) => {
  //Calculates top developers and publisher of every period separately.
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

  //Unites developers and publishers tops in pair for every period.
  const unitedTops = new Map<string, StudioPeriodTop[]>();
  const maxLength = Math.max(developersTops.length, publishersTops.length);

  for (let i = 0; i < maxLength; i++) {
    setStuioTopByRole(developersTops[i], unitedTops, 'developer');
    setStuioTopByRole(publishersTops[i], unitedTops, 'publisher');
  }

  //Forms final period metric.
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

export const GET = gameMetricEndpoint(getStudiosPeriods);
