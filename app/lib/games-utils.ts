import { GameCore } from '@ts/games/game';
import { IgdbGenre } from '@ts/games/genre';

import { igdbRequest } from './igdb';

export const getGenres = async (games: GameCore[]) => {
  const genresIds = new Set<number>();
  games.forEach((game) => {
    game.genresIds.forEach((genre) => {
      genresIds.add(genre);
    });
  });

  const genres = await igdbRequest<IgdbGenre>('/genres', {
    fields: ['name', 'slug'],
    where: `id = (${genresIds.values().toArray().join(',')})`,
    limit: genresIds.size
  });

  const genresMap: Record<number, IgdbGenre> = Object.fromEntries(
    genres.map((genre) => [genre.id, genre])
  );

  return genresMap;
};
