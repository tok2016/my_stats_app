import { User } from '@ts/users/user';

import { getGames, refreshSteamData } from '@lib/server-actions';
import { generateErrorResponse } from '@lib/utils';

import ErrorMessage from '@components/ErrorMessage';

import MetricPage from '@app/games/(metrics)/components/MetricPage';

type DashboardProps = {
  user: User;
};

export default async function Dashboard({ user }: DashboardProps) {
  try {
    if (user.metrics.length) {
      await refreshSteamData();
    } else {
      throw generateErrorResponse(404, 'Dashboard is empty');
    }

    const games = await getGames({ userId: user.id });
    return (
      <MetricPage metrics={user.metrics} games={games.games} userId={user.id} />
    );
  } catch (error) {
    return <ErrorMessage error={error} className='error-metric' />;
  }
}
