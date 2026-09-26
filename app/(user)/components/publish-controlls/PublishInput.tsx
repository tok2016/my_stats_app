import { useState } from 'react';

import { usePopupState } from '@store/popup-store';

import BinaryInput from '@components/BinaryInput';

import PublishPopup from './PublishPopup';

const PUBLISH_FORM_POPUP_NAME = 'publish-form';

type PublishInputProps = {
  wasPublic?: boolean;
  defaultValue?: boolean;
};

/**
 * @param props
 * @param props.wasPublic - Was user profile public before setting.
 * @param props.defaultValue - Default isPublic value from form.
 * @returns Switch privacy input with warning publish popup.
 */
export default function PublishInput({
  wasPublic = false,
  defaultValue = false
}: PublishInputProps) {
  const [isPublic, setPublic] = useState<boolean>(defaultValue);
  const { togglePopup } = usePopupState();

  const onPopupToggle = () => {
    togglePopup(PUBLISH_FORM_POPUP_NAME);
  };

  const onPrivacyChange = (isProfilePublic: boolean) => {
    if (isProfilePublic === wasPublic) {
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
        isPublic={wasPublic}
        onConfirm={onConfirm}
        onCancel={onPopupToggle}
      />
    </>
  );
}
