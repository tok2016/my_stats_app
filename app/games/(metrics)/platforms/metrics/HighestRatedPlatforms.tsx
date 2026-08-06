import Game from '@ts/games/game';
import { PlatformRatingData } from '@ts/games/platform';

import { getMetricData } from '@lib/server-actions';

import Rating from '@components/Rating';
import EmptyMetric from '@components/data-blocks/EmptyMetric';
import GameTableTitle from '@components/data-blocks/GameTitle';

type HighestRatedPlatformsProps = {
  platformsMap: Map<number | string, NonNullable<Game['platform']>>;
  genresMap: Map<number | string, Game['genres'][number]>;
};

type RatedPlatformProps = {
  ratedPlatform: PlatformRatingData;
  platform: Game['platform'];
  topGenre?: Game['genres'][number];
};

function RatedPlatform({
  ratedPlatform,
  platform,
  topGenre
}: RatedPlatformProps) {
  if (!platform) return;

  return (
    <div className='data-block rated-platform'>
      <div className='rating-title'>
        <Rating value={ratedPlatform.rating} />
        <h4 className='colored'>{platform.name}</h4>
      </div>

      <div className='small'>
        <span>Main genre: </span>
        {topGenre ? (
          <span className='colored bold'>{topGenre.name}</span>
        ) : (
          <span>none</span>
        )}
      </div>

      <span className='min'>Best games: </span>
      <div className='data-block-content'>
        {ratedPlatform.topGames.map((topGame) => (
          <div
            key={`${ratedPlatform.id}-${topGame.id}`}
            className='game-title-rating'
          >
            <GameTableTitle game={topGame} />
            <Rating value={topGame.rating} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function HighestRatedPlatforms({
  platformsMap,
  genresMap
}: HighestRatedPlatformsProps) {
  const ratedPlatforms = await getMetricData<PlatformRatingData[]>(
    '/api/games/platforms/rating',
    []
  );

  if (!ratedPlatforms.length)
    return <EmptyMetric message={`You haven't rated any game yet`} />;

  return (
    <div className='blocks-group'>
      {ratedPlatforms.map((ratedPlatform) => (
        <RatedPlatform
          key={`${ratedPlatform.id}-rated`}
          ratedPlatform={ratedPlatform}
          platform={platformsMap.get(ratedPlatform.id)}
          topGenre={genresMap.get(ratedPlatform.topGenre)}
        />
      ))}
    </div>
  );
}
