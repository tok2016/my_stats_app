import { Suspense } from 'react';

import TagsMenu from './TagsMenu';
import TopTagsChart from './TopTagsChart';
import { getTagsData } from './server-actions';
import './tags.scss';
import { DEFAULT_TOP_SIZE } from './utils';

export default async function Tags({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { tagid, top, query } = await searchParams;
  const parsedTop = top
    ? parseInt(Array.isArray(top) ? top[0] : top)
    : DEFAULT_TOP_SIZE;

  const tagsData = await getTagsData();

  const clearQuery = (Array.isArray(query) ? query[0] : query)
    ?.trim()
    .toLowerCase();

  return (
    <div
      className='user'
      style={{
        display: 'grid',
        gridTemplateColumns: '3fr 1fr',
        gap: '1em'
      }}
    >
      <Suspense>
        <TopTagsChart
          tagsids={tagid}
          top={Number.isNaN(parsedTop) ? DEFAULT_TOP_SIZE : parsedTop}
          tagsData={tagsData}
        />
      </Suspense>

      <Suspense>
        <TagsMenu
          filteredTags={tagsData.filter(
            (tag) =>
              !clearQuery || tag.name.toLowerCase().startsWith(clearQuery)
          )}
          tagsIds={tagid?.split(',') ?? []}
        />
      </Suspense>
    </div>
  );
}
