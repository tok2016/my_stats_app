import { SearchX } from '@mynaui/icons-react';

import Pagination from '@components/Pagination';
import UserSearch from '@components/profile-layout/UserSearch';
import { getUsers } from '@lib/actions';
import { getUserCountries } from '@lib/server-actions';
import UserPreview from '../components/UserPreview';

type UsersParams = { query: string; page?: string };

const USER_PER_PAGE = 10;

export default async function UsersPage({
  searchParams
}: {
  searchParams: Promise<UsersParams>;
}) {
  const { query, page } = await searchParams;

  const parsedPage = page ? parseInt(page) : 1;

  const users = await getUsers(query);
  const countries = await getUserCountries(users);

  const startIndex = isNaN(parsedPage) ? 0 : (parsedPage - 1) * USER_PER_PAGE;
  const endIndex = isNaN(parsedPage)
    ? users.length
    : parsedPage * USER_PER_PAGE - 1;

  const pages = Math.ceil(users.length / USER_PER_PAGE);

  return (
    <div className='users-list'>
      <div className='users-search'>
        <h2>{query ? `"${query}" search results` : 'Users search'}</h2>
        <UserSearch id='resultsSearch' />
      </div>

      <div className={`no-results ${!query || users.length ? 'hidden' : ''}`}>
        <SearchX />
        <span>{`Users with this username weren't found`}</span>
      </div>

      <div className='found-users'>
        {users.slice(startIndex, endIndex).map((user) => (
          <UserPreview key={user.id} user={user} country={countries[user.id]} />
        ))}
      </div>

      {users.length <= USER_PER_PAGE || (
        <Pagination pages={pages} current={parsedPage ?? 1} />
      )}
    </div>
  );
}
