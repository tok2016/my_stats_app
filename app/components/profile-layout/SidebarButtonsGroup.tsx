import { useEffect } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SidebarOptionProps } from '@ts/ui/components-props';

import { useSidebarState } from '@store/sidebar-store';

import Drawer from '@components/Drawer';

import SidebarButton from './SidebarButton';

/**
 * @param sidebarOption - Sidebar option props.
 * @param sidebarOption.icon - Icon for sidebar option.
 * @param sidebarOption.subButtons - Buttons of sidebar option.
 * @param sidebarOption.onClick - On sidebar option click.
 * @param sidebarOption.href - Path to page where this option redirects to.
 * @param sidebarOption.loading - Is sidebar loading.
 * @param sidebarOption.name - Name of sidebar option to identify it.
 * @param sidebarOption.label - Sidebar option label.
 * @param sidebarOption.disabled - Is sidebar option disabled.
 * @returns Group of sidebar navigation buttons. Returns single sidebar button if subButtons are not given.
 */
export default function SidebarButtonsGroup(sidebarOption: SidebarOptionProps) {
  const { expanded, expand } = useSidebarState();
  const endpoints = usePathname().split('/');

  //Checks if current group is stored as expanded.
  const isExpanded = expanded === sidebarOption.name;

  //Checks if one of current group's button is choosen.
  const isChoosen = endpoints[1] === sidebarOption.name;

  const button = <SidebarButton {...sidebarOption} isChoosen={isChoosen} />;

  const onExpand = () => {
    expand(isExpanded ? '' : sidebarOption.name);
  };

  //Expands group if it's choosen.
  useEffect(() => {
    expand(isChoosen ? sidebarOption.name : '');
  }, [expand, isChoosen, sidebarOption.name]);

  return (
    <Drawer
      expandable={isExpanded && !sidebarOption.disabled}
      label={button}
      loading={sidebarOption.loading}
      submenuClassName='sidebar-submenu'
      onExpand={onExpand}
    >
      {sidebarOption.subButtons.map((subButton) => (
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
    </Drawer>
  );
}
