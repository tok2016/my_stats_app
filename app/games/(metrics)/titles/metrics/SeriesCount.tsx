import Link from 'next/link';

import Game from '@ts/games/game';
import { SeriesCollapsed } from '@ts/games/series';

import { getMetricData } from '@lib/server-actions';

import EmptyImage from '@components/data-blocks/EmptyImage';
import GameCover from '@components/data-blocks/GameCover';
import { LinksString } from '@components/data-blocks/LinksString';
import MultipleRating from '@components/data-blocks/MultipleRatings';

import PropBlock from '../../../../components/data-blocks/PropBlock';
import { MAX_GAMES_IN_SERIES } from '../utils';

type SeriesCountProps = {
  gamesMap: Map<string, Game>;
};

type TopSeriesProps = {
  series: SeriesCollapsed;
  gamesMap: Map<string, Game>;
};

function TopSeries({ series, gamesMap }: TopSeriesProps) {
  const games = series.games
    .slice(0, MAX_GAMES_IN_SERIES)
    .map((game) => gamesMap.get(game));
  const percent = Math.round((games.length / series.allGames) * 100);

  return (
    <div className='data-block series-block'>
      <h4 className='colored'>{series.name}</h4>

      <div className='series-games-collage'>
        {Array.from({ length: MAX_GAMES_IN_SERIES }).map((_, i) =>
          games[i] ? (
            <GameCover
              key={`series-game-cover-${i}`}
              game={games[i]}
              className={`series-game-${i}`}
            />
          ) : (
            <EmptyImage
              key={`series-empty-cover-${i}`}
              className={`game-cover series-game-${i}`}
            />
          )
        )}
      </div>

      <PropBlock title='Best game'>
        {games[0] ? (
          <Link
            href={`/games/titles/${games[0].id}`}
            className='underline wide'
          >
            {games[0].name}
          </Link>
        ) : (
          <span>—</span>
        )}
      </PropBlock>

      <div className='data-block-grid'>
        <PropBlock title='Developers'>
          {series.developers.length ? (
            <LinksString
              baseEndpoint='/games/studios'
              items={series.developers}
              groupKey={`series-developers-${series.id}`}
            />
          ) : (
            <span>—</span>
          )}
        </PropBlock>

        <PropBlock title='Publishers'>
          {series.publishers.length ? (
            <LinksString
              baseEndpoint='/games/studios'
              items={series.publishers}
              groupKey={`series-publishers-${series.id}`}
            />
          ) : (
            <span>—</span>
          )}
        </PropBlock>

        <PropBlock title='Games'>
          <span className='colored bold'>{games.length}</span>
          <span>{` (${percent}%)`}</span>
        </PropBlock>

        <PropBlock title='Playtime'>
          <span className='colored bold'>{series.hours} h.</span>
        </PropBlock>
      </div>

      <MultipleRating
        userOwnRating={series.averageRating}
        usersRating={series.usersRating}
        criticsRating={series.criticsRating}
      />
    </div>
  );
}

export default async function SeriesCount({ gamesMap }: SeriesCountProps) {
  const seriesData = await getMetricData<SeriesCollapsed[]>(
    '/api/games/titles/series',
    []
  );

  return (
    <div className='top-series'>
      {seriesData.map((series) => (
        <TopSeries
          key={`${series.id}-series`}
          series={series}
          gamesMap={gamesMap}
        />
      ))}
    </div>
  );
}
