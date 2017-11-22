import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ApiService } from '../core/services/api.service';
import { IError } from '../../api-contracts/common';
import { take, finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';


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
  public isSubmitting: boolean;
  public isSubmitted: boolean;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
  ) {

  }

  public ngOnInit() {
    this.openedAt = moment();
    this.nrOfNoClick = 0;
    this.route.params.subscribe((params) => {
      this.code = params.code;
    });
  }

  public codeChanged() {
    this.codeInput = (this.codeInput || '').toUpperCase();
    if (this.codeInput.length === 7) {
      this.code = this.codeInput;
    }
  }

  public decline() {
    this.nrOfNoClick += 1;
  }

  public submit() {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.apiService.submitRegistration(this.code, this.email, this.openedAt.toDate(), this.nrOfNoClick)
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
