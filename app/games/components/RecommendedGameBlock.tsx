import { RecommendedGame } from '@ts/games/game';

import GameCollage from '@components/data-blocks/GameCollage';
import PropBlock from '@components/data-blocks/PropBlock';

type ExternalLinkProps = {
  external: RecommendedGame['external'][number];
  last?: boolean;
};

function ExternalLink({ external, last }: ExternalLinkProps) {
  const separator = last ? '' : ', ';
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

export default function RecommendedGameBlock(game: RecommendedGame) {
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

      <PropBlock title='Genres'>
        {game.genres.length
          ? game.genres.map((genre) => genre.name).join(', ')
          : '—'}
      </PropBlock>

      <PropBlock title='Available at'>
        {game.external.length
          ? game.external.map((external, i, arr) => (
              <ExternalLink
                key={`${external.id}-external`}
                external={external}
                last={i === arr.length - 1}
              />
            ))
          : '—'}
      </PropBlock>
    </div>
  );
}
