'use client';

import { LoginSolid } from '@mynaui/icons-react';

import { SidebarModuleProps } from '@ts/ui/components-props';

import SidebarOption from './SidebarOption';
import UserSearch from './UserSearch';

export default function GuestSidebar({ path, expand }: SidebarModuleProps) {
  return (
    <div className='sidebar-upper'>
      <SidebarOption
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
    </div>
  );
}
