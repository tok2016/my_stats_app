import { getOtherUser } from '@lib/actions';

import ErrorMessage from '@components/ErrorMessage';

import Dashboard from '@app/(user)/components/profile-info/Dashboard';
import ProfileInfo from '@app/(user)/components/profile-info/ProfileInfo';

export default async function UserPage({
  params
}: {
  params: Promise<{ userId: string }>;
}) {
  try {
    const { userId } = await params;
    const user = await getOtherUser(userId);

    return (
      <div className='metrics'>
        <ProfileInfo user={user} />
        <Dashboard user={user} />
      </div>
    );
  } catch (err) {
    return <ErrorMessage error={err} className='stretch-error' />;
  }
}
