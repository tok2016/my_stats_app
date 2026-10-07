'use client';

import { X } from '@mynaui/icons-react';
import { useEffect } from 'react';

import { usePathname } from 'next/navigation';

import { InputTheme } from '@ts/ui/components-variants';

import { usePopupState } from '@store/popup-store';

import IconButton from './IconButton';

type PopupProps = {
  children: React.ReactNode;
  name: string;
  variant?: InputTheme;
  closeOnBackground?: boolean;
  onClose?: () => void;
};

export default function Popup({
  children,
  name,
  variant = 'light',
  closeOnBackground,
  onClose
}: PopupProps) {
  const pathname = usePathname();
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

  useEffect(() => {
    togglePopup('');
  }, [pathname, togglePopup]);

  if (popupName !== name) {
    return;
  }

  return (
    <div
      className='popup'
      id={name}
      onClick={closeOnBackground ? onBackgroundClick : undefined}
    >
      <div className={`card ${variant}`}>
        {children}
        <IconButton
          className='card__close-button'
          icon={<X />}
          variant='text'
          onClick={onPopupClose}
        />
      </div>
    </div>
  );
}
