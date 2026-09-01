import { GameDetailed } from '@ts/games/game';

import GameCover from '@components/data-blocks/GameCover';
import PropBlock from '@components/data-blocks/PropBlock';

import ScreenshotsCarousel from './ScreenshotsCarousel';

type GameDetailsProps = { game: GameDetailed };

export default function GameDetails({ game }: GameDetailsProps) {
  const releaseData = game.releasedAt ? new Date(game.releasedAt) : undefined;
  const playDate = game.playDate ? new Date(game.playDate) : undefined;

  return (
    <section id='details' className='game-detials'>
      <div className='game-details-collage'>
        <GameCover game={game} />
        {game.screenshots && (
          <ScreenshotsCarousel
            screenshots={game.screenshots}
            gameName={game.name}
            groupKey={game.id}
          />
        )}
      </div>

      <div className='game-detials-info'>
        <div className='game-details-info-block'>
          <PropBlock title='Platfrom'>
            {game.platform ? game.platform.name : '—'}
          </PropBlock>

          <PropBlock title='Release date'>
            {releaseData ? (
              <time dateTime={releaseData.toDateString()}>
                {releaseData.toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </time>
            ) : (
              <span>—</span>
            )}
          </PropBlock>

          <PropBlock title='Last time played'>
            {playDate ? (
              <time dateTime={playDate.toDateString()}>
                {playDate.toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                })}
              </time>
            ) : (
              <span>—</span>
            )}
          </PropBlock>
        </div>

        <div className='game-details-info-block'>
          <PropBlock title='Developers'>
            {game.developers.length
              ? game.developers.map((dev) => dev.name).join(', ')
              : '—'}
          </PropBlock>

          <PropBlock title='Publishers'>
            {game.publishers.length
              ? game.publishers.map((pub) => pub.name).join(', ')
              : '—'}
          </PropBlock>

          <PropBlock title='Series'>
            {game.series ? game.series.name : '—'}
          </PropBlock>
        </div>

        <div className='game-details-info-block'>
          <PropBlock title='Genres'>
            {game.genres.length
              ? game.genres.map((genre) => genre.name).join(', ')
              : '—'}
          </PropBlock>

          <PropBlock title='Themes'>
            {game.themes.length
              ? game.themes.map((theme) => theme.name).join(', ')
              : '—'}
          </PropBlock>
        </div>
      </div>
    </section>
  );
}
