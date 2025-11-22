'use client';

import { ChevronDown } from '@mynaui/icons-react';
import { useEffect, useReducer, useRef } from 'react';

type DrawerProps = {
  label: React.ReactNode;
  children: React.ReactNode;
  expandable?: boolean;
  className?: string;
  submenuClassName?: string;
  onExpand?: () => void;
};

const EXPAND_TIME = 100;

export default function Drawer({
  label,
  children,
  expandable,
  className,
  submenuClassName,
  onExpand
}: DrawerProps) {
  const [isExpanded, toggleExpand] = useReducer((value) => !value, false);

  const isExpandable = typeof expandable === 'undefined';
  const isMenuExpanded = isExpandable ? isExpanded : expandable;

  const submenuRef = useRef<HTMLDivElement>(null);

  const onExpandClick = () => {
    toggleExpand();
    onExpand?.();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isMenuExpanded && submenuRef.current) {
        submenuRef.current.style.display = 'none';
      }
    }, EXPAND_TIME);

    if (submenuRef.current) {
      submenuRef.current.style.setProperty('--expand-time', `${EXPAND_TIME}ms`);
      submenuRef.current.style.display = 'flex';
      submenuRef.current.style.maxHeight = `${isMenuExpanded ? submenuRef.current.scrollHeight : 0}px`;
    }

    return () => clearTimeout(timer);
  }, [isMenuExpanded]);

  return (
    <>
      <div
        className={`drawer ${isMenuExpanded ? 'expanded' : ''} ${className}`}
        onClick={onExpandClick}
      >
        {label}
        <ChevronDown className='drawer-expand' />
      </div>

      <div className={`drawer-submenu ${submenuClassName}`} ref={submenuRef}>
        {children}
      </div>
    </>
  );
}
