'use client';

import Search from '@components/Search';
import { useRouter } from 'next/navigation';

type UserSearchProps = {
  className?: string;
};

export default function UserSearch({ className }: UserSearchProps) {
  const { push } = useRouter();

  const onUserSearch = (query: string) => {
    const params = new URLSearchParams();
    params.set('query', query);
    push(`/search?${params.toString()}`);
  };

  return (
    <Search
      className={className}
      id='user-search'
      placeholder='Find a user by username'
      onSearch={onUserSearch}
    />
  );
}
