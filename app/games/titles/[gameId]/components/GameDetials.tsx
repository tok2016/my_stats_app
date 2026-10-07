import { GameDetailed } from '@ts/games/game';

import GameCover from '@components/data-blocks/GameCover';
import PropBlock from '@components/data-blocks/PropBlock';

import ScreenshotsCarousel from './ScreenshotsCarousel';

type GameDetailsProps = { game: GameDetailed };

/**
 * @param props
 * @param props.game - Detailed game data to display.
 * @returns Grid with game details props data.
 */
export default function GameDetails({ game }: GameDetailsProps) {
  const releaseData = game.releasedAt ? new Date(game.releasedAt) : undefined;
  const playDate = game.playDate ? new Date(game.playDate) : undefined;

  return (
    <section id='details' className='game-title-page__details'>
      <div className='game-title-page__details__collage'>
        <GameCover game={game} />
        {game.screenshots && (
          <ScreenshotsCarousel
            screenshots={game.screenshots}
            gameName={game.name}
            groupKey={game.id}
          />
        )}
      </div>

      <div className='game-title-page__details__data'>
        <div className='game-title-page__details__data__props'>
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

        <div className='game-title-page__details__data__props'>
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

        <div className='game-title-page__details__data__props'>
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
