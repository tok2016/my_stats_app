import { UserLogin } from './user';

export default interface PasswordUpdate {
  old: string;
  new: string;
}

export interface NewPassword extends UserLogin {
  operationId: string;
}
