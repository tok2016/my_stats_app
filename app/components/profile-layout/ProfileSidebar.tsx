'use client';

import { ControllerSolid, LogoutSolid, MusicSolid } from '@mynaui/icons-react';
import { memo, useEffect } from 'react';

import {
  SidebarModuleProps,
  SidebarOptionProps
} from '@ts/ui/components-props';
import { UserSet } from '@ts/users/user';

import { logout } from '@lib/server-actions';
import { ModulesPaths, defaultUser } from '@lib/utils';

import { useUserState } from '@store/user-store';

import Avatar from './Avatar';
import SidebarOption from './SidebarOption';
import UserSearch from './UserSearch';

type AuthorizedSidebarProps = SidebarModuleProps & {
  user: UserSet;
};

const SidebarOptions: SidebarOptionProps[] = [
  {
    name: 'music',
    label: 'Music',
    icon: <MusicSolid />,
    subButtons: Object.entries(ModulesPaths)
      .filter((entry) => entry[0].startsWith('/music'))
      .map((entry) => ({
        ...entry[1],
        href: entry[0]
      }))
  },
  {
    name: 'games',
    label: 'Video Games',
    icon: <ControllerSolid />,
    subButtons: Object.entries(ModulesPaths)
      .filter((entry) => entry[0].startsWith('/games'))
      .map((entry) => ({
        ...entry[1],
        href: entry[0]
      }))
  }
];

function ProfileSidebarRaw({ user, path, expand }: AuthorizedSidebarProps) {
  const { setUserState, status } = useUserState();

  const onLogout = async () => {
    await logout();
    setUserState({ user: defaultUser });
  };

  useEffect(() => {
    setUserState({ user, status: 'success' });
  }, [user, setUserState]);

  return (
    <>
      <div className='sidebar-upper'>
        <SidebarOption
          name='iam'
          label={user.username}
          loading={status === 'pending'}
          href='/iam'
          icon={<Avatar username={user.username} avatarId={user.avatarUrl} />}
        />

        {SidebarOptions.map((sidebarOption) => (
          <SidebarOption key={sidebarOption.name} {...sidebarOption} />
        ))}

        <UserSearch
          id='sidebarSearch'
          placeholder='Find user'
          className={path === 'users' ? 'choosen' : ''}
          onFocus={expand}
          onBlur={expand}
        />
      </div>

      <SidebarOption
        name='logout'
        label='Logout'
        icon={<LogoutSolid />}
        onClick={onLogout}
      />
    </>
  );
}

const ProfileSidebar = memo(ProfileSidebarRaw);
export default ProfileSidebar;
