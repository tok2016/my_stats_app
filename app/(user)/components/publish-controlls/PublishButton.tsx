'use client';

import { Lock, LockOpen } from '@mynaui/icons-react';

import IconButton from '@components/IconButton';
import { usePopupState } from '@store/popup-store';
import { useAction } from '@lib/hooks';
import { changeProfilePrivacy } from '../../actions';
import { defaultFormState } from '@lib/utils';
import PublishPopup from './PublishPopup';

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

  const onConfirm = async () => {
    changePrivacy(isPublic);
  };

  return (
    <>
      <IconButton
        icon={isPublic && !loading ? <LockOpen /> : <Lock />}
        loading={loading}
        onClick={onPopupToggle}
      />

      <PublishPopup
        name={PUBLISH_POPUP_NAME}
        isPublic={isPublic}
        loading={isPending}
        errorMessage={state.error ? state.message : ''}
        onClose={clearData}
        onCancel={onPopupToggle}
        onConfirm={onConfirm}
      />
    </>
  );
}
