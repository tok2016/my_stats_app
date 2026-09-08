import { getCurrentUser } from '@lib/server-actions';

import Dashboard from '@app/(user)/components/profile-info/Dashboard';
import ProfileInfo from '@app/(user)/components/profile-info/ProfileInfo';

export default async function IamPage() {
  const user = await getCurrentUser();

  return (
    <div className='metrics'>
      <ProfileInfo user={user} authorized />
      <Dashboard user={user} />
    </div>
  );
}
