import { NextResponse } from 'next/server';

import { GameEndpointAction } from '@ts/requests';

import { gameMetricEndpoint } from '@lib/endpoint-generators';
import { getYearCountMetric } from '@lib/metrics/year-count-metric';

/**
 * Public method. Groups games by release year calculating games count and longest played game by year.
 * @param _req - Request object.
 * @param _params - Route params.
 * @param games - All games of user.
 * @throws 400 if user id is not given.
 * @throws 403 if user is private.
 * @throws 404 if user is not found or no game of theirs is found.
 * @returns Years data with games count and top game.
 */
const getReleasesPerYear: GameEndpointAction<
  '/api/games/titles/release'
> = async (_req, _params, games) => {
  const releases = getYearCountMetric(games, 'releasedAt');

  return NextResponse.json(releases, {
    status: 200,
    statusText: 'Games releases were calculated by year'
  });
};

export const GET = gameMetricEndpoint(getReleasesPerYear);
