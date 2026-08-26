import Game from '@ts/games/game';

import ObjectMapArray from '@lib/object-map-array';

import games from '../../../mock data/games.json';

export default function TestArrPage() {
  const objArr = new ObjectMapArray<Game, 'id'>(games, 'id');
  const dropTake = objArr.drop(5).take(5);

  const screenshots = objArr.flatMap((game) => game.screenshots ?? []).take(4);
  const devs = objArr
    .flatMapByKey<
      Game['developers'][number],
      'id'
    >((game) => game.developers, 'id')
    .take(2);

  const hours = objArr.map((game) => game.hours).take(4);
  const platfroms = objArr
    .mapByKey<Game['platform'], 'id'>((game) => game.platform, 'id')
    .take(2);

  const found = objArr.findByKey('6984ae589ef387f573e7dc26');

  return (
    <section>
      <div>
        <h2>drop take</h2>
        {dropTake.map((game) => <p key={game.id}>{game.name}</p>).toArray()}
      </div>

      <div>
        <h2>screenshots</h2>
        {screenshots.map((screen) => <p key={screen}>{screen}</p>).toArray()}
      </div>

      <div>
        <h2>hours</h2>
        {hours.map((h, i) => <p key={h + i}>{h}</p>).toArray()}
      </div>

      <div>
        <h2>devs</h2>
        {devs.map((dev) => <p key={dev.id}>{dev.name}</p>).toArray()}
      </div>

      <div>
        <h2>platforms</h2>
        {platfroms
          .map((plat, i) => <p key={`${plat.id}-${i}`}>{plat.name}</p>)
          .toArray()}
      </div>

      <div>
        <h2>found</h2>
        <p>{found?.name}</p>
      </div>
    </section>
  );
}
