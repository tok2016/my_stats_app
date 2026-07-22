import { RecommendedGame } from '@ts/games/game';
import { RecommendedMetric } from '@ts/games/metric';

import { getMetricData } from '@lib/server-actions';

import GameCollage from '@components/data-blocks/GameCollage';
import Metric from '@components/data-blocks/Metric';

import { RecommendationCategories, RecommendationIds } from '../utils';

type ExternalLinkProps = {
  external: RecommendedGame['external'][number];
  last?: boolean;
};

function ExternalLink({ external, last }: ExternalLinkProps) {
  const separator = last ? ' ' : ', ';
  if (!external.source) return;
  else if (!external.url)
    return (
      <>
        {external.source.name}
        {separator}
      </>
    );

  return (
    <>
      <a href={external.url} target='_blank' className='underline small'>
        {external.source.name}
      </a>
      {separator}
    </>
  );
}

function RecommendedGameBlock(game: RecommendedMetric['favorite'][number]) {
  return (
    <div className='data-block recommended-game'>
      <h4 className='colored'>{game.name}</h4>

      <GameCollage
        game={{
          id: game.id.toString(),
          name: game.name,
          cover: game.cover,
          screenshots: game.screenshots
        }}
      />

      <div>Genres: {game.genres.map((genre) => genre.name).join(', ')}</div>

      {game.external.length > 0 && (
        <div className='recommended-game-platforms'>
          <span>Available at: </span>
          {game.external.map((external, i, arr) => (
            <ExternalLink
              key={external.id}
              external={external}
              last={i === arr.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default async function RecommendedGames() {
  const recommendations = await getMetricData<RecommendedMetric>(
    '/api/games/genres/recommend',
    {
      favorite: [],
      other: []
    }
  );

  //const recommendations = Recommendations;

  return Object.entries(recommendations).map(([key, games]) => (
    <Metric
      key={key}
      id={RecommendationIds[key as keyof RecommendedMetric]}
      title={RecommendationCategories[key as keyof RecommendedMetric]}
      className='recommended-group'
    >
      <div className='recommended-games'>
        {games.map((game) => (
          <RecommendedGameBlock key={game.id} {...game} />
        ))}
      </div>
    </Metric>
  ));
}
