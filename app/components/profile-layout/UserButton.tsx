'use client';

import { useEffect } from 'react';

import { useUserState } from '@store/user-store';
import SidebarButton from './SidebarButton';
import AxiosInstanse from '@lib/axios-instanse';
import Avatar from './Avatar';

export default function UserButton() {
  const { user, status, setUserState } = useUserState();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await AxiosInstanse.get('/api/user');
        setUserState({ user: response.data, status: 'success' });
      } catch {
        setUserState({ status: 'error' });
      }
    };

    setUserState({ status: 'pending' });
    getUser();
  }, [setUserState]);

  return (
    <SidebarButton
      name='iam'
      label={user.username}
      loading={status === 'idle' || status === 'pending'}
      href='/iam'
      icon={<Avatar avatarId={user.avatarUrl} />}
    />
  );
}
