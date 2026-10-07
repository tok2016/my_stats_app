import { Suspense } from 'react';

import { getUsers } from '@lib/actions';
import { getUsersCountriesData } from '@lib/server-actions';

import ErrorMessage from '@components/ErrorMessage';
import Pagination from '@components/Pagination';
import UserSearch from '@components/profile-layout/UserSearch';

import UserPreview from '../components/UserPreview';

type UsersParams = { query?: string; page?: string };

const USER_PER_PAGE = 10;

/**
 * @param param0 - Search params.
 * @returns Page with found users list.
 */
export default async function UsersPage({
  searchParams
}: {
  searchParams: Promise<UsersParams>;
}) {
  try {
    //Parses search params.
    const { query, page } = await searchParams;
    const parsedPage = page ? parseInt(page) : 1;

    //Finds users and their countries by query.
    const users = await getUsers(query);
    const countries = await getUsersCountriesData(users);

    //Forms pagination params.
    const startIndex = isNaN(parsedPage) ? 0 : (parsedPage - 1) * USER_PER_PAGE;
    const endIndex = isNaN(parsedPage)
      ? users.length
      : parsedPage * USER_PER_PAGE - 1;

    const pages = Math.ceil(users.length / USER_PER_PAGE);

    return (
      <div className='users-list'>
        <div className='users-list__search'>
          <h2>Users search</h2>
          <Suspense>
            <UserSearch id='resultsSearch' />
          </Suspense>
        </div>

        <div className='users-list__results'>
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
        <div className='users-list__search'>
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
