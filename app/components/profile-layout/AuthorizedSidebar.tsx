'use client';

import { ControllerSolid, LogoutSolid, MusicSolid } from '@mynaui/icons-react';
import { memo, useEffect } from 'react';

import {
  SidebarModuleProps,
  SidebarOptionProps
} from '@ts/ui/components-props';
import { User } from '@ts/users/user';

import { logout } from '@lib/server-actions';
import { ModulesPathsAndNames, defaultUser } from '@lib/utils';

import { useUserState } from '@store/user-store';

import Avatar from './Avatar';
import SidebarButton from './SidebarButton';
import SidebarButtonsGroup from './SidebarButtonsGroup';
import UserSearch from './UserSearch';

type AuthorizedSidebarProps = SidebarModuleProps & {
  user: User;
};

const SidebarOptions: SidebarOptionProps[] = [
  {
    name: 'music',
    label: 'Music',
    icon: <MusicSolid />,
    disabled: true,
    subButtons: Object.entries(ModulesPathsAndNames)
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
    subButtons: Object.entries(ModulesPathsAndNames)
      .filter((entry) => entry[0].startsWith('/games'))
      .map((entry) => ({
        ...entry[1],
        href: entry[0]
      }))
  }
];

/**
 * @param props
 * @param props.user - User data.
 * @param props.path - Current page's path.
 * @param props.expand - Expand sidebar.
 * @returns Sidebat navigation options for authorized user.
 */
function AuthorizedSidebarRaw({ user, path, expand }: AuthorizedSidebarProps) {
  const { setUserState, status } = useUserState();

  const onLogout = async () => {
    await logout();
    setUserState({ user: { ...defaultUser, metrics: new Set() } });
  };

  useEffect(() => {
    setUserState({
      user: { ...user, metrics: new Set(user.metrics) },
      status: 'success'
    });
  }, [user, setUserState]);

  return (
    <>
      <nav className='sidebar__navigation'>
        <SidebarButton
          name='iam'
          label={user.username}
          loading={status === 'pending'}
          href='/iam'
          icon={<Avatar username={user.username} avatarId={user.avatarUrl} />}
        />

        {SidebarOptions.map((sidebarOption) => (
          <SidebarButtonsGroup key={sidebarOption.name} {...sidebarOption} />
        ))}

        <UserSearch
          id='sidebarSearch'
          placeholder='Find user'
          className={path === 'users' ? 'choosen' : ''}
          onFocus={expand}
          onBlur={expand}
        />
      </nav>

      <SidebarButton
        name='logout'
        label='Logout'
        icon={<LogoutSolid />}
        onClick={onLogout}
      />
    </>
  );
}

/**
 * @param props
 * @param props.user - User data.
 * @param props.path - Current page's path.
 * @param props.expand - Expand sidebar.
 * @returns Sidebat navigation options for authorized user.
 */
const AuthorizedSidebar = memo(AuthorizedSidebarRaw);
export default AuthorizedSidebar;
