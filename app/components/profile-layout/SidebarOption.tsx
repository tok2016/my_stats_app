import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SidebarOptionProps } from '@ts/ui/components-props';

import Drawer from '@components/Drawer';
import SidebarButton from './SidebarButton';
import { useSidebarState } from '@store/sidebar-store';

export default function SidebarOption(sidebarOption: SidebarOptionProps) {
  const { expanded, expand } = useSidebarState();
  const endpoints = usePathname().split('/');

  const isExpanded = expanded === sidebarOption.name;
  const isChoosen = endpoints[1] === sidebarOption.name;

  const button = <SidebarButton {...sidebarOption} isChoosen={isChoosen} />;

  const onExpand = () => {
    expand(isExpanded ? '' : sidebarOption.name);
  };

  if (!sidebarOption.subButtons) {
    return button;
  }

  return (
    <Drawer
      expandable={isExpanded}
      label={button}
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
