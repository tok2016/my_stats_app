import { NextRequest, NextResponse } from 'next/server';

import { GameCore } from '@ts/games/game';
import { GenreTop } from '@ts/games/genre';
import { GreatPeriod } from '@ts/games/metric';

import { gameEndpoint } from '@lib/endpoint-generators';
import ObjectMapArray from '@lib/object-map-array';

type GenreCompareData = {
  id: number;
  count: number;
  hours: number;
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

  const topsByGenre = new ObjectMapArray<GenreCompareData, 'id'>([], 'id');
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
      const genreTop = topsByGenre.findByKey(genre);
      if (!genreTop) {
        topsByGenre.push({
          id: genre,
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

export const GET = gameEndpoint(getTopLongestGamesByGenre);
