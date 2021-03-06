import { Response } from 'express-serve-static-core';
import { ErrorCode, IError, IErrorResponse } from '../../public/src/api-contracts/common';

export const ErrorCodes: { [key: string]: ErrorCode } = {
  ERROR_AUTHENTICATION: 'authentication-error',
  ERROR_AUTHORIZATION: 'authorization-error',
  ERROR_ENTITY_NOT_FOUND: 'not-found',
  ERROR_SERVICE_FAILURE: 'service-failure',
  REDIRECT_ADMIN: 'redirect-admin',
};

export class ServerError implements IError {
  constructor(
      public key?: ErrorCode,
      public message?: string,
  ) {
  }
}

export function isErrorOfType(error: IErrorResponse, key: ErrorCode): boolean {
  return !!(error && error.error && error.error.key === key);
}

export function getErrorString(error: IError): string {
  return error.message ? error.message : JSON.stringify(error);
}

export function isAuthenticationError(error: IErrorResponse) {
  const key = error.error.key;
  return key === ErrorCodes.ERROR_AUTHENTICATION;
}

export function isAuthorizationError(error: IErrorResponse) {
  return error.error.key === ErrorCodes.ERROR_AUTHORIZATION;
}

export function getErrorMessageForClient(error: IErrorResponse | ErrorCode): IErrorResponse {
  if (typeof(error) === "string") {
    return  { error: { key: error} };
  }
  if (error && error.error && error.error.key) {
    return { error: error.error };
  } else {
    return { error: { key: ErrorCodes.ERROR_SERVICE_FAILURE } };
  }
}

export function isCustomError(err: IErrorResponse) {
  return err && err.error && err.error.key;
}

export function handleError(res: Response, logger: any) {
  return function (err) {
    const errorString = (err && err.message) ? err.message : JSON.stringify(err);
    logger.error(errorString);

    if (!res.headersSent) {
      const errorMessage = getErrorMessageForClient(err);
      if (errorMessage.error.key === ErrorCodes.ERROR_SERVICE_FAILURE) {
        res.status(500).send(errorMessage);
      } else if (errorMessage.error.key === ErrorCodes.ERROR_ENTITY_NOT_FOUND) {
        res.status(404).send(errorMessage);
      } else {
        res.status(400).send(errorMessage);
      }
    }
  };
}
