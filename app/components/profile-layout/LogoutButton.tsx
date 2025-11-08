'use client';

import { Icon } from '@iconify/react';

import { useUserState } from '@store/user-store';
import SidebarButton from './SidebarButton';
import { defaultUser, getIconCode } from '@lib/utils';
import { logout } from '@lib/server-actions';

export default function LogoutButton() {
  const { setUserState } = useUserState();

  const onLogoutClick = async () => {
    await logout();
    setUserState({ user: defaultUser });
  };

  return (
    <SidebarButton
      name='logout'
      label='Logout'
      icon={<Icon icon={getIconCode('logout-solid')} />}
      onClick={onLogoutClick}
    />
  );
}
