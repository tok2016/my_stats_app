'use client';

import { SearchGame, SearchGamesResults } from '@ts/games/game';

import AxiosInstanse from '@lib/axios-instanse';
import { useAction, useURLSearchParams } from '@lib/hooks';

import Button from '@components/Button';
import Search from '@components/Search';

import BrowsedGame from './BrowsedGame';

type BrowsedGameProps = {
  game: SearchGame;
};

type SearchQuery = {
  name: string;
  page: number;
  prevGames: SearchGame[];
  prevName: string;
};

const browseGames = async (
  query?: SearchQuery
): Promise<SearchGamesResults> => {
  const searchParams = new URLSearchParams({
    query: query?.name ?? '',
    page: query?.page.toString() ?? '1'
  });

  const searchResults = await AxiosInstanse.get<SearchGamesResults>(
    `/api/games/search?${searchParams.toString()}`
  );

  return {
    ...searchResults.data,
    games:
      query && query.name === query.prevName
        ? [...query.prevGames, ...searchResults.data.games]
        : searchResults.data.games
  };
};

function BrowsedGameChoice({ game }: BrowsedGameProps) {
  const { setParam } = useURLSearchParams();
  const chooseGame = (gameApiId: number) => () => {
    setParam('gameId', gameApiId.toString());
  };

  return <BrowsedGame game={game} onClick={chooseGame(game.apiId)} />;
}

export default function SearchGameForm() {
  const [searchResults, searchGames, isPending] = useAction(browseGames, {
    games: [],
    page: 0,
    isEnd: true,
    query: ''
  });

  const onSearch = (query?: string) => {
    searchGames({
      prevGames: searchResults.games,
      page: 1,
      prevName: searchResults.query,
      name: query ?? ''
    });

    return Promise.resolve(undefined);
  };

  const onLoadMore = () => {
    searchGames({
      prevGames: searchResults.games,
      page: searchResults.page + 1,
      name: searchResults.query,
      prevName: searchResults.query
    });
  };

  return (
    <div className='search-game-form card'>
      <h2>Search a game</h2>

      <Search
        id='search-game'
        name='searchGame'
        placeholder='Search game'
        action={onSearch}
        onSearchSubmit={onSearch}
      />

      <div
        className='browsed-games'
        style={{
          visibility: searchResults.games.length ? 'visible' : 'hidden'
        }}
      >
        {searchResults.games.map((game) => (
          <BrowsedGameChoice game={game} key={game.apiId} />
        ))}

        {searchResults.isEnd || (
          <Button variant='secondary' onClick={onLoadMore} loading={isPending}>
            More
          </Button>
        )}
      </div>
    </div>
  );
}
