'use client';

import Link from 'next/link';

import { SidebarOptionProps } from '@ts/ui/components-props';

import Skeleton from '@components/Skeleton';

const SIDEBAR_ICON_CLASS = 'sidebar-button__icon';
const SIDEBAR_LABEL_CLASS = 'sidebar-button__label';

type SidebarButtonProps = Omit<SidebarOptionProps, 'subButtons'> & {
  isChoosen?: boolean;
};

/**
 * @param props
 * @param props.icon - Icon in sidebar button.
 * @param props.label - Sidebar button label.
 * @param props.href - Path to page where the button redirects to.
 * @param props.isChoosen - Is sidebar button choosen.
 * @param props.loading - Is sidebar loading.
 * @param props.disable - Is sidebar button disabled.
 * @param props.onClick - On sidebar button click.
 * @returns Sidebar navigation button.
 */
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
      className={`sidebar-button ${isChoosen ? 'sidebar-button--choosen' : ''} ${disabled ? 'sidebar-button--disabled' : ''}`}
      onClick={onClick}
    >
      {loading ? (
        <Skeleton type='image' className={SIDEBAR_ICON_CLASS} />
      ) : (
        <div className={`${SIDEBAR_ICON_CLASS} ${SIDEBAR_ICON_CLASS}--loaded`}>
          {icon}
        </div>
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

      {href && (
        <Link href={href} className='sidebar-button__link' scroll={false} />
      )}
    </div>
  );
}
