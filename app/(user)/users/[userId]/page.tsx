import { User } from '@ts/users/user';

import AxiosInstanse from '@lib/axios-instanse';

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
    const response = await AxiosInstanse.get<User>(`/api/user/${userId}`);

    return (
      <div className='metrics'>
        <ProfileInfo user={response.data} />
        <Dashboard user={response.data} />
      </div>
    );
  } catch (err) {
    return <ErrorMessage error={err} className='stretch-error' />;
  }
}
