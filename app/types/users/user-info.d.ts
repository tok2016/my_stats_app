import Dashboard from './dashboard';

export default interface UserInfo {
  id: string;
  avatarUrl?: string | null;
  birthdate?: Date | null;
  country?: string | null;
  isPublic: boolean;
  unblockDate?: Date | null;
  dashboards: Dashboard[];
}
