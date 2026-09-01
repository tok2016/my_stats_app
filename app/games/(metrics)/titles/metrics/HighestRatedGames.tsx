import { Suspense } from 'react';

import Game from '@ts/games/game';
import { MetricContentProps } from '@ts/games/metric';

import { getMetricData } from '@lib/server-actions';

import EmptyMetric from '@components/data-blocks/EmptyMetric';
import GameCollage from '@components/data-blocks/GameCollage';
import { LinksString } from '@components/data-blocks/LinksString';
import MetricWrapper from '@components/data-blocks/MetricWrapper';
import MultipleRating from '@components/data-blocks/MultipleRatings';

import PropBlock from '../../../../components/data-blocks/PropBlock';
import GamesRatingsSkeleton from '../skeletons/GamesRatingsSkeleton';

type TopGameProps = {
  game: Game;
  index: number;
};

function TopGame({ game, index }: TopGameProps) {
  return (
    <div className='data-block top-game'>
      <h4 className='colored'>{game.name}</h4>
      <GameCollage game={game} />

      <div className='data-block-grid min'>
        <PropBlock title='Developer'>
          {game.developers.length ? (
            <LinksString
              baseEndpoint='/games/studios'
              items={game.developers}
              groupKey={`rated-game-developer-${game.id}`}
            />
          ) : (
            <span>—</span>
          )}
        </PropBlock>

        <PropBlock title='Publisher'>
          {game.publishers.length ? (
            <LinksString
              baseEndpoint='/games/studios'
              items={game.publishers}
              groupKey={`rated-game-publisher-${game.id}`}
            />
          ) : (
            <span>—</span>
          )}
        </PropBlock>
      </div>

      <MultipleRating
        className='pre-rank-prop'
        userOwnRating={game.rating}
        usersRating={game.usersRating}
        criticsRating={game.criticsRating}
      />

      <div className='data-block-rank'>{index + 1}</div>
    </div>
  );
}

async function HighestRatedGames({ metricId, games }: MetricContentProps) {
  const gamesIds = await getMetricData<string[]>(
    '/api/games/titles/rating',
    []
  );

  if (!gamesIds.length)
    return <EmptyMetric message={`You haven't rated any game yet`} />;

  const topGames = gamesIds
    .map((id) => games.findByKey(id))
    .filter((game) => !!game);

  return (
    <MetricWrapper id={metricId}>
      <div className='top-games-grid'>
        {topGames.map((game, i) => (
          <TopGame key={`${game.id}-rating`} game={game} index={i} />
        ))}
      </div>
    </MetricWrapper>
  );
}

export default function GamesRatings(props: MetricContentProps) {
  return (
    <Suspense fallback={<GamesRatingsSkeleton />}>
      <HighestRatedGames {...props} />
    </Suspense>
  );
}
