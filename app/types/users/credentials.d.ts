import NewCredentials from './new-credentials';

export default interface Credentials extends NewCredentials {
  id: string;
  userId: string;
  createdAt: Date;
}
