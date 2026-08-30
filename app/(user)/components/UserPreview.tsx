import Link from 'next/link';

import Country from '@ts/users/country';
import { User } from '@ts/users/user';

import Avatar from '@components/profile-layout/Avatar';

import CountryData from './country/CountryData';

type UserPreviewProps = {
  user: User;
  country?: Country;
};

export default function UserPreview({ user, country }: UserPreviewProps) {
  return (
    <Link href={`/users/${user.id}`} className='user-preview'>
      <Avatar username={user.username} avatarId={user.avatarUrl} />

      <div className='user-credits'>
        <h3>{user.username}</h3>
        <h4>{user.email}</h4>
        {!country || <CountryData country={country} />}
      </div>
    </Link>
  );
}
