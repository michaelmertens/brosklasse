import { Component, OnInit } from '@angular/core';
import { AdminUser, AuthService } from '../../../core/services/auth.service';
import { RegistrationService } from '../../../core/services/registration.service';
import { finalize } from 'rxjs/operators';
import { IRegistrationTO } from '../../../../api-contracts/registration';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public email: string;
  public results: IRegistrationTO[];

  constructor(
    private registrationService: RegistrationService,
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData(): void {
    this.registrationService.getAllReservations().subscribe((list: IRegistrationTO[]) => {
      this.results = list;
    });
  }
}
