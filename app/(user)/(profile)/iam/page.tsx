import { getGames, getUserSet, refreshSteamData } from '@lib/server-actions';

import ProfileInfo from '@app/(user)/components/profile-info/ProfileInfo';
import Metric from '@app/games/(metrics)/Metric';

export default async function IamPage() {
  const user = await getUserSet();

  if (user.metrics.size) {
    await refreshSteamData();
  }

  const games = await getGames(user.id);

  return (
    <div className='metrics'>
      <ProfileInfo user={user} authorized />
      {user.metrics.values().map((metric) => (
        <Metric id={metric} games={games} key={metric} userId={user.id} />
      ))}
    </div>
  );
}
