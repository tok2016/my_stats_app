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
  400: <FileXSolid className='error-message-icon' />,
  401: <AnnoyedGhostSolid className='error-message-icon' />,
  403: <AngryGhostSolid className='error-message-icon' />,
  404: <SadGhostSolid className='error-message-icon' />,
  405: <IndifferentGhostSolid className='error-message-icon' />,
  408: <AlarmXSolid className='error-message-icon' />,
  413: <BaggageClaimSolid className='error-message-icon' />,
  419: <AlarmXSolid className='error-message-icon' />,
  429: <DazeGhostSolid className='error-message-icon' />
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
        <DangerOctagonSolid className='error-message-icon' />
      )}
      <p>{message}</p>
      {children}
    </div>
  );
}
