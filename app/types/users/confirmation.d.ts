import { Types } from 'mongoose';
import { type ReactNode } from 'react';

import { ConfirmationActions } from '@lib/utils';

export type ConfirmationState = 'void' | 'pending' | 'confirmed';

export type ConfirmationActionType = (typeof ConfirmationActions)[number];

export interface NewConfirmation {
  credential: string;
  action: ConfirmationActionType;
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

export type ConfirmationBaseAction = (
  prev: ConfirmationInfo,
  formData: FormData
) => Promise<ConfirmationInfo>;

export type ConfirmationFormProps = {
  addendum?: ReactNode;
  path?: string;
};

export type ConfirmationRouteParams = { operationId: string };
