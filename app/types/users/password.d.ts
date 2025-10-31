export default interface Password {
  password: string;
  repeatPassword: string;
}

export interface PasswordUpdate extends Password {
  oldPassword: string;
}

export interface NewPassword extends Password {
  credential: string;
  operationId: string;
}
