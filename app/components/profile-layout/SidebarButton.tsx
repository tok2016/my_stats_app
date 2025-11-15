'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from '@mynaui/icons-react';

import { SidebarButtonProps } from '@ts/ui/components-props';

import { useSidebarState } from '@store/sidebar-store';
import { useEffect, useState } from 'react';
import Skeleton from '@components/Skeleton';

type SubmenuState = 'closed' | 'expanded' | '';

const SIDEBAR_ICON_CLASS = 'sidebar-icon';
const SIDEBAR_LABEL_CLASS = 'sidebar-label';
const EXPAND_TIME = 100;

export default function SidebarButton({
  name,
  icon,
  label,
  subButtons,
  href,
  loading = false,
  onClick
}: SidebarButtonProps) {
  const [submenuState, setSubmenuState] = useState<SubmenuState>('');

  const { expanded, expand } = useSidebarState();
  const isExpandable = !!subButtons && !loading;
  const isExpanded = expanded === name;

  const endpoints = usePathname().split('/');
  const isChoosen = endpoints[1] === name;

  const onButtonClick = () => {
    onClick?.();
    expand(expanded === name ? '' : name);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isExpandable) {
      setSubmenuState(isExpanded ? 'expanded' : 'closed');

      timer = setTimeout(() => {
        if (!isExpanded) {
          setSubmenuState('');
        }
      }, EXPAND_TIME);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isExpandable, isExpanded]);

  return (
    <>
      <div
        className={`sidebar-button 
          ${isExpanded ? 'expanded' : ''} 
          ${isChoosen ? 'choosen' : ''}
        `}
        onClick={onButtonClick}
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

        <ChevronDown
          className={`sidebar-expand ${isExpandable ? '' : 'hidden'}`}
        />

        {!href || <Link href={href} className='sidebar-link' scroll={false} />}
      </div>

      <div className={`sidebar-submenu ${submenuState}`}>
        {subButtons?.map((subButton) => (
          <Link
            key={subButton.href}
            href={subButton.href}
            className={`sidebar-subbutton
              ${isChoosen && endpoints[2] === subButton.name ? 'choosen' : ''}
            `}
          >
            {subButton.label}
          </Link>
        ))}
      </div>
    </>
  );
}
