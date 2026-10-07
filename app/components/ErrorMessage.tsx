import {
  AlarmXSolid,
  AngryGhostSolid,
  AnnoyedGhostSolid,
  BaggageClaimSolid,
  DangerOctagonSolid,
  DazeGhostSolid,
  FileXSolid,
  IndifferentGhostSolid,
  SadGhostSolid
} from '@mynaui/icons-react';

import { isAxiosError, isErrorResponse } from '@lib/type-guards';

type ErrorMessageProps = {
  error: unknown;
  className?: string;
  children?: React.ReactNode;
};

const ErrorIconByCode: Record<number, React.ReactNode> = {
  400: <FileXSolid className='error-message__icon' />,
  401: <AnnoyedGhostSolid className='error-message__icon' />,
  403: <AngryGhostSolid className='error-message__icon' />,
  404: <SadGhostSolid className='error-message__icon' />,
  405: <IndifferentGhostSolid className='error-message__icon' />,
  408: <AlarmXSolid className='error-message__icon' />,
  413: <BaggageClaimSolid className='error-message__icon' />,
  419: <AlarmXSolid className='error-message__icon' />,
  429: <DazeGhostSolid className='error-message__icon' />
};

export default function ErrorMessage({
  error,
  className = '',
  children
}: ErrorMessageProps) {
  let code = 500;
  let message = 'Something went wrong';

  if (isErrorResponse(error)) {
    message = error.message;
    code = error.status;
  } else if (isAxiosError(error)) {
    if (isErrorResponse(error.response)) {
      message = error.response.message;
      code = error.response.status;
    } else {
      message = error.response ? error.response.statusText : error.message;
      code = (error.response ? error.response.status : error.status) ?? 500;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className={`error-message ${className}`}>
      {ErrorIconByCode[code] ?? (
        <DangerOctagonSolid className='error-message__icon' />
      )}
      <p className='error-message__text'>{message}</p>
      {children}
    </div>
  );
}
