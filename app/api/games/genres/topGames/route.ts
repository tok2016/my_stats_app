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

const GENRES_WITH_TOPS = 3;
const GAMES_IN_TOP = 5;

/**
 * Calculates compate data for genre groups.
 * @param game - Base game data.
 * @param genreId - Genre id from genres array of game.
 * @param stored - Previously stored genre group.
 * @returns Genre group with aggregated data.
 */
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

/**
 * Public method. Calculates top games of top-3 genres by playtime of current year or all time. All time is the default option.
 * @param _req - Request object.
 * @param _params - Route params.
 * @param games - All games of user.
 * @throws 400 if user id is not given.
 * @throws 403 if user is private.
 * @throws 404 if user is not found or no game of theirs is found.
 * @returns Top-3 genres by playtime with their top games by playtime.
 */
const getTopLongestGamesByGenre: GameEndpointAction<
  '/api/games/genres/topGames'
> = async (req, _params, games) => {
  //If period is current yera, filters games by the last date the user played them.
  //Sorts games by playtime.
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

  //Groups games by genres and sorts them by count and playtime.
  const topsByGenre = gamesDescending
    .flatGroupBy(aggregateGenreCompare, 'genresIds', 'id', undefined)
    .sort((a, b) => {
      const diff = b.count - a.count;
      if (!diff) return b.hours - a.hours;
      return diff;
    })
    .slice(0, GENRES_WITH_TOPS);

  //Converts genres map array to array.
  const genreTops: GenreTop[] = topsByGenre
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
