'use client';

import { X } from '@mynaui/icons-react';

import { InputTheme } from '@ts/ui/components-variants';

import IconButton from './IconButton';
import { usePopupState } from '@store/popup-store';

type PopupProps = {
  children: React.ReactNode;
  name: string;
  variant?: InputTheme;
  onClose?: () => void;
};

export default function Popup({
  children,
  name,
  variant = 'light',
  onClose
}: PopupProps) {
  const { popupName, togglePopup } = usePopupState();

  const onPopupClose = () => {
    togglePopup(name);
    onClose?.();
  };

  const onBackgroundClick = (evt: React.MouseEvent) => {
    if ((evt.target as Element)?.id === name) {
      onPopupClose();
    }
  };

  if (popupName !== name) {
    return;
  }

  return (
    <div className='popup' id={name} onClick={onBackgroundClick}>
      <div className={`card ${variant}`}>
        {children}
        <IconButton
          className='close'
          icon={<X />}
          variant='text'
          onClick={onPopupClose}
        />
      </div>
    </div>
  );
}
