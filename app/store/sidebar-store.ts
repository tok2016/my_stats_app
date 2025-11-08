import { create } from 'zustand';

type SidebarState = {
  expanded: string;
};

type SidebarActions = {
  expand: (menuName: string) => void;
};

const sidebarState = create<SidebarState & SidebarActions>((set) => ({
  expanded: '',
  expand: (menuName: string) => set({ expanded: menuName })
}));

export const useSidebarState = () => sidebarState((state) => state);
