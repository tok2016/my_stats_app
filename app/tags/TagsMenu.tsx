'use client';

import { FormEvent, useRef } from 'react';

import { Option } from '@ts/ui/components-props';

import { useURLSearchParams } from '@lib/hooks';

import Button from '@components/Button';
import RadioCheckboxGroup from '@components/RadioCheckboxGroup';
import Search from '@components/Search';

import { SteamTag } from './server-actions';

export default function TagsMenu({
  filteredTags,
  tagsIds
}: {
  filteredTags: SteamTag[];
  tagsIds: string[];
}) {
  const { setParam, deleteParam } = useURLSearchParams();

  //Places initially choosen tags options to front.
  const choosenTags = useRef(new Set(tagsIds));
  const tagsOptions: Option[] = filteredTags
    .map((tag) => ({
      key: `${tag.tagid}-option`,
      label: tag.name,
      value: tag.tagid
    }))
    .sort((a) => (choosenTags.current.has(a.value) ? -1 : 1));

  const onTagInput = (evt: FormEvent<HTMLInputElement>) => {
    if (evt.currentTarget.checked) {
      choosenTags.current.add(evt.currentTarget.id);
    } else {
      choosenTags.current.delete(evt.currentTarget.id);
    }

    //Places choosen option to front.
    if (evt.currentTarget.parentElement?.parentElement)
      evt.currentTarget.parentElement.parentElement.style.order = evt
        .currentTarget.checked
        ? '1'
        : '100';
  };

  const onSearchSubmit = (query: string) => {
    setParam('query', query);
  };

  const onSearch = async (query?: string) => {
    if (query) setParam('query', query);
    else deleteParam('query');

    return Promise.resolve([]);
  };

  const onFilrerApply = () => {
    if (choosenTags.current.size)
      setParam('tagid', choosenTags.current.values().toArray().join(','));
    else deleteParam('tagid');
  };

  return (
    <section className='tags-menu'>
      <Search
        id='tag-query'
        name='tag-query'
        placeholder='Find tag'
        onSearchSubmit={onSearchSubmit}
        action={onSearch}
      />

      <RadioCheckboxGroup
        type='checkbox'
        name='tag'
        className='horizontal'
        options={tagsOptions}
        defaultValue={tagsIds}
        onInput={onTagInput}
      />

      <Button variant='primary' onClick={onFilrerApply}>
        Filter
      </Button>
    </section>
  );
}
