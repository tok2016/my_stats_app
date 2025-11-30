'use client';

import { type ChangeEvent, useRef, useState } from 'react';

import Avatar from '@components/profile-layout/Avatar';
import AvatarEditor from './AvatarEditor';

type AvatarInputProps = {
  avatarId?: string | null;
};

export default function AvatarInput({ avatarId = '' }: AvatarInputProps) {
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isOpened, setOpened] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileUpload = (evt: ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];

    if (file) {
      const fileUrl = URL.createObjectURL(file);
      console.log(fileUrl);
      setAvatarUrl(fileUrl);
      setOpened(true);
    }
  };

  const saveFile = (file: File) => {
    if (fileInputRef.current) {
      const transfer = new DataTransfer();
      transfer.items.add(file);
      fileInputRef.current.files = transfer.files;

      const newAvatarUrl = URL.createObjectURL(file);
      setAvatarUrl(newAvatarUrl);
      setOpened(false);
    }
  };

  const onCancel = () => {
    URL.revokeObjectURL(avatarUrl);
    setAvatarUrl('');
    setOpened(false);
  };

  return (
    <div className='avatar-field'>
      <label htmlFor='avatar'>
        <Avatar avatarId={avatarUrl ? avatarUrl : avatarId} />
      </label>

      <input
        ref={fileInputRef}
        id='avatar'
        type='file'
        name='avatar'
        accept='image/*'
        hidden
        onChange={onFileUpload}
      />

      {!isOpened || (
        <AvatarEditor
          avatarUrl={avatarUrl}
          onCancel={onCancel}
          saveFile={saveFile}
        />
      )}
    </div>
  );
}
