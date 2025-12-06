'use client';

import {
  type ChangeEvent,
  useEffect,
  useReducer,
  useRef,
  useState
} from 'react';
import { Refresh, Trash } from '@mynaui/icons-react';

import { AvatarState } from '@ts/users/avatar';

import Avatar from '@components/profile-layout/Avatar';
import AvatarEditor from './AvatarEditor';
import IconButton from '@components/IconButton';

type AvatarInputProps = {
  avatarId?: string | null;
  defaultFile?: Blob;
};

//Check rerender of this component before memoizing it
export default function AvatarInputRaw({
  avatarId = '',
  defaultFile
}: AvatarInputProps) {
  const [avatar, setAvatar] = useState<string>(avatarId ?? '');
  const [newAvatar, setNewAvatar] = useReducer((prev, next) => {
    URL.revokeObjectURL(prev);
    return next;
  }, '');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatarState: AvatarState = !avatar
    ? 'delete'
    : avatar !== avatarId
      ? 'update'
      : 'same';

  const onFileUpload = (evt: ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];

    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setNewAvatar(fileUrl);
    }
  };

  const saveFile = (file: File) => {
    if (fileInputRef.current) {
      const transfer = new DataTransfer();
      transfer.items.add(file);
      fileInputRef.current.files = transfer.files;

      const newAvatarUrl = URL.createObjectURL(file);
      setAvatar(newAvatarUrl);
      setNewAvatar('');
    }
  };

  const onCancel = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    setNewAvatar('');
  };

  const onDelete = () => {
    onCancel();
    setAvatar('');
  };

  useEffect(() => {
    setAvatar(avatarId ?? '');
  }, [avatarId]);

  useEffect(() => {
    if (fileInputRef.current && defaultFile) {
      const file = new File([defaultFile], Date.now().toString(), {
        type: 'image/png'
      });

      saveFile(file);
    }
  }, [defaultFile]);

  return (
    <div className='avatar-field'>
      <Avatar avatarId={avatar} />

      <label htmlFor='avatar' className='avatar-label'>
        <Refresh />
        <span>Change avatar</span>
      </label>

      {!avatar || (
        <IconButton
          className='avatar-delete'
          variant='secondary'
          status='error'
          icon={<Trash />}
          onClick={onDelete}
        />
      )}

      <input
        type='hidden'
        id='avatarState'
        name='avatarState'
        value={avatarState}
      />

      <input
        ref={fileInputRef}
        id='avatar'
        type='file'
        name='avatar'
        accept='image/*'
        hidden
        onChange={onFileUpload}
      />

      {!newAvatar || (
        <AvatarEditor
          avatarUrl={newAvatar}
          onCancel={onCancel}
          saveFile={saveFile}
        />
      )}
    </div>
  );
}
