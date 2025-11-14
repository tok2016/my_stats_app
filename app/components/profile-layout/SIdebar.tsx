'use client';

import { useReducer } from 'react';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';

import { SidebarButtonProps } from '@ts/ui/components-props';

import { getIconCode } from '@lib/utils';
import SidebarButton from './SidebarButton';
import UserButton from './UserButton';
import UserSearch from '@components/UserSearch';
import LogoutButton from './LogoutButton';

const SidebarButtons: SidebarButtonProps[] = [
  {
    name: 'music',
    label: 'Music',
    icon: <Icon icon={getIconCode('music-solid')} />,
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
    icon: <Icon icon={getIconCode('controller-solid')} />,
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

export default function Sidebar() {
  const [isExpanded, toggleExpand] = useReducer((value) => !value, false);
  const path = usePathname().split('/')[1];

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : ''}`}>
      <div className='sidebar-upper'>
        <UserButton />

        {SidebarButtons.map((sidebarButton, i) => (
          <SidebarButton key={i} {...sidebarButton} />
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
