'use client';

import Popup from '@components/Popup';
import Button from '@components/Button';
import Hint from '@components/Hint';

type PublishPopupProps = {
  name: string;
  isPublic?: boolean;
  loading?: boolean;
  errorMessage?: string;
  onClose?: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
};

export default function PublishPopup({
  name,
  isPublic,
  loading,
  errorMessage,
  onClose,
  onCancel,
  onConfirm
}: PublishPopupProps) {
  return (
    <Popup name={name} onClose={onClose}>
      <p>
        {isPublic
          ? `Do you really want to close your profile? Other user won't be able to see it anymore`
          : 'Do you really want to publish your profile and make it available for everyone?'}
      </p>

      <div className='buttons-flex-box'>
        <Button loading={loading} onClick={onConfirm}>
          {isPublic ? 'Close' : 'Publish'}
        </Button>

        <Button variant='outlined' onClick={onCancel}>
          Cancel
        </Button>
      </div>

      {!errorMessage || <Hint variant='error'>{errorMessage}</Hint>}
    </Popup>
  );
}
