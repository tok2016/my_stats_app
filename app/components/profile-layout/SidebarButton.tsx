'use client';

import { Icon } from '@iconify/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SidebarButtonProps } from '@ts/ui/components-props';

import { getIconCode } from '@lib/utils';
import { useSidebarState } from '@store/sidebar-store';
import { useEffect, useState } from 'react';

type SubmenuState = 'closed' | 'expanded' | '';

const EXPAND_TIME = 100;

export default function SidebarButton({
  name,
  icon,
  label,
  subButtons,
  href,
  onClick
}: SidebarButtonProps) {
  const [submenuState, setSubmenuState] = useState<SubmenuState>('');

  const { expanded, expand } = useSidebarState();
  const isExpandable = !!subButtons;
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
        {icon}
        <span className='sidebar-label'>{label}</span>
        <Icon
          icon={getIconCode('chevron-down')}
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
