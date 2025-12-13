'use client';

import { useRouter } from 'next/navigation';

import { SearchBaseProps } from '@ts/ui/components-props';
import { BasicUser } from '@ts/users/user';

import Search from '@components/Search';
import { getUsers } from '@lib/actions';

type UserSearchProps = Omit<SearchBaseProps, 'id' | 'name'>;

const MAX_USERS_OPTIONS = 4;

const getUsersWithKeys = async (
  credential?: string
): Promise<(BasicUser & { key: string })[]> => {
  const users = await getUsers(credential, MAX_USERS_OPTIONS);
  return users.map((user) => ({ ...user, key: user.username }));
};

export default function UserSearch({
  className,
  placeholder = 'Find a user by username',
  onFocus,
  onBlur
}: UserSearchProps) {
  const { push } = useRouter();

  const onUserSearch = (query: string) => {
    const params = new URLSearchParams();
    params.set('query', query);
    push(`/search?${params.toString()}`);
  };

  return (
    <Search
      className={className}
      id='userSearch'
      name='userSearch'
      placeholder={placeholder}
      action={getUsersWithKeys}
      onSearchSubmit={onUserSearch}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
}
