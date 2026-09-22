'use client';

import {
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Tooltip
} from 'chart.js';
import { useEffect, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';

import { Option } from '@ts/ui/components-props';

import { useAction, useURLSearchParams } from '@lib/hooks';
import ObjectMapArray from '@lib/object-map-array';

import Select from '@components/Select';
import Spinner from '@components/Spinner';

import Tag from './Tag';
import { SteamTag, getSteamTopSellersPage } from './server-actions';
import { Colors, GAMES_PER_PAGE, TOP_MIXES, TOP_TAGS_SIZE } from './utils';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
Chart.defaults.color = '#dee4e6';
Chart.defaults.borderColor = '#dee4e6';

type TagCount = {
  id: string;
  count: number;
};

type TagCountMixes = TagCount & {
  mixes: ObjectMapArray<TagCount, 'id'>;
};

type Tag = {
  id: string;
  count: number;
  mixes: TagCount[];
};

const isHTMLElement = (el: unknown): el is HTMLElement =>
  typeof (el as HTMLElement)?.dataset !== 'undefined';

const TopOptions: Option[] = [50, 100, 250, 500].map((size) => {
  const sizeStr = size.toString();
  return {
    value: sizeStr,
    label: sizeStr,
    key: `top-${sizeStr}`
  };
});

/**
 * Scraps steam top sellers page to retrieve tags of top games.
 * @param page Steam page number to scrap.
 * @param tagsids Tags IDs to filter by.
 * @returns Tags of every top seller.
 */
const scrapPage = async (
  page: number,
  tagsids: Set<string>
): Promise<string[][]> => {
  const docs = await getSteamTopSellersPage(page, tagsids.values().toArray());

  const pageContainer = document.createElement('div');
  pageContainer.innerHTML = docs;
  const games = pageContainer.querySelectorAll('.search_result_row');

  const tags: string[][] = [];

  for (const game of games) {
    if (isHTMLElement(game)) {
      const tagsStr = game.dataset['dsTagids'] ?? '[]';
      tags.push(
        tagsStr
          .substring(1, tagsStr.length - 1)
          .split(',')
          .filter((tag) => !tagsids.has(tag))
      );
    }
  }

  return tags;
};

/**
 * Scraps multiple pages of steam top sellers and forms top tags with top combinations.
 * @param params - Filter params: Count of pages to scrap and tags IDs to filter by
 * @returns Top tags by games count with top combinations with other tags.
 */
const scrap = async (params: {
  pagesCount: number;
  tagsids: Set<string>;
}): Promise<Tag[]> => {
  const tagsCountMixes = new ObjectMapArray<TagCountMixes, 'id'>([], 'id');

  const promises = Array.from({ length: params.pagesCount }, (_, page) =>
    scrapPage(page + 1, params.tagsids)
  );
  const gamesTags = (await Promise.all(promises)).flat();

  for (const tags of gamesTags) {
    for (let i = 0; i < tags.length; i++) {
      const tagCountEl = tagsCountMixes.findByKey(tags[i]);
      if (!tagCountEl) {
        const mixes = new ObjectMapArray<TagCount, 'id'>([], 'id');
        tagsCountMixes.push({
          id: tags[i],
          count: 1,
          mixes
        });

        for (let j = 0; j < tags.length; j++) {
          if (i === j) continue;
          mixes.push({ id: tags[j], count: 1 });
        }
      } else {
        tagCountEl.count++;
        for (let j = 0; j < tags.length; j++) {
          if (i === j) continue;
          const mix = tagCountEl.mixes.findByKey(tags[j]);
          if (!mix) tagCountEl.mixes.push({ id: tags[j], count: 1 });
          else mix.count++;
        }
      }
    }
  }

  const topTags = tagsCountMixes
    .sort((a, b) => b.count - a.count)
    .take(TOP_TAGS_SIZE)
    .map((el) => ({
      ...el,
      mixes: el.mixes.take(TOP_MIXES).toArray()
    }))
    .toArray();

  return topTags;
};

export default function TopTagsChart({
  tagsids,
  top,
  tagsData
}: {
  tagsids?: string;
  top: number;
  tagsData: SteamTag[];
}) {
  const { setParam } = useURLSearchParams();
  const [tags, updateTags, isPending] = useAction(scrap, null);
  const tagsMapArray = new ObjectMapArray(tagsData, 'tagid');

  const choosenTags = useMemo(
    () => new Set(tagsids?.split(',') ?? []),
    [tagsids]
  );

  const onTopSizeSelect = (value: string) => {
    setParam('top', value);
  };

  useEffect(() => {
    updateTags({
      pagesCount: Math.ceil(top / GAMES_PER_PAGE),
      tagsids: choosenTags
    });
  }, [top, choosenTags, updateTags]);

  if (isPending || !tags) {
    return <Spinner />;
  }

  return (
    <section>
      <h2
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        Top
        <Select
          id='top-size'
          name='top-size'
          variant='text'
          options={TopOptions}
          defaultValue={top.toString()}
          onSelect={onTopSizeSelect}
        />
        tags:
      </h2>

      <div className='tags'>
        Choosen tags:{' '}
        {choosenTags
          .values()
          .map((tag) => {
            const foundTag = tagsMapArray.findByKey(tag);
            if (!foundTag) return undefined;
            return (
              <Tag
                key={`${tag}-tag`}
                tag={foundTag}
                choosenTags={choosenTags}
              />
            );
          })
          .toArray()}
      </div>

      <Bar
        options={{
          plugins: { legend: { display: false } },
          scales: {
            x: {
              grid: {
                display: false
              }
            }
          }
        }}
        data={{
          labels: tags.map(
            (tag) => tagsMapArray.findByKey(tag.id)?.name ?? 'Other'
          ),
          datasets: [
            { data: tags.map((tag) => tag.count), backgroundColor: Colors }
          ]
        }}
      />
    </section>
  );
}
