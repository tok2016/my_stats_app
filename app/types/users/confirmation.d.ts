import { Types } from 'mongoose';

import { ConfirmationActions } from '@lib/utils';

export type ConfirmationAction = (typeof ConfirmationActions)[number];

export interface NewConfirmation {
  credential: string;
  action: ConfirmationAction;
}

export interface ConfirmationId extends NewConfirmation {
  id: string;
}

export interface ConfirmationInfo extends ConfirmationId {
  isConfirmed: boolean;
}

export interface ConfirmationCode extends ConfirmationId {
  code: string;
}

export default interface Confirmation extends ConfirmationInfo {
  code: string;
}

export type ConfirmationInSchema = Omit<Confirmation, 'id'> & {
  _id: Types.ObjectId;
};
