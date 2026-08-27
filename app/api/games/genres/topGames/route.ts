import { NextResponse } from 'next/server';

import { GenreTop } from '@ts/games/genre';
import { GreatPeriod } from '@ts/games/metric';
import { GameEndpointAction } from '@ts/requests';

import { gameEndpoint } from '@lib/endpoint-generators';

type GenreCompareData = {
  count: number;
  hours: number;
  games: string[];
};

const GENRES_WITH_TOPS = 3;
const GAMES_IN_TOP = 5;

const getTopLongestGamesByGenre: GameEndpointAction<
  '/api/games/genres/topGames'
> = async (req, _params, games) => {
  const greatPeriod =
    (req.nextUrl.searchParams.get('period') as GreatPeriod) ?? 'allTime';

  const topsByGenre = new Map<number, GenreCompareData>();
  const year = new Date().getFullYear();
  const gamesDescending = (
    greatPeriod === 'allTime'
      ? games.slice()
      : games.filter(
          (game) =>
            game.playDate && new Date(game.playDate).getFullYear() === year
        )
  ).sort((a, b) => b.hours - a.hours);

  gamesDescending.forEach((game) => {
    game.genresIds.forEach((genre) => {
      const genreTop = topsByGenre.get(genre);
      if (!genreTop) {
        topsByGenre.set(genre, {
          count: 1,
          hours: game.hours,
          games: [game.id]
        });
      } else {
        genreTop.count++;
        genreTop.hours += game.hours;
        if (genreTop.games.length < GAMES_IN_TOP) genreTop.games.push(game.id);
      }
    });
  });

  const genreTops: GenreTop[] = topsByGenre
    .entries()
    .toArray()
    .sort((a, b) => {
      const diff = b[1].count - a[1].count;
      if (!diff) return b[1].hours - a[1].hours;
      return diff;
    })
    .slice(0, GENRES_WITH_TOPS)
    .map(([genre, value]) => ({
      id: genre,
      topGames: value.games
    }));

  return NextResponse.json(genreTops, {
    status: 200,
    statusText: 'Top-5 longest games of top-3 genres were calculated'
  });
};

export const GET = gameEndpoint(getTopLongestGamesByGenre);
