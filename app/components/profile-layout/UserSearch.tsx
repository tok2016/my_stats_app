'use client';

import { useRef } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { SearchBaseProps } from '@ts/ui/components-props';
import { User } from '@ts/users/user';

import { getUsers } from '@lib/actions';
import { useAction } from '@lib/hooks';

import Search from '@components/Search';

import UserSearchOption from './UserSearchOption';

type UserSearchProps = Omit<SearchBaseProps, 'name'>;

const MAX_USERS_OPTIONS = 4;

/**
 * @param signal
 * @returns Users list with username or email that includes given query.
 */
const getUsersWithKeys =
  (signal: AbortSignal) =>
  async (credential?: string): Promise<(User & { key: string })[]> => {
    const users = await getUsers(credential, MAX_USERS_OPTIONS, signal);
    return users.map((user) => ({ ...user, key: user.username }));
  };

/**
 * @param props
 * @param props.id - Input id.
 * @param props.className - Input class.
 * @param props.placeholder - Input placeholder.
 * @param props.onFocus - On input focus.
 * @param props.onBlur - On input blur.
 * @returns
 */
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

  const [users, search, isPending] = useAction(
    getUsersWithKeys(abort.current.signal),
    []
  );

  const onUserSearch = (query?: string) => {
    abort.current.abort();
    const params = new URLSearchParams();
    if (query) params.set('query', query);

    push(`/users?${params.toString()}`);
  };

  return (
    <Search
      className={className}
      id={id}
      name='userSearch'
      placeholder={placeholder}
      options={users}
      loading={isPending}
      onType={search}
      onSearchSubmit={onUserSearch}
      onFocus={onFocus}
      onBlur={onBlur}
      defaultQuery={searchParams.get('query') ?? undefined}
      renderOption={(user) => <UserSearchOption user={user} />}
    />
  );
}
