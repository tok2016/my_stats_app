export interface NewCredentials {
  email: string;
  username: string;
  password: string;
}

export default interface Credentials extends NewCredentials {
  id: string;
  userId: string;
  createdAt: Date;
}
