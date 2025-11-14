'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';

import { useUserState } from '@store/user-store';
import SidebarButton from './SidebarButton';
import AxiosInstanse from '@lib/axios-instanse';
import { getIconCode } from '@lib/utils';

const AVATAR_WIDTH = 150;

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
      icon={
        user.avatarUrl ? (
          <Image
            src={`/api/avatar/${user.avatarUrl}`}
            alt=''
            width={AVATAR_WIDTH}
            height={AVATAR_WIDTH}
          />
        ) : (
          <Icon icon={getIconCode('user-square-solid')} />
        )
      }
    />
  );
}
