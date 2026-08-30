'use client';

import { Share, Wrench } from '@mynaui/icons-react';

import Link from 'next/link';

import { User } from '@ts/users/user';

import IconButton from '@components/IconButton';
import Logo from '@components/Logo';
import Avatar from '@components/profile-layout/Avatar';

import CountryDataFetch from '../country/CountryDataFetch';
import PublishButton from '../publish-controlls/PublishButton';
import ProfileCreditsSkeleton from './ProfileCreditsSkeleton';

type ProfileInfoProps = {
  user: User;
  authorized?: boolean;
  loading?: boolean;
};

const formatBirthdate = (birthdate: Date | string) => {
  const date = new Date(birthdate);
  const localeDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    day: '2-digit',
    month: 'long'
  });

  const age =
    new Date(Date.now() - date.getTime()).getFullYear()
    - new Date(0).getFullYear();

  return `${localeDate} (${age} y.o.)`;
};

export default function ProfileInfo({
  user,
  authorized = false,
  loading = false
}: ProfileInfoProps) {
  const onShare = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/users/${user.username}`
    );
  };

  return (
    <div className='profile-info'>
      <Avatar
        username={user.username}
        avatarId={user.avatarUrl}
        loading={loading}
      />

      {loading ? (
        <ProfileCreditsSkeleton />
      ) : (
        <div className='profile-credits'>
          <h2>{user.username}</h2>

          <div className='profile-details'>
            <a
              className='colored'
              href={`mailto:${user.email}`}
              target='_blank'
            >
              <h3>{user.email}</h3>
            </a>

            {user.birthdate ? (
              <p>{formatBirthdate(user.birthdate)}</p>
            ) : (
              <p>Unknown date of birth</p>
            )}

            {user.country ? (
              <CountryDataFetch country={user.country} />
            ) : (
              <p>Unknown country</p>
            )}
          </div>
        </div>
      )}

      <div className='profile-meta'>
        <Logo />

        {!authorized || (
          <div className='profile-controlls'>
            <PublishButton isPublic={user.isPublic} loading={loading} />

            <IconButton
              icon={<Share />}
              loading={loading}
              disabled={!user.isPublic}
              onClick={onShare}
            />

            <Link href='/iam/settings'>
              <IconButton icon={<Wrench />} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
