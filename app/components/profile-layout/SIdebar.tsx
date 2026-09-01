'use client';

import { memo, useReducer } from 'react';

import { usePathname } from 'next/navigation';

import { UserSet } from '@ts/users/user';

import { defaultUser } from '@lib/utils';

import GuestSidebar from './GuestSidebar';
import ProfileSidebar from './ProfileSidebar';

type SidebarProps = {
  user?: UserSet;
  authorized?: boolean;
};

function SidebarRaw({ user = defaultUser, authorized = false }: SidebarProps) {
  const [isExpanded, toggleExpand] = useReducer((value) => !value, false);
  const path = usePathname().split('/')[1];

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : ''}`}>
      {authorized ? (
        <ProfileSidebar user={user} path={path} expand={toggleExpand} />
      ) : (
        <GuestSidebar path={path} expand={toggleExpand} />
      )}
    </div>
  );
}

const Sidebar = memo(SidebarRaw);
export default Sidebar;
