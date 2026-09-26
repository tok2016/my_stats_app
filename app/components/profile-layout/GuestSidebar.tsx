'use client';

import { LoginSolid } from '@mynaui/icons-react';

import { SidebarModuleProps } from '@ts/ui/components-props';

import SidebarButtonsGroup from './SidebarButtonsGroup';
import UserSearch from './UserSearch';

/**
 * @param props
 * @param props.path - Current page's path.
 * @param props.expand - Expand sidebar.
 * @returns Sidebar navigation for unauthorized user.
 */
export default function GuestSidebar({ path, expand }: SidebarModuleProps) {
  return (
    <nav className='sidebar-upper'>
      <SidebarButtonsGroup
        label='Login'
        name='login'
        href='/login'
        icon={<LoginSolid />}
      />

      <UserSearch
        id='sidebarSearch'
        placeholder='Find user'
        className={path === 'users' ? 'choosen' : ''}
        onFocus={expand}
        onBlur={expand}
      />
    </nav>
  );
}
