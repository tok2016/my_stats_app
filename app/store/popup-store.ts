import { create } from 'zustand';

type PopupStore = {
  popupName: string;
};

type PopupActions = {
  togglePopup: (popupName: string) => void;
};

const popupState = create<PopupStore & PopupActions>((set) => ({
  popupName: '',
  togglePopup: (popupName: string) =>
    set((state) => ({
      popupName: popupName === state.popupName ? '' : popupName
    }))
}));

export const usePopupState = () => popupState((state) => state);
