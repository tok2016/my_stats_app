'use client';

import Link from 'next/link';

import { SidebarOptionProps } from '@ts/ui/components-props';

import Skeleton from '@components/Skeleton';

const SIDEBAR_ICON_CLASS = 'sidebar-icon';
const SIDEBAR_LABEL_CLASS = 'sidebar-label';

type SidebarButtonProps = Omit<SidebarOptionProps, 'subButtons'> & {
  isChoosen?: boolean;
};

export default function SidebarButton({
  icon,
  label,
  href,
  isChoosen = false,
  loading = false,
  disabled,
  onClick
}: SidebarButtonProps) {
  return (
    <div
      className={`sidebar-button ${isChoosen ? 'choosen' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
    >
      {loading ? (
        <Skeleton type='image' className={SIDEBAR_ICON_CLASS} />
      ) : (
        <div className={`${SIDEBAR_ICON_CLASS} loaded`}>{icon}</div>
      )}

      {loading ? (
        <Skeleton
          type='text'
          fontSize='large'
          lineHeight='fit'
          className={SIDEBAR_LABEL_CLASS}
        />
      ) : (
        <span className={SIDEBAR_LABEL_CLASS}>{label}</span>
      )}

      {href && <Link href={href} className='sidebar-link' scroll={false} />}
    </div>
  );
}
