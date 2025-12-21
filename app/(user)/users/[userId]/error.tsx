'use client';

import UserSearch from '@components/profile-layout/UserSearch';
import { UserX } from '@mynaui/icons-react';

export default function UserError() {
  return (
    <div className='not-found'>
      <UserX />
      <span>{`User was not found`}</span>
      <UserSearch placeholder='Find another user' id='errorSearch' />
    </div>
  );
}
