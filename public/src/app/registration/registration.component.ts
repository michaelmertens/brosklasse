import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { IError, IErrorResponse } from '../../api-contracts/common';
import { take, finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrationService } from '../core/services/registration.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  private openedAt: moment.Moment;
  private nrOfNoClick: number;
  public code: string;
  public codeInput: string;

  public email: string;
  public error: IError;
  public isChecking: boolean;
  public isSubmitting: boolean;
  public isSubmitted: boolean;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private registrationService: RegistrationService,
  ) {
  }

  public ngOnInit() {
    this.openedAt = moment();
    this.nrOfNoClick = 0;
    this.route.params.subscribe((params) => {
      this.setCode(params.code);
    });
  }

  public codeChanged() {
    this.error = undefined;
    this.codeInput = (this.codeInput.substr(0,7) || '').toUpperCase();

    if (this.codeInput.length === 7) {
      this.code = this.codeInput;
      this.setCode(this.code);
    }
  }

  private setCode(code: string): void {
    if (!code || this.isChecking) return;

    this.isChecking = true;
    this.registrationService.checkCode(code).pipe(
      take(1),
      finalize(() => this.isChecking = false)
    ).subscribe(() => {
      this.code = code;
    }, (err: IErrorResponse) => {
      this.code = '';
      this.codeInput = '';

      // TODO: replace with authentication
      if (err.error.key === 'redirect-admin') {
        this.auth.makeAdmin();
        this.router.navigate(['admin']);
      }
      this.error = err.error;
    });
  }

  public decline(): void {
    this.nrOfNoClick += 1;
  }

  public convince(): void {

  }

  public submit(): void {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.registrationService.submitRegistration(this.code, this.email, this.openedAt.toDate(), this.nrOfNoClick)
      .pipe(
        take(1),
        finalize(() => this.isSubmitting = false)
      ).subscribe(() => {
      this.isSubmitted = true
    }, (err: IError) => {
      this.error = err;
    });
  }

}
