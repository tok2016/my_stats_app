import { Suspense } from 'react';

import { getUsers } from '@lib/actions';
import { getUserCountries } from '@lib/server-actions';

import ErrorMessage from '@components/ErrorMessage';
import Pagination from '@components/Pagination';
import UserSearch from '@components/profile-layout/UserSearch';

import UserPreview from '../components/UserPreview';

type UsersParams = { query: string; page?: string };

const USER_PER_PAGE = 10;

export default async function UsersPage({
  searchParams
}: {
  searchParams: Promise<UsersParams>;
}) {
  try {
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
          <h2>Users search</h2>
          <Suspense>
            <UserSearch id='resultsSearch' />
          </Suspense>
        </div>

        <div className='found-users'>
          {users.slice(startIndex, endIndex).map((user) => (
            <UserPreview
              key={user.id}
              user={user}
              country={countries[user.id]}
            />
          ))}
        </div>

        {users.length <= USER_PER_PAGE || (
          <Suspense>
            <Pagination pages={pages} current={parsedPage ?? 1} />
          </Suspense>
        )}
      </div>
    );
  } catch (err) {
    return (
      <div className='users-list'>
        <div className='users-search'>
          <h2>Users search</h2>
          <Suspense>
            <UserSearch id='resultsSearch' />
          </Suspense>
          <ErrorMessage error={err} className='stretch-error' />
        </div>
      </div>
    );
  }
}
