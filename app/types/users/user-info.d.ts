import Dashboard from './dashboard';

export default interface UserInfo {
  id: string;
  avatarUrl?: string;
  birthdate?: Date;
  country?: string;
  isPublic: boolean;
  unblockDate?: Date;
  dashboards: Dashboard[];
}
