import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { IErrorResponse } from '../../../api-contracts/common';
import { LogService } from './log.service';
import { environment } from '../../../environments/environment';
import 'rxjs/add/observable/throw';

@Injectable()
export class ApiService {
  // TODO: get from environment through buildphase
  protected baseUrl: string;

  constructor(
    protected http: HttpClient,
    protected logger: LogService,
  ) {
    this.baseUrl = environment.apiBaseUrl +  '/api';
  }
  protected handleError = (errResponse: HttpErrorResponse): ErrorObservable => {
    return Observable.throw(this.processError(errResponse));
  }

  protected processError(errResponse: HttpErrorResponse): IErrorResponse {
    const err = this.parseError(errResponse);

    if (!errResponse || errResponse.error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      this.logger.warn('ApiService processing error', { originalError: err });
    } else {
      // The backend returned an unsuccessful response code.
      this.logger.log(`Backend returned ${errResponse.status} - ${errResponse.statusText || ''}: ${JSON.stringify(errResponse.error)}`);
    }
    return err;
  };

  private parseError(errResponse: HttpErrorResponse): IErrorResponse {
    const obj: IErrorResponse = {
      status: errResponse.status,
      statusText: errResponse.statusText,
    };

    const unknownError: IErrorResponse = { key: 'unknown-error' };
    if (!errResponse.error || !errResponse.error.error) {
      obj.error = unknownError;
      return obj;
    }

    try {
      obj.error = errResponse.error.error;
      if (typeof errResponse.error.error === 'string') {
        obj.error = JSON.parse(errResponse.error.error);
      }

      return obj;
    } catch (err) {
      this.logger.error('Failed to parse ErrorResponse', { originalError: errResponse.error });
      return obj;
    }
  }

}
