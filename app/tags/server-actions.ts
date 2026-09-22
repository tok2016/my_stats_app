'use server';

import axios from 'axios';

import { SteamApiResponse } from '@ts/games/api-response';

type OriginalSteamTag = { tagid: number; name: string };
export type SteamTag = { tagid: string; name: string };

/**
 * @param page - Page number.
 * @returns HTML page with 25 games.
 */
export const getSteamTopSellersPage = async (
  page: number,
  filterTags: string[]
) => {
  const searchParams = new URLSearchParams({
    hwtype: '0',
    category1: '998',
    os: 'win',
    filter: 'topsellers',
    ndl: '1',
    page: page.toString()
  });

  if (filterTags.length) searchParams.set('tags', filterTags.join(','));

  const doc = await axios.get(
    `https://store.steampowered.com/search/?${searchParams.toString()}`,
    { responseType: 'document' }
  );

  return doc.data;
};

/**
 * @returns Tags names.
 */
export const getTagsData = async () => {
  const tags = await axios.get<SteamApiResponse<{ tags: OriginalSteamTag[] }>>(
    'https://api.steampowered.com/IStoreService/GetMostPopularTags/v1/'
  );

  return tags.data.response.tags.map((tag) => ({
    ...tag,
    tagid: tag.tagid.toString()
  }));
};
