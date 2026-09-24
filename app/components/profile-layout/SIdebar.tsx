'use client';

import { memo, useReducer } from 'react';

import { usePathname } from 'next/navigation';

import { User } from '@ts/users/user';

import AuthorizedSidebar from './AuthorizedSidebar';
import GuestSidebar from './GuestSidebar';

type SidebarProps = {
  user?: User;
  authorized?: boolean;
};

/**
 * @param props
 * @param props.user - User data.
 * @param props.authorized - Is sidebar for authorized user.
 * @returns Sidebar with navigation.
 */
function SidebarRaw({ user, authorized = false }: SidebarProps) {
  const [isExpanded, toggleExpand] = useReducer((value) => !value, false);
  const path = usePathname().split('/')[1];

  return (
    <header className={`sidebar ${isExpanded ? 'expanded' : ''}`}>
      {authorized && user ? (
        <AuthorizedSidebar user={user} path={path} expand={toggleExpand} />
      ) : (
        <GuestSidebar path={path} expand={toggleExpand} />
      )}
    </header>
  );
}

/**
 * @param props
 * @param props.user - User data.
 * @param props.authorized - Is sidebar for authorized user.
 * @returns Sidebar with navigation.
 */
const Sidebar = memo(SidebarRaw);
export default Sidebar;
