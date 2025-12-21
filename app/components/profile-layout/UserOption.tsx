import Link from 'next/link';

import { BasicUser } from '@ts/users/user';

import Avatar from './Avatar';

type UserOptionProps = {
  user: BasicUser;
};

export default function UserOption({ user }: UserOptionProps) {
  return (
    <Link href={`/users/${user.id}`} className='user-option'>
      <Avatar avatarId={user.avatarUrl} />

      <div className='user-credits'>
        <h4>{user.username}</h4>
        <p>{user.email}</p>
      </div>
    </Link>
  );
}
