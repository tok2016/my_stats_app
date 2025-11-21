'use client';

import { Lock, LockOpen } from '@mynaui/icons-react';

import IconButton from '@components/IconButton';
import Popup from '@components/Popup';
import { usePopupState } from '@store/popup-store';
import Button from '@components/Button';
import { useAction } from '@lib/hooks';
import { changeProfilePrivacy } from '../actions';
import { defaultFormState } from '@lib/utils';
import Hint from '@components/Hint';

type PublishButtonProps = {
  isPublic?: boolean;
  loading?: boolean;
};

const PUBLISH_POPUP_NAME = 'publish';

export default function PublishButton({
  isPublic = false,
  loading = false
}: PublishButtonProps) {
  const { togglePopup } = usePopupState();

  const clearData = () => {
    setState({ error: false, message: '' });
  };

  const onPopupToggle = () => {
    togglePopup(PUBLISH_POPUP_NAME);
    clearData();
  };

  const [state, changePrivacy, isPending, setState] = useAction(
    changeProfilePrivacy(onPopupToggle),
    defaultFormState(),
    true
  );

  const onConfim = async () => {
    changePrivacy(isPublic);
  };

  return (
    <>
      <IconButton
        icon={isPublic && !loading ? <LockOpen /> : <Lock />}
        loading={loading}
        onClick={onPopupToggle}
      />

      <Popup name={PUBLISH_POPUP_NAME} onClose={clearData}>
        <p>
          {isPublic
            ? `Do you really want to close your profile? Other user won't be able to see it anymore`
            : 'Do you really want to publish your profile and make it available for everyone?'}
        </p>

        <div className='buttons-flex-box'>
          <Button loading={isPending} onClick={onConfim}>
            {isPublic ? 'Close' : 'Publish'}
          </Button>

          <Button variant='outlined' onClick={onPopupToggle}>
            Cancel
          </Button>
        </div>

        {!state.error || <Hint variant='error'>{state.message}</Hint>}
      </Popup>
    </>
  );
}
