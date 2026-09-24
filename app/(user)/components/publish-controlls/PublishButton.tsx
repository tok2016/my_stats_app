'use client';

import { Lock, LockOpen } from '@mynaui/icons-react';

import { useAction } from '@lib/hooks';
import { defaultFormState } from '@lib/utils';

import { usePopupState } from '@store/popup-store';

import IconButton from '@components/IconButton';

import { changeProfilePrivacy } from '../../actions';
import PublishPopup from './PublishPopup';

type PublishButtonProps = {
  isPublic?: boolean;
  loading?: boolean;
};

const PUBLISH_POPUP_NAME = 'publish';

/**
 * @param props
 * @param props.isPublic - Is user profile public.
 * @param props.loading - Is parent component loading.
 * @returns Button to switch privacy with warning publish popup.
 */
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
