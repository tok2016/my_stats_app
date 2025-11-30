import { useState } from 'react';

import BinaryInput from '@components/BinaryInput';
import { usePopupState } from '@store/popup-store';
import PublishPopup from './PublishPopup';

const PUBLISH_FORM_POPUP_NAME = 'publish-form';

type PublishInputProps = {
  isPublicDefault?: boolean;
};

export default function PublishInput({
  isPublicDefault = false
}: PublishInputProps) {
  const [isPublic, setPublic] = useState<boolean>(isPublicDefault);
  const { togglePopup } = usePopupState();

  const onPopupToggle = () => {
    togglePopup(PUBLISH_FORM_POPUP_NAME);
  };

  const onPrivacyChange = (isProfilePublic: boolean) => {
    if (isProfilePublic === isPublicDefault) {
      setPublic(isProfilePublic);
    } else {
      onPopupToggle();
    }
  };

  const onConfirm = () => {
    setPublic((value) => !value);
    onPopupToggle();
  };

  return (
    <>
      <BinaryInput
        type='checkbox'
        id='isPublic'
        name='isPublic'
        label='Public'
        isSwitch
        value={isPublic}
        onChange={onPrivacyChange}
      />

      <PublishPopup
        name={PUBLISH_FORM_POPUP_NAME}
        isPublic={isPublicDefault}
        onConfirm={onConfirm}
        onCancel={onPopupToggle}
      />
    </>
  );
}
