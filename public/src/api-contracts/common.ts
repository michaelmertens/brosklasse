export interface IError {
  key?: string;
  message?: string;
}

export interface IErrorResponse {
  status?: number;
  statusText?: string;
  error?: IError;
}
