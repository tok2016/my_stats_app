'use client';

import { useRef } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { SearchBaseProps } from '@ts/ui/components-props';
import { User } from '@ts/users/user';

import { getUsers } from '@lib/actions';

import Search from '@components/Search';

import UserOption from './UserOption';

type UserSearchProps = Omit<SearchBaseProps, 'name'>;

const MAX_USERS_OPTIONS = 4;

const getUsersWithKeys =
  (signal: AbortSignal) =>
  async (credential?: string): Promise<(User & { key: string })[]> => {
    const users = await getUsers(credential, MAX_USERS_OPTIONS, signal);
    return users.map((user) => ({ ...user, key: user.username }));
  };

export default function UserSearch({
  id,
  className,
  placeholder = 'Find a user by username',
  onFocus,
  onBlur
}: UserSearchProps) {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const abort = useRef(new AbortController());

  const onUserSearch = (query: string) => {
    abort.current.abort();
    const params = new URLSearchParams();
    params.set('query', query);
    push(`/users?${params.toString()}`);
  };

  return (
    <Search
      className={className}
      id={id}
      name='userSearch'
      placeholder={placeholder}
      action={getUsersWithKeys(abort.current.signal)}
      onSearchSubmit={onUserSearch}
      onFocus={onFocus}
      onBlur={onBlur}
      defaultQuery={searchParams.get('query') ?? undefined}
      renderOption={(user) => <UserOption user={user} />}
    />
  );
}
