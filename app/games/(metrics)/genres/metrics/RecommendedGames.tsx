import { RecommendedGame } from '@ts/games/game';
import { RecommendedMetric } from '@ts/games/metric';

import { getMetricData } from '@lib/server-actions';

import GameCollage from '@components/data-blocks/GameCollage';

import Recommendations from '../../../../../mock data/genres/genres-recommendation.json';

const MAX_PLATFORMS = 6;

const RecommendationCategories: Record<keyof RecommendedMetric, string> = {
  favorite: 'Games of your favorite genres',
  other: 'Games of genres you might like'
};

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
          {game.external.slice(0, MAX_PLATFORMS).map((external, i, arr) => (
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
  // const recommendations = await getMetricData<RecommendedMetric>(
  //   '/api/games/genres/recommend',
  //   {
  //     favorite: [],
  //     other: []
  //   }
  // );

  const recommendations = Recommendations;

  return Object.entries(recommendations).map(([key, games]) => (
    <section key={key} className='metric recommended-group'>
      <h3>{RecommendationCategories[key as keyof RecommendedMetric]}</h3>

      <div key={key} className='recommended-games'>
        {games.map((game) => (
          <RecommendedGameBlock key={game.id} {...game} />
        ))}
      </div>
    </section>
  ));
}
