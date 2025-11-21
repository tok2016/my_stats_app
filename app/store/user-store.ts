import { create } from 'zustand';

import { User } from '@ts/users/user';
import { FetchStatus } from '@ts/ui/fetch-status';

import { defaultUser } from '@lib/utils';

type UserState = {
  user: User;
  status: FetchStatus;
};

type UserActions = {
  setUserState: (userState: Partial<UserState>) => void;
};

const userState = create<UserState & UserActions>((set) => ({
  user: defaultUser,
  status: 'pending',
  setUserState: (userState) => set(userState)
}));

export const useUserState = () => userState((state) => state);
