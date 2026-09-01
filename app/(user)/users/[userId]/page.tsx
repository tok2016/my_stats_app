import { getOtherUser } from '@lib/actions';
import { getGames } from '@lib/server-actions';

import ProfileInfo from '@app/(user)/components/profile-info/ProfileInfo';
import Metric from '@app/games/(metrics)/Metric';

export default async function UserPage({
  params
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const user = await getOtherUser(userId);
  const games = await getGames(user.id);

  return (
    <div className='metrics'>
      <ProfileInfo user={{ ...user, metrics: new Set(user.metrics) }} />
      {user.metrics.map((metricId) => (
        <Metric id={metricId} games={games} key={metricId} userId={user.id} />
      ))}
    </div>
  );
}
