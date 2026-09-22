'use client';

import { X } from '@mynaui/icons-react';

import { useURLSearchParams } from '@lib/hooks';

import { SteamTag } from './server-actions';

export default function Tag({
  tag,
  choosenTags
}: {
  tag: SteamTag;
  choosenTags: Set<string>;
}) {
  const { setParam, deleteParam } = useURLSearchParams();

  const onTagRemove = () => {
    if (choosenTags.size < 2) deleteParam('tagid');
    else {
      const updatedSet = new Set(choosenTags);
      updatedSet.delete(tag.tagid);
      setParam('tagid', updatedSet.values().toArray().join(','));
    }
  };

  return (
    <div className='tag'>
      {tag.name} <X role='button' onClick={onTagRemove} />
    </div>
  );
}
