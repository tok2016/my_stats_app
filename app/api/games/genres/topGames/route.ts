import { NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';
import { GenreTop } from '@ts/games/genre';
import { GreatPeriod } from '@ts/games/metric';
import { GameEndpointAction } from '@ts/requests';

import { gameMetricEndpoint } from '@lib/endpoint-generators';

type GenreCompareData = {
  id: number;
  count: number;
  hours: number;
  games: string[];
};

const aggregateGenreCompare = (
  game: GameCore,
  genreId: number,
  stored?: GenreCompareData
) => {
  if (stored && stored.games.length < GAMES_IN_TOP) stored.games.push(game.id);

  return {
    id: genreId,
    count: (stored?.count ?? 0) + 1,
    hours: (stored?.hours ?? 0) + game.hours,
    games: stored ? stored.games : [game.id]
  };
};

const GENRES_WITH_TOPS = 3;
const GAMES_IN_TOP = 5;

const getTopLongestGamesByGenre: GameEndpointAction<
  '/api/games/genres/topGames'
> = async (req, _params, games) => {
  const greatPeriod =
    (req.nextUrl.searchParams.get('period') as GreatPeriod) ?? 'allTime';

  const year = new Date().getFullYear();
  const gamesDescending = (
    greatPeriod === 'allTime'
      ? games.slice(0)
      : games.filter(
          (game) =>
            !!game.playDate && new Date(game.playDate).getFullYear() === year
        )
  ).sort((a, b) => b.hours - a.hours);

  const topsByGenre = gamesDescending.flatGroupBy(
    aggregateGenreCompare,
    'genresIds',
    'id',
    undefined
  );

  const genreTops: GenreTop[] = topsByGenre
    .sort((a, b) => {
      const diff = b.count - a.count;
      if (!diff) return b.hours - a.hours;
      return diff;
    })
    .slice(0, GENRES_WITH_TOPS)
    .map((genre) => ({
      id: genre.id,
      topGames: genre.games
    }))
    .toArray();

  return NextResponse.json(genreTops, {
    status: 200,
    statusText: 'Top-5 longest games of top-3 genres were calculated'
  });
};

export const GET = gameMetricEndpoint(getTopLongestGamesByGenre);
