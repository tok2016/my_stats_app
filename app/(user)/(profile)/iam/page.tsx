'use client';

import ProfileInfo from '@app/(user)/components/ProfileInfo';
import { useUserState } from '@store/user-store';

export default function IamPage() {
  const { user, status } = useUserState();

  return (
    <ProfileInfo
      user={user}
      authorized
      loading={status === 'idle' || status === 'pending'}
    />
  );
}
