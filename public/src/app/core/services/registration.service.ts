import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { LogService } from './log.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ICodeReservationRequest, IRegistrationRequest, IRegistrationTO } from '../../../api-contracts/registration';
import { catchError } from 'rxjs/operators';
import { take } from 'rxjs/operator/take';
import { AdminUser, AuthService } from './auth.service';

@Injectable()
export class RegistrationService extends ApiService {

  constructor(
    protected http: HttpClient,
    protected logger: LogService,
    protected auth: AuthService,
  ) {
    super(http, logger);
  }

  public checkCode(code: string): Observable<boolean> {
    const url: string = this.baseUrl + '/register/' + code;
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }

  public submitRegistration(code: string, email: string, openedPageAt: Date, nrOfNoClicks: number) {
    const url: string = this.baseUrl + '/register/' + code;
    const request: IRegistrationRequest = {
      code,
      email,
      openedPageAt,
      nrOfNoClicks,
    };

    return this.http.post(url, request).pipe(
      catchError(this.handleError)
    );
  }

  /*
  Admin
   */
  public reserveNewCode(email: string) {
    const url: string = this.baseUrl + '/admin/registrations/generate';
    const request: ICodeReservationRequest = {
      email,
      createdBy: this.auth.getAdminUser(),
    };

    return this.http.post(url, request).pipe(
      catchError(this.handleError)
    );
  }

  public getAllReservations(): Observable<IRegistrationTO[]> {
    const url: string = this.baseUrl + '/admin/registrations';
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }

  public getAllReservationsBy(user: AdminUser): Observable<IRegistrationTO[]> {
    const url: string = this.baseUrl + '/admin/registrations?by=' + user;
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }


}
