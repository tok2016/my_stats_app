'use client';

import { Refresh, Trash } from '@mynaui/icons-react';
import {
  type ChangeEvent,
  useEffect,
  useReducer,
  useRef,
  useState
} from 'react';

import { AvatarState } from '@ts/users/avatar';

import IconButton from '@components/IconButton';
import Avatar from '@components/profile-layout/Avatar';

import AvatarEditor from './AvatarEditor';

type AvatarInputProps = {
  username: string;
  avatarId?: string | null;
  defaultFile?: Blob;
};

/**
 * @param props
 * @param props.username
 * @param props.avatarId - Default user's avatart.
 * @param props.defaultFile - Default file from form data.
 * @returns File input with avatar preview and editor.
 */
export default function AvatarInput({
  username,
  avatarId = '',
  defaultFile
}: AvatarInputProps) {
  const [previewAvatar, setPreviewAvatar] = useState<string>(avatarId ?? '');
  const [uploadedAvatar, setUploadedAvatar] = useReducer((prev, next) => {
    URL.revokeObjectURL(prev);
    return next;
  }, '');

  const fileInputRef = useRef<HTMLInputElement>(null);

  //Defines what to do with user's avatar.
  const avatarState: AvatarState =
    !previewAvatar && !!defaultFile
      ? 'delete'
      : previewAvatar !== avatarId
        ? 'update'
        : 'same';

  /**
   * Generates url of original file that was uploaded.
   * @param evt
   */
  const onFileUpload = (evt: ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];

    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setUploadedAvatar(fileUrl);
    }
  };

  /**
   * Saves cropped image file to input and previews it.
   * @param file - File of cropped image.
   */
  const saveFile = (file: File) => {
    if (fileInputRef.current) {
      const transfer = new DataTransfer();
      transfer.items.add(file);
      fileInputRef.current.files = transfer.files;

      const newAvatarUrl = URL.createObjectURL(file);
      setPreviewAvatar(newAvatarUrl);
      setUploadedAvatar('');
    }
  };

  /**
   * Cancel avatar upload.
   */
  const onCancel = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    setUploadedAvatar('');
  };

  /**
   * Deletes user's avatar.
   */
  const onDelete = () => {
    onCancel();
    setPreviewAvatar('');
  };

  useEffect(() => {
    setPreviewAvatar(avatarId ?? '');
  }, [avatarId]);

  useEffect(() => {
    if (fileInputRef.current && !!defaultFile && defaultFile.size) {
      const file = new File([defaultFile], Date.now().toString(), {
        type: 'image/png'
      });

      saveFile(file);
    }
  }, [defaultFile]);

  return (
    <div className='avatar-input'>
      <Avatar username={username} avatarId={previewAvatar} />

      <label htmlFor='avatar' className='avatar-input__label'>
        <Refresh />
        <span>Change avatar</span>
      </label>

      {!previewAvatar || (
        <IconButton
          className='avatar-input__delete-button'
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

      {!uploadedAvatar || (
        <AvatarEditor
          avatarUrl={uploadedAvatar}
          onCancel={onCancel}
          onEditSave={saveFile}
        />
      )}
    </div>
  );
}
