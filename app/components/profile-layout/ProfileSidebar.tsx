'use client';

import { memo, useEffect } from 'react';
import { ControllerSolid, LogoutSolid, MusicSolid } from '@mynaui/icons-react';

import { User } from '@ts/users/user';

import SidebarOption from './SidebarOption';
import { useUserState } from '@store/user-store';
import Avatar from './Avatar';
import {
  SidebarModuleProps,
  SidebarOptionProps
} from '@ts/ui/components-props';
import UserSearch from './UserSearch';
import { logout } from '@lib/server-actions';
import { defaultUser } from '@lib/utils';

type AuthorizedSidebarProps = SidebarModuleProps & {
  user: User;
};

const SidebarOptions: SidebarOptionProps[] = [
  {
    name: 'music',
    label: 'Music',
    icon: <MusicSolid />,
    subButtons: [
      {
        name: 'genres',
        label: 'Genres & Tags',
        href: '/music/genres'
      },
      {
        name: 'artists',
        label: 'Artists',
        href: '/music/artists'
      },
      {
        name: 'albums',
        label: 'Albums',
        href: '/music/albums'
      },
      {
        name: 'tracks',
        label: 'Tracks',
        href: '/music/tracks'
      },
      {
        name: 'library',
        label: 'Library',
        href: '/music/library'
      }
    ]
  },
  {
    name: 'games',
    label: 'Video Games',
    icon: <ControllerSolid />,
    subButtons: [
      {
        name: 'genres',
        label: 'Genres & Tags',
        href: '/games/genres'
      },
      {
        name: 'developers',
        label: 'Developers',
        href: '/games/developers'
      },
      {
        name: 'platforms',
        label: 'Platforms',
        href: '/games/platforms'
      },
      {
        name: 'items',
        label: 'Video Games',
        href: '/games/items'
      },
      {
        name: 'library',
        label: 'Library',
        href: '/music/library'
      }
    ]
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
          icon={<Avatar avatarId={user.avatarUrl} />}
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
