'use client';

import Search from '@components/Search';
import { useRouter } from 'next/navigation';

type UserSearchProps = {
  className?: string;
  placeholder?: string;
};

export default function UserSearch({
  className,
  placeholder = 'Find a user by username'
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
      id='user-search'
      name='user-search'
      placeholder={placeholder}
      onSearch={onUserSearch}
    />
  );
}
