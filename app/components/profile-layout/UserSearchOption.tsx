import Link from 'next/link';

import { User } from '@ts/users/user';

import Avatar from './Avatar';

type UserOptionProps = {
  user: User;
};

/**
 * @param props
 * @param props.user - User data to preview.
 * @returns User preview block for search option.
 */
export default function UserSearchOption({ user }: UserOptionProps) {
  return (
    <Link href={`/users/${user.id}`} className='user-search-option'>
      <Avatar username={user.username} avatarId={user.avatarUrl} />

      <div className='user-credits'>
        <h4>{user.username}</h4>
        <p>{user.email}</p>
      </div>
    </Link>
  );
}
