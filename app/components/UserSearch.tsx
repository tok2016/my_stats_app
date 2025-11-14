'use client';

import Search from '@components/Search';
import { SearchProps } from '@ts/ui/components-props';
import { useRouter } from 'next/navigation';

type UserSearchProps = Omit<SearchProps, 'id' | 'name' | 'onSearch'>;

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
      id='user-search'
      name='user-search'
      placeholder={placeholder}
      onSearch={onUserSearch}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
}
