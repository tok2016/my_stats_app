'use client';

import { memo, useEffect, useReducer } from 'react';
import { usePathname } from 'next/navigation';
import { MusicSolid, ControllerSolid } from '@mynaui/icons-react';

import { SidebarOptionProps } from '@ts/ui/components-props';
import { User } from '@ts/users/user';

import UserSearch from '@components/profile-layout/UserSearch';
import LogoutButton from './LogoutButton';
import { useUserState } from '@store/user-store';
import Avatar from './Avatar';
import SidebarOption from './SidebarOption';

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

function SidebarRaw({ user }: { user: User }) {
  const { setUserState, status } = useUserState();

  const [isExpanded, toggleExpand] = useReducer((value) => !value, false);
  const path = usePathname().split('/')[1];

  useEffect(() => {
    setUserState({ user, status: 'success' });
  }, [user, setUserState]);

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : ''}`}>
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
          placeholder='Find user'
          className={path === 'user' || path === 'search' ? 'choosen' : ''}
          onFocus={toggleExpand}
          onBlur={toggleExpand}
        />
      </div>

      <LogoutButton />
    </div>
  );
}

const Sidebar = memo(SidebarRaw);
export default Sidebar;
