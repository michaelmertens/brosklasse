export interface IError {
  key?: ErrorCode;
  message?: string;
}

export interface IErrorResponse {
  status?: number;
  statusText?: string;
  error?: IError;
}

export type ErrorCode =
  'unknown-error' |
  'authentication-error' |
  'authorization-error' |
  'not-found' |
  'service-failure' |
  'redirect-admin';
