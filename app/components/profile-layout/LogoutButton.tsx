'use client';

import { LogoutSolid } from '@mynaui/icons-react';

import { useUserState } from '@store/user-store';
import { defaultUser } from '@lib/utils';
import { logout } from '@lib/server-actions';
import SidebarOption from './SidebarOption';

export default function LogoutButton() {
  const { setUserState } = useUserState();

  const onLogoutClick = async () => {
    await logout();
    setUserState({ user: defaultUser });
  };

  return (
    <SidebarOption
      name='logout'
      label='Logout'
      icon={<LogoutSolid />}
      onClick={onLogoutClick}
    />
  );
}
