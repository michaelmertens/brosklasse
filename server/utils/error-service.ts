import { Response } from 'express-serve-static-core';
import { IError, IErrorResponse } from '../../public/src/api-contracts/common';

export const ErrorTypes = {
  ERROR_AUTHENTICATION: 'authentication-error',
  ERROR_AUTHORIZATION: 'authorization-error',
  ERROR_SERVICE_FAILURE: 'service-failure',
};

export function isErrorOfType(error: IErrorResponse, key: string): boolean {
  return !!(error && error.error && error.error.key === key);
}

export function getErrorString(error: IError): string {
  return error.message ? error.message : JSON.stringify(error);
}

export function isAuthenticationError(error: IErrorResponse) {
  const key = error.error.key;
  return key === ErrorTypes.ERROR_AUTHENTICATION;
}

export function isAuthorizationError(error: IErrorResponse) {
  return error.error.key === ErrorTypes.ERROR_AUTHORIZATION;
}

export function getErrorMessageForClient(error: IErrorResponse): IErrorResponse {
  if (error && error.error && error.error.key) {
    return { error: error.error };
  } else {
    return { error: { key: ErrorTypes.ERROR_SERVICE_FAILURE } };
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
      if (errorMessage.error.key === ErrorTypes.ERROR_SERVICE_FAILURE) {
        res.status(500).send(errorMessage);
      } else {
        res.status(400).send(errorMessage);
      }
    }
  };
}
