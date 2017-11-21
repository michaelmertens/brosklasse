import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IRegistrationRequest } from '../../../api-contracts/registration';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { IErrorResponse } from '../../../api-contracts/common';
import { LogService } from './log.service';
import 'rxjs/add/operator/catch';

@Injectable()
export class ApiService {
  // TODO: get from environment through buildphase
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private logger: LogService,
  ) {
    this.baseUrl = window.location.origin + '/api';
  }

  public submitRegistration(code: string, email: string, openedPageAt: Date, nrOfNoClicks: number) {
    const url: string = this.baseUrl + '/register/' + code;
    const request: IRegistrationRequest = {
      code,
      email,
      openedPageAt,
      nrOfNoClicks,
    };

    return this.http.post(url, request)
      .catch(this.handleError);
  }

  public handleError(errResponse: HttpErrorResponse): ErrorObservable {
    return Observable.throw(this.processError(errResponse));
  }

  private processError(errResponse: HttpErrorResponse): IErrorResponse {
    const err = this.parseError(errResponse);
    err.error = Object.assign({ key: 'unknown-error' }, err.error);

    if (!errResponse || errResponse.error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      this.logger.warn('ApiService processing error', { originalError: err });
    } else {
      // The backend returned an unsuccessful response code.
      this.logger.log(`Backend returned ${errResponse.status} - ${errResponse.statusText || ''}: ${JSON.stringify(errResponse.error)}`);
    }
    return err;
  }

  private parseError(errResponse: HttpErrorResponse): any {
    try {
      if (typeof errResponse.error === 'string') {
        return JSON.parse(errResponse.error) || {};
      }
      return errResponse || {};
    } catch (err) {
      this.logger.error('Failed to parse ErrorResponse', { originalError: errResponse });
      return errResponse || {};
    }
  }

}
