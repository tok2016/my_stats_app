import { NextRequest, NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';
import { GenreTop } from '@ts/games/genre';
import { GreatPeriod } from '@ts/games/metric';

import { gameEndpoint } from '@lib/endpoint-generators';

type GenreCompareData = {
  count: number;
  minutes: number;
  games: string[];
};

const GENRES_WITH_TOPS = 3;
const GAMES_IN_TOP = 5;

const getTopLongestGamesByGenre = async (
  games: GameCore[],
  req: NextRequest
) => {
  const greatPeriod =
    (req.nextUrl.searchParams.get('period') as GreatPeriod) ?? 'allTime';

  const topsByGenre = new Map<number, GenreCompareData>();
  const year = new Date().getFullYear();
  const gamesDescending = (
    greatPeriod === 'allTime'
      ? games.slice()
      : games.filter((game) => game.playDate?.getFullYear() === year)
  ).sort((a, b) => b.minutes - a.minutes);

  gamesDescending.forEach((game) => {
    game.genresIds.forEach((genre) => {
      const genreTop = topsByGenre.get(genre);
      if (!genreTop) {
        topsByGenre.set(genre, {
          count: 1,
          minutes: game.minutes,
          games: [game.id]
        });
      } else {
        genreTop.count++;
        genreTop.minutes += game.minutes;
        if (genreTop.games.length < GAMES_IN_TOP) genreTop.games.push(game.id);
      }
    });
  });

  const genreTops: GenreTop[] = topsByGenre
    .entries()
    .toArray()
    .sort((a, b) => {
      const diff = b[1].count - a[1].count;
      if (!diff) return b[1].minutes - a[1].minutes;
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
