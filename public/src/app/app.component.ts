import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ApiService } from './core/services/api.service';
import { IError } from '../api-contracts/common';
import { take, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private openedAt: moment.Moment;
  private nrOfNoClick: number;
  public code: string;
  public email: string;
  public error: IError;
  public isSubmitting: boolean;
  public isSubmitted: boolean;

  constructor(
    private apiService: ApiService,
  ) {

  }

  public ngOnInit() {
    this.openedAt = moment();
    this.nrOfNoClick = 0;
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
